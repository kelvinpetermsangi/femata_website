<?php

namespace App\Http\Controllers\Admin;

use App\Models\AdminSection;
use App\Models\Association;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class AdministratorController extends AdminController
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()?->hasRole('super-admin'), 403);

        return Inertia::render('Admin/Administrators', [
            'users' => User::query()
                ->with(['roles', 'adminSections', 'associations:id,name,slug'])
                ->where(fn ($query) => $query->where('is_admin', true)->orWhereHas('roles'))
                ->orderBy('name')
                ->get()
                ->map(fn (User $user) => $this->mapUser($user))
                ->all(),
            'roles' => Role::query()->orderBy('name')->pluck('name')->all(),
            'sections' => AdminSection::query()->orderBy('name')->get(['id', 'name', 'slug'])->all(),
            'associations' => Association::query()->orderBy('name')->get(['id', 'name', 'slug'])->all(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_unless($request->user()?->hasRole('super-admin'), 403);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'string', Rule::exists('roles', 'name')],
            'admin_sections' => ['nullable', 'array'],
            'admin_sections.*' => ['string', Rule::exists('admin_sections', 'slug')],
            'association_ids' => ['nullable', 'array'],
            'association_ids.*' => ['integer', Rule::exists('associations', 'id')],
        ]);

        $user = User::query()->create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'is_admin' => true,
        ]);

        $user->syncRoles([$validated['role']]);
        $this->syncScopes($user, $validated);

        return redirect()
            ->route('admin.administrators.index')
            ->with('success', 'Administrator created successfully.');
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        abort_unless($request->user()?->hasRole('super-admin'), 403);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8'],
            'role' => ['required', 'string', Rule::exists('roles', 'name')],
            'admin_sections' => ['nullable', 'array'],
            'admin_sections.*' => ['string', Rule::exists('admin_sections', 'slug')],
            'association_ids' => ['nullable', 'array'],
            'association_ids.*' => ['integer', Rule::exists('associations', 'id')],
        ]);

        $payload = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'is_admin' => true,
        ];

        if (filled($validated['password'] ?? null)) {
            $payload['password'] = $validated['password'];
        }

        $user->update($payload);
        $user->syncRoles([$validated['role']]);
        $this->syncScopes($user, $validated);

        return redirect()
            ->route('admin.administrators.index')
            ->with('success', 'Administrator updated successfully.');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        abort_unless($request->user()?->hasRole('super-admin'), 403);
        abort_if($request->user()?->is($user), 422, 'You cannot delete your own administrator account.');

        $user->delete();

        return redirect()
            ->route('admin.administrators.index')
            ->with('success', 'Administrator removed successfully.');
    }

    private function syncScopes(User $user, array $validated): void
    {
        $sectionSlugs = collect($validated['admin_sections'] ?? []);

        if (! empty($validated['association_ids'] ?? [])) {
            $sectionSlugs->push(AdminSection::ASSOCIATIONS);
        }

        $sectionIds = AdminSection::query()
            ->whereIn('slug', $sectionSlugs->unique()->values()->all())
            ->pluck('id')
            ->all();

        $user->adminSections()->sync($sectionIds);
        $user->associations()->sync($validated['association_ids'] ?? []);
    }

    private function mapUser(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'is_admin' => $user->is_admin,
            'role' => $user->getRoleNames()->first(),
            'roles' => $user->getRoleNames()->values()->all(),
            'admin_sections' => $user->adminSections->pluck('slug')->all(),
            'association_ids' => $user->associations->pluck('id')->all(),
            'managed_associations' => $user->associations
                ->map(fn (Association $association) => [
                    'id' => $association->id,
                    'name' => $association->name,
                    'slug' => $association->slug,
                ])
                ->values()
                ->all(),
        ];
    }
}
