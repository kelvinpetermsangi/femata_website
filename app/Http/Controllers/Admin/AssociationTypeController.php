<?php

namespace App\Http\Controllers\Admin;

use App\Models\AssociationType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AssociationTypeController extends AdminController
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', AssociationType::class);

        return Inertia::render('Admin/AssociationTypes', [
            'associationTypes' => AssociationType::query()
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get()
                ->map(fn (AssociationType $type) => [
                    'id' => $type->id,
                    'name' => $type->name,
                    'slug' => $type->slug,
                    'description' => $type->description,
                    'sort_order' => $type->sort_order,
                    'is_active' => $type->is_active,
                    'association_count' => $type->associations()->count(),
                ])
                ->all(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', AssociationType::class);
        $data = $this->validated($request);

        AssociationType::query()->create($this->payload($data));

        return redirect()
            ->route('admin.association-types.index')
            ->with('success', 'Association type created successfully.');
    }

    public function update(Request $request, AssociationType $associationType): RedirectResponse
    {
        $this->authorize('update', $associationType);
        $data = $this->validated($request, $associationType);

        $associationType->update($this->payload($data, $associationType));

        return redirect()
            ->route('admin.association-types.index')
            ->with('success', 'Association type updated successfully.');
    }

    public function destroy(Request $request, AssociationType $associationType): RedirectResponse
    {
        $this->authorize('delete', $associationType);
        $associationType->delete();

        return redirect()
            ->route('admin.association-types.index')
            ->with('success', 'Association type deleted successfully.');
    }

    private function validated(Request $request, ?AssociationType $associationType = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:association_types,slug,'.($associationType?->id ?? 'NULL').',id'],
            'description' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'is_active' => ['required', 'boolean'],
        ]);
    }

    private function payload(array $data, ?AssociationType $associationType = null): array
    {
        return [
            'name' => $data['name'],
            'slug' => $this->uniqueSlug($data['slug'] ?: $data['name'], $associationType?->id),
            'description' => $data['description'] ?? null,
            'sort_order' => (int) ($data['sort_order'] ?? 0),
            'is_active' => (bool) $data['is_active'],
        ];
    }

    private function uniqueSlug(string $value, ?int $ignoreId = null): string
    {
        $base = Str::slug($value);
        $base = $base !== '' ? $base : 'association-type';
        $slug = $base;
        $suffix = 2;

        while (
            AssociationType::query()
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
