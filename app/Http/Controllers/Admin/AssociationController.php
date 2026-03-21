<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\StoreAssociationRequest;
use App\Models\Association;
use App\Models\Document;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AssociationController extends AdminController
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Association::class);

        return Inertia::render('Admin/Associations', [
            'associations' => Association::query()
                ->with('documents')
                ->orderBy('name')
                ->get()
                ->map(fn (Association $association) => [
                    'id' => $association->id,
                    'name' => $association->name,
                    'slug' => $association->slug,
                    'region' => $association->region,
                    'district' => $association->district,
                    'address' => $association->address,
                    'phone' => $association->phone,
                    'email' => $association->email,
                    'website' => $association->website,
                    'logo_path' => $association->logo_path,
                    'description' => $association->description,
                    'chairperson_name' => $association->chairperson_name,
                    'secretary_name' => $association->secretary_name,
                    'is_active' => $association->is_active,
                    'document_ids' => $association->documents->pluck('id')->all(),
                ])->all(),
            'documents' => Document::query()->orderBy('title')->get(['id', 'title', 'slug']),
        ]);
    }

    public function store(StoreAssociationRequest $request): RedirectResponse
    {
        $this->authorize('create', Association::class);
        $data = $request->validated();
        $association = Association::query()->create($this->payload($data));
        $association->documents()->sync($data['document_ids'] ?? []);

        return redirect()->route('admin.associations.index')->with('success', 'Association created successfully.');
    }

    public function update(StoreAssociationRequest $request, Association $association): RedirectResponse
    {
        $this->authorize('update', $association);
        $data = $request->validated();
        $association->update($this->payload($data, $association));
        $association->documents()->sync($data['document_ids'] ?? []);

        return redirect()->route('admin.associations.index')->with('success', 'Association updated successfully.');
    }

    public function destroy(Request $request, Association $association): RedirectResponse
    {
        $this->authorize('delete', $association);
        $association->delete();

        return redirect()->route('admin.associations.index')->with('success', 'Association deleted successfully.');
    }

    private function payload(array $data, ?Association $association = null): array
    {
        return [
            'name' => $data['name'],
            'slug' => $this->generateUniqueSlug($data['slug'] ?: $data['name'], $association?->id),
            'region' => $data['region'] ?? null,
            'district' => $data['district'] ?? null,
            'address' => $data['address'] ?? null,
            'phone' => $data['phone'] ?? null,
            'email' => $data['email'] ?? null,
            'website' => $data['website'] ?? null,
            'logo_path' => $data['logo_path'] ?? null,
            'description' => $data['description'] ?? null,
            'chairperson_name' => $data['chairperson_name'] ?? null,
            'secretary_name' => $data['secretary_name'] ?? null,
            'is_active' => (bool) $data['is_active'],
        ];
    }

    private function generateUniqueSlug(string $value, ?int $ignoreId = null): string
    {
        $base = Str::slug($value);
        $base = $base !== '' ? $base : 'association';
        $slug = $base;
        $suffix = 2;

        while (
            Association::query()
                ->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = $base.'-'.$suffix;
            $suffix++;
        }

        return $slug;
    }
}
