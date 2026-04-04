<?php

namespace App\Http\Requests\Admin;

use App\Models\Association;
use App\Support\TanzaniaRegions;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAssociationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAdminAccess() ?? false;
    }

    public function rules(): array
    {
        $association = $this->route('association');

        return [
            'name' => ['required', 'string', 'max:255'],
            'association_type_id' => ['nullable', 'integer', 'exists:association_types,id'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('associations', 'slug')->ignore($association?->id)],
            'region' => ['nullable', 'string', 'max:255'],
            'regions' => ['nullable', 'array'],
            'regions.*' => ['string', Rule::in(TanzaniaRegions::all())],
            'district' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'postal_address' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:60'],
            'email' => ['nullable', 'email', 'max:255'],
            'website' => ['nullable', 'url', 'max:255'],
            'rema_website_url' => ['nullable', 'url', 'max:255'],
            'logo_path' => ['nullable', 'string', 'max:2048'],
            'hero_image' => ['nullable', 'string', 'max:2048'],
            'description' => ['nullable', 'string'],
            'homepage_title' => ['nullable', 'string', 'max:255'],
            'homepage_intro' => ['nullable', 'string'],
            'mission' => ['nullable', 'string'],
            'vision' => ['nullable', 'string'],
            'gender_commitment' => ['nullable', 'string'],
            'esg_commitment' => ['nullable', 'string'],
            'about_title' => ['nullable', 'string', 'max:255'],
            'about_body' => ['nullable', 'string'],
            'focus_areas' => ['nullable', 'string'],
            'profile_pages' => ['nullable', 'array'],
            'profile_pages.*.key' => ['required_with:profile_pages', Rule::in(Association::supportedPageKeys())],
            'profile_pages.*.label' => ['nullable', 'string', 'max:80'],
            'profile_pages.*.slug' => ['nullable', 'string', 'max:80'],
            'profile_pages.*.headline' => ['nullable', 'string', 'max:255'],
            'profile_pages.*.intro' => ['nullable', 'string', 'max:500'],
            'profile_pages.*.visible' => ['required_with:profile_pages', 'boolean'],
            'highlights' => ['nullable', 'array'],
            'highlights.*.title' => ['nullable', 'string', 'max:120'],
            'highlights.*.text' => ['nullable', 'string', 'max:500'],
            'leaders' => ['nullable', 'array'],
            'leaders.*.name' => ['nullable', 'string', 'max:120'],
            'leaders.*.group' => ['nullable', Rule::in(Association::supportedLeaderGroups())],
            'leaders.*.title' => ['nullable', 'string', 'max:120'],
            'leaders.*.bio' => ['nullable', 'string', 'max:1200'],
            'leaders.*.photo_path' => ['nullable', 'string', 'max:2048'],
            'leaders.*.email' => ['nullable', 'email', 'max:255'],
            'leaders.*.phone' => ['nullable', 'string', 'max:60'],
            'leaders.*.contact_qr_path' => ['nullable', 'string', 'max:2048'],
            'gallery' => ['nullable', 'array'],
            'gallery.*.image_path' => ['nullable', 'string', 'max:2048'],
            'gallery.*.caption' => ['nullable', 'string', 'max:500'],
            'gallery.*.event_title' => ['nullable', 'string', 'max:160'],
            'gallery.*.event_date' => ['nullable', 'date'],
            'chairperson_name' => ['nullable', 'string', 'max:255'],
            'secretary_name' => ['nullable', 'string', 'max:255'],
            'contact_title' => ['nullable', 'string', 'max:255'],
            'contact_body' => ['nullable', 'string'],
            'map_embed_url' => ['nullable', 'url', 'max:2048'],
            'google_map_url' => ['nullable', 'url', 'max:2048'],
            'apple_map_url' => ['nullable', 'url', 'max:2048'],
            'social_links' => ['nullable', 'array'],
            'social_links.*.platform' => ['required_with:social_links', Rule::in(Association::supportedSocialPlatforms())],
            'social_links.*.url' => ['nullable', 'url', 'max:255'],
            'social_links.*.visible' => ['required_with:social_links', 'boolean'],
            'is_active' => ['required', 'boolean'],
            'document_ids' => ['nullable', 'array'],
            'document_ids.*' => ['integer', 'exists:documents,id'],
        ];
    }
}
