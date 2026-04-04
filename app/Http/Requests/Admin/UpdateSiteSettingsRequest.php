<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSiteSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAdminAccess() ?? false;
    }

    public function rules(): array
    {
        return [
            'branding.site_name' => ['required', 'string', 'max:80'],
            'branding.organization_name' => ['required', 'string', 'max:255'],
            'branding.top_bar_primary' => ['required', 'string', 'max:120'],
            'branding.top_bar_secondary' => ['nullable', 'string', 'max:255'],
            'branding.logo_path' => ['nullable', 'string', 'max:2048'],
            'branding.logo_alt' => ['nullable', 'string', 'max:255'],
            'branding.settings_label' => ['required', 'string', 'max:40'],
            'branding.navigation_cta_label' => ['required', 'string', 'max:80'],
            'branding.navigation_cta_href' => ['required', 'string', 'max:255'],
            'home' => ['required', 'array'],
            'about' => ['required', 'array'],
            'contact' => ['required', 'array'],
            'contact.phone' => ['required', 'string', 'max:80'],
            'contact.email' => ['required', 'email', 'max:255'],
            'contact.address' => ['required', 'string', 'max:255'],
            'contact.postal_address' => ['nullable', 'string', 'max:255'],
            'contact.description' => ['required', 'string'],
            'contact.booking_email' => ['nullable', 'email', 'max:255'],
            'contact.booking_sender_name' => ['nullable', 'string', 'max:255'],
            'contact.map_embed_url' => ['nullable', 'url', 'max:2048'],
            'contact.google_map_url' => ['nullable', 'url', 'max:2048'],
            'contact.apple_map_url' => ['nullable', 'url', 'max:2048'],
            'footer' => ['required', 'array'],
        ];
    }
}
