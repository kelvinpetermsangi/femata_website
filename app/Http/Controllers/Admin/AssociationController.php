<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\StoreAssociationRequest;
use App\Models\Association;
use App\Models\AssociationType;
use App\Models\Document;
use App\Support\TanzaniaRegions;
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
                ->with(['documents', 'associationType'])
                ->orderBy('name')
                ->get()
                ->map(fn (Association $association) => $this->mapAssociation($association))
                ->all(),
            'documents' => Document::query()->orderBy('title')->get(['id', 'title', 'slug']),
            'associationTypes' => AssociationType::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(['id', 'name', 'slug'])
                ->all(),
            'regionOptions' => TanzaniaRegions::all(),
        ]);
    }

    public function show(Request $request, Association $association): Response
    {
        $this->authorize('update', $association);

        $association->load(['documents', 'associationType']);

        return Inertia::render('Admin/AssociationProfile', [
            'association' => $this->mapAssociation($association, true),
            'documents' => Document::query()->orderBy('title')->get(['id', 'title', 'slug']),
            'associationTypes' => AssociationType::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(['id', 'name', 'slug'])
                ->all(),
            'regionOptions' => TanzaniaRegions::all(),
        ]);
    }

    public function store(StoreAssociationRequest $request): RedirectResponse
    {
        $this->authorize('create', Association::class);
        $data = $request->validated();
        $association = Association::query()->create($this->payload($data));
        $association->documents()->sync($data['document_ids'] ?? []);

        return redirect()
            ->route('admin.associations.show', $association)
            ->with('success', 'Association created. Continue building its public profile.');
    }

    public function update(StoreAssociationRequest $request, Association $association): RedirectResponse
    {
        $this->authorize('update', $association);
        $data = $request->validated();
        $association->update($this->payload($data, $association));
        $association->documents()->sync($data['document_ids'] ?? []);

        return redirect()
            ->route('admin.associations.show', $association)
            ->with('success', 'Association profile updated successfully.');
    }

    public function destroy(Request $request, Association $association): RedirectResponse
    {
        $this->authorize('delete', $association);
        $association->delete();

        return redirect()->route('admin.associations.index')->with('success', 'Association deleted successfully.');
    }

    private function payload(array $data, ?Association $association = null): array
    {
        $regions = collect($data['regions'] ?? [])
            ->map(fn ($region) => trim((string) $region))
            ->filter()
            ->values()
            ->all();

        if ($regions === [] && filled($data['region'] ?? null)) {
            $regions = [trim((string) $data['region'])];
        }

        $socialLinks = Association::normalizeSocialLinks(
            $data['social_links'] ?? [],
            $data['website'] ?? null,
            $data['rema_website_url'] ?? null,
        );
        $website = data_get(
            collect($socialLinks)->firstWhere('platform', 'website'),
            'url',
        );

        return [
            'name' => $data['name'],
            'association_type_id' => $data['association_type_id'] ?? null,
            'slug' => $this->generateUniqueSlug($data['slug'] ?: $data['name'], $association?->id),
            'region' => $regions[0] ?? ($data['region'] ?? null),
            'regions' => $regions === [] ? null : $regions,
            'district' => $data['district'] ?? null,
            'address' => $data['address'] ?? null,
            'postal_address' => $data['postal_address'] ?? null,
            'phone' => $data['phone'] ?? null,
            'email' => $data['email'] ?? null,
            'website' => $website,
            'rema_website_url' => $data['rema_website_url'] ?? null,
            'logo_path' => $data['logo_path'] ?? null,
            'hero_image' => $data['hero_image'] ?? null,
            'description' => $data['description'] ?? null,
            'homepage_title' => $data['homepage_title'] ?? null,
            'homepage_intro' => $data['homepage_intro'] ?? null,
            'mission' => $data['mission'] ?? null,
            'vision' => $data['vision'] ?? null,
            'gender_commitment' => $data['gender_commitment'] ?? null,
            'esg_commitment' => $data['esg_commitment'] ?? null,
            'about_title' => $data['about_title'] ?? null,
            'about_body' => $data['about_body'] ?? null,
            'focus_areas' => $data['focus_areas'] ?? null,
            'highlights' => $this->sanitizeHighlights($data['highlights'] ?? []),
            'leaders' => $this->sanitizeLeaders($data['leaders'] ?? []),
            'gallery' => $this->sanitizeGallery($data['gallery'] ?? []),
            'profile_pages' => Association::normalizeProfilePages($data['profile_pages'] ?? [], $data['name']),
            'social_links' => $socialLinks,
            'chairperson_name' => $data['chairperson_name'] ?? null,
            'secretary_name' => $data['secretary_name'] ?? null,
            'contact_title' => $data['contact_title'] ?? null,
            'contact_body' => $data['contact_body'] ?? null,
            'is_active' => (bool) $data['is_active'],
        ];
    }

    private function mapAssociation(Association $association, bool $withProfile = false): array
    {
        $regions = collect($association->regions ?? [])
            ->filter()
            ->values()
            ->all();

        if ($regions === [] && $association->region) {
            $regions = [$association->region];
        }

        $payload = [
            'id' => $association->id,
            'name' => $association->name,
            'slug' => $association->slug,
            'association_type_id' => $association->association_type_id,
            'association_type' => $association->associationType
                ? [
                    'id' => $association->associationType->id,
                    'name' => $association->associationType->name,
                    'slug' => $association->associationType->slug,
                ]
                : null,
            'region' => $association->region,
            'regions' => $regions,
            'district' => $association->district,
            'address' => $association->address,
            'postal_address' => $association->postal_address,
            'phone' => $association->phone,
            'email' => $association->email,
            'website' => $association->website,
            'rema_website_url' => $association->rema_website_url,
            'logo_path' => $association->logo_path,
            'hero_image' => $association->hero_image,
            'description' => $association->description,
            'homepage_title' => $association->homepage_title,
            'homepage_intro' => $association->homepage_intro,
            'mission' => $association->mission,
            'vision' => $association->vision,
            'gender_commitment' => $association->gender_commitment,
            'esg_commitment' => $association->esg_commitment,
            'about_title' => $association->about_title,
            'about_body' => $association->about_body,
            'focus_areas' => $association->focus_areas,
            'chairperson_name' => $association->chairperson_name,
            'secretary_name' => $association->secretary_name,
            'contact_title' => $association->contact_title,
            'contact_body' => $association->contact_body,
            'is_active' => $association->is_active,
            'document_ids' => $association->documents->pluck('id')->all(),
            'document_count' => $association->documents->count(),
            'leaders_count' => count($association->leaders ?? []),
            'gallery_count' => count($association->gallery ?? []),
            'visible_page_count' => collect(
                Association::normalizeProfilePages($association->profile_pages, $association->name),
            )->where('visible', true)->count(),
        ];

        if (! $withProfile) {
            return $payload;
        }

        return [
            ...$payload,
            'highlights' => collect($association->highlights ?? [])
                ->filter(fn ($item) => filled(data_get($item, 'title')) || filled(data_get($item, 'text')))
                ->values()
                ->all(),
            'leaders' => collect($association->leaders ?? [])
                ->filter(fn ($item) => filled(data_get($item, 'name')))
                ->values()
                ->all(),
            'gallery' => collect($association->gallery ?? [])
                ->filter(fn ($item) => filled(data_get($item, 'image_path')))
                ->values()
                ->all(),
            'profile_pages' => Association::normalizeProfilePages($association->profile_pages, $association->name),
            'social_links' => Association::normalizeSocialLinks(
                $association->social_links,
                $association->website,
                $association->rema_website_url,
            ),
        ];
    }

    private function sanitizeHighlights(array $items): array
    {
        return collect($items)
            ->map(fn ($item) => [
                'title' => trim((string) data_get($item, 'title')),
                'text' => trim((string) data_get($item, 'text')),
            ])
            ->filter(fn (array $item) => $item['title'] !== '' || $item['text'] !== '')
            ->values()
            ->all();
    }

    private function sanitizeLeaders(array $items): array
    {
        return collect($items)
            ->map(fn ($item) => [
                'name' => trim((string) data_get($item, 'name')),
                'title' => trim((string) data_get($item, 'title')),
                'bio' => trim((string) data_get($item, 'bio')),
                'photo_path' => trim((string) data_get($item, 'photo_path')),
                'email' => trim((string) data_get($item, 'email')),
                'phone' => trim((string) data_get($item, 'phone')),
                'contact_qr_path' => trim((string) data_get($item, 'contact_qr_path')),
            ])
            ->filter(fn (array $item) => $item['name'] !== '')
            ->values()
            ->all();
    }

    private function sanitizeGallery(array $items): array
    {
        return collect($items)
            ->map(fn ($item) => [
                'image_path' => trim((string) data_get($item, 'image_path')),
                'caption' => trim((string) data_get($item, 'caption')),
            ])
            ->filter(fn (array $item) => $item['image_path'] !== '')
            ->values()
            ->all();
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
