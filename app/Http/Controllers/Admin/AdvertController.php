<?php

namespace App\Http\Controllers\Admin;

use App\Models\Advert;
use App\Models\Association;
use App\Models\AssociationType;
use App\Support\TanzaniaRegions;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdvertController extends AdminController
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Advert::class);

        return Inertia::render('Admin/Adverts', [
            'adverts' => Advert::query()
                ->with(['association:id,name,slug', 'associationType:id,name,slug'])
                ->orderBy('slot_number')
                ->orderBy('display_order')
                ->orderBy('title')
                ->get()
                ->map(fn (Advert $advert) => $this->mapAdvert($advert))
                ->all(),
            'associations' => Association::query()
                ->orderBy('name')
                ->get(['id', 'name', 'slug', 'association_type_id', 'region', 'regions'])
                ->map(fn (Association $association) => [
                    'id' => $association->id,
                    'name' => $association->name,
                    'slug' => $association->slug,
                ])
                ->all(),
            'associationTypes' => AssociationType::query()
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(['id', 'name', 'slug'])
                ->all(),
            'pageOptions' => collect(Advert::pageOptions())
                ->map(fn (string $label, string $value) => ['value' => $value, 'label' => $label])
                ->values()
                ->all(),
            'placementScopes' => collect(Advert::placementScopes())
                ->map(fn (string $label, string $value) => ['value' => $value, 'label' => $label])
                ->values()
                ->all(),
            'regionOptions' => TanzaniaRegions::all(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Advert::class);
        $data = $this->validated($request);

        Advert::query()->create($this->payload($data));

        return redirect()
            ->route('admin.adverts.index')
            ->with('success', 'Advert created successfully.');
    }

    public function update(Request $request, Advert $advert): RedirectResponse
    {
        $this->authorize('update', $advert);
        $data = $this->validated($request, $advert);

        $advert->update($this->payload($data, $advert));

        return redirect()
            ->route('admin.adverts.index')
            ->with('success', 'Advert updated successfully.');
    }

    public function destroy(Request $request, Advert $advert): RedirectResponse
    {
        $this->authorize('delete', $advert);
        $advert->delete();

        return redirect()
            ->route('admin.adverts.index')
            ->with('success', 'Advert deleted successfully.');
    }

    private function validated(Request $request, ?Advert $advert = null): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('adverts', 'slug')->ignore($advert?->id)],
            'media_type' => ['required', Rule::in(['image', 'video'])],
            'asset_url' => ['required', 'url', 'max:2048'],
            'poster_url' => ['nullable', 'url', 'max:2048'],
            'headline' => ['nullable', 'string', 'max:255'],
            'body' => ['nullable', 'string'],
            'cta_label' => ['nullable', 'string', 'max:120'],
            'cta_url' => ['nullable', 'url', 'max:2048'],
            'page_key' => ['required', Rule::in(array_keys(Advert::pageOptions()))],
            'slot_number' => ['required', 'integer', 'min:1', 'max:12'],
            'placement_scope' => ['required', Rule::in(array_keys(Advert::placementScopes()))],
            'association_id' => [
                Rule::requiredIf(fn () => $request->input('placement_scope') === Advert::SCOPE_ASSOCIATION),
                'nullable',
                'integer',
                'exists:associations,id',
            ],
            'association_type_id' => [
                Rule::requiredIf(fn () => $request->input('placement_scope') === Advert::SCOPE_ASSOCIATION_TYPE),
                'nullable',
                'integer',
                'exists:association_types,id',
            ],
            'region' => [
                Rule::requiredIf(fn () => $request->input('placement_scope') === Advert::SCOPE_REGION),
                'nullable',
                Rule::in(TanzaniaRegions::all()),
            ],
            'display_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'duration_seconds' => ['nullable', 'integer', 'min:3', 'max:30'],
            'is_active' => ['required', 'boolean'],
        ]);
    }

    private function payload(array $data, ?Advert $advert = null): array
    {
        $scope = $data['placement_scope'];

        return [
            'title' => $data['title'],
            'slug' => $this->uniqueSlug($data['slug'] ?: $data['title'], $advert?->id),
            'media_type' => $data['media_type'],
            'asset_url' => $data['asset_url'],
            'poster_url' => $data['poster_url'] ?? null,
            'headline' => $data['headline'] ?? null,
            'body' => $data['body'] ?? null,
            'cta_label' => $data['cta_label'] ?? null,
            'cta_url' => $data['cta_url'] ?? null,
            'page_key' => $data['page_key'],
            'slot_number' => (int) $data['slot_number'],
            'placement_scope' => $scope,
            'association_id' => $scope === Advert::SCOPE_ASSOCIATION ? ($data['association_id'] ?? null) : null,
            'association_type_id' => $scope === Advert::SCOPE_ASSOCIATION_TYPE ? ($data['association_type_id'] ?? null) : null,
            'region' => $scope === Advert::SCOPE_REGION ? ($data['region'] ?? null) : null,
            'display_order' => (int) ($data['display_order'] ?? 0),
            'duration_seconds' => (int) ($data['duration_seconds'] ?? ($data['media_type'] === 'video' ? 10 : 6)),
            'is_active' => (bool) $data['is_active'],
        ];
    }

    private function mapAdvert(Advert $advert): array
    {
        return [
            'id' => $advert->id,
            'title' => $advert->title,
            'slug' => $advert->slug,
            'media_type' => $advert->media_type,
            'asset_url' => $advert->asset_url,
            'poster_url' => $advert->poster_url,
            'headline' => $advert->headline,
            'body' => $advert->body,
            'cta_label' => $advert->cta_label,
            'cta_url' => $advert->cta_url,
            'page_key' => $advert->page_key,
            'page_label' => Advert::pageOptions()[$advert->page_key] ?? $advert->page_key,
            'slot_number' => $advert->slot_number,
            'placement_scope' => $advert->placement_scope,
            'placement_label' => Advert::placementScopes()[$advert->placement_scope] ?? $advert->placement_scope,
            'association_id' => $advert->association_id,
            'association_type_id' => $advert->association_type_id,
            'association_name' => $advert->association?->name,
            'association_type_name' => $advert->associationType?->name,
            'region' => $advert->region,
            'display_order' => $advert->display_order,
            'duration_seconds' => $advert->duration_seconds,
            'is_active' => $advert->is_active,
        ];
    }

    private function uniqueSlug(string $value, ?int $ignoreId = null): string
    {
        $base = Str::slug($value);
        $base = $base !== '' ? $base : 'advert';
        $slug = $base;
        $suffix = 2;

        while (
            Advert::query()
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
