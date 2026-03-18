<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Support\SiteSettings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SiteSettingsController extends Controller
{
    public function index(): Response
    {
        $home = SiteSettings::home();
        $footer = SiteSettings::footer();

        return Inertia::render('Admin/Settings', [
            'branding' => SiteSettings::branding(),
            'home' => [
                ...$home,
                'highlights_text' => $this->implodeEntries($home['highlights'] ?? [], ['label', 'text']),
                'pillars_text' => $this->implodeEntries($home['pillars'] ?? [], ['title', 'text']),
                'zones_text' => $this->implodeEntries($home['zones'] ?? [], ['name', 'focus', 'base']),
                'partners_text' => implode(PHP_EOL, $home['partners'] ?? []),
            ],
            'about' => SiteSettings::about(),
            'contact' => SiteSettings::contact(),
            'footer' => [
                ...$footer,
                'chips_text' => implode(PHP_EOL, $footer['chips'] ?? []),
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'branding.site_name' => ['required', 'string', 'max:80'],
            'branding.organization_name' => ['required', 'string', 'max:255'],
            'branding.top_bar_primary' => ['required', 'string', 'max:120'],
            'branding.top_bar_secondary' => ['nullable', 'string', 'max:255'],
            'branding.logo_path' => ['nullable', 'string', 'max:2048'],
            'branding.logo_alt' => ['nullable', 'string', 'max:255'],
            'branding.settings_label' => ['required', 'string', 'max:40'],
            'branding.navigation_cta_label' => ['required', 'string', 'max:80'],
            'branding.navigation_cta_href' => ['required', 'string', 'max:255'],

            'home.hero_image' => ['nullable', 'string', 'max:2048'],
            'home.hero_panel_label' => ['required', 'string', 'max:80'],
            'home.why_eyebrow' => ['required', 'string', 'max:80'],
            'home.why_title' => ['required', 'string', 'max:255'],
            'home.why_text' => ['required', 'string'],
            'home.mandate_label' => ['required', 'string', 'max:80'],
            'home.mandate_title' => ['required', 'string', 'max:255'],
            'home.mandate_text' => ['required', 'string'],
            'home.highlights_text' => ['nullable', 'string'],
            'home.pillars_text' => ['nullable', 'string'],
            'home.footprint_eyebrow' => ['required', 'string', 'max:80'],
            'home.footprint_title' => ['required', 'string', 'max:255'],
            'home.footprint_text' => ['required', 'string'],
            'home.zones_text' => ['nullable', 'string'],
            'home.news_eyebrow' => ['required', 'string', 'max:80'],
            'home.news_title' => ['required', 'string', 'max:255'],
            'home.news_text' => ['required', 'string'],
            'home.leadership_eyebrow' => ['required', 'string', 'max:80'],
            'home.leadership_title' => ['required', 'string', 'max:255'],
            'home.leadership_text' => ['required', 'string'],
            'home.media_eyebrow' => ['required', 'string', 'max:80'],
            'home.media_title' => ['required', 'string', 'max:255'],
            'home.media_text' => ['required', 'string'],
            'home.documents_eyebrow' => ['required', 'string', 'max:80'],
            'home.documents_title' => ['required', 'string', 'max:255'],
            'home.documents_text' => ['required', 'string'],
            'home.partnerships_eyebrow' => ['required', 'string', 'max:80'],
            'home.partnerships_title' => ['required', 'string', 'max:255'],
            'home.partnerships_text' => ['required', 'string'],
            'home.partners_text' => ['nullable', 'string'],
            'home.secondary_cta_label' => ['required', 'string', 'max:80'],

            'about.title' => ['required', 'string', 'max:255'],
            'about.body' => ['required', 'string'],
            'about.mission' => ['required', 'string'],
            'about.vision' => ['required', 'string'],
            'about.values' => ['required', 'string'],

            'contact.phone' => ['required', 'string', 'max:80'],
            'contact.email' => ['required', 'email', 'max:255'],
            'contact.address' => ['required', 'string', 'max:255'],
            'contact.postal_address' => ['nullable', 'string', 'max:255'],
            'contact.description' => ['required', 'string'],

            'footer.strapline' => ['required', 'string', 'max:255'],
            'footer.description' => ['required', 'string'],
            'footer.chips_text' => ['nullable', 'string'],
            'footer.prompt_text' => ['required', 'string'],
            'footer.credit_name' => ['nullable', 'string', 'max:120'],
            'footer.credit_url' => ['nullable', 'string', 'max:2048'],
        ]);

        SiteSetting::updateOrCreate(['key' => 'branding'], ['value' => $data['branding']]);

        SiteSetting::updateOrCreate(['key' => 'home'], [
            'value' => [
                'hero_image' => $data['home']['hero_image'],
                'hero_panel_label' => $data['home']['hero_panel_label'],
                'why_eyebrow' => $data['home']['why_eyebrow'],
                'why_title' => $data['home']['why_title'],
                'why_text' => $data['home']['why_text'],
                'mandate_label' => $data['home']['mandate_label'],
                'mandate_title' => $data['home']['mandate_title'],
                'mandate_text' => $data['home']['mandate_text'],
                'highlights' => $this->explodeEntries($data['home']['highlights_text'] ?? '', ['label', 'text']),
                'pillars' => $this->explodeEntries($data['home']['pillars_text'] ?? '', ['title', 'text']),
                'footprint_eyebrow' => $data['home']['footprint_eyebrow'],
                'footprint_title' => $data['home']['footprint_title'],
                'footprint_text' => $data['home']['footprint_text'],
                'zones' => $this->explodeEntries($data['home']['zones_text'] ?? '', ['name', 'focus', 'base']),
                'news_eyebrow' => $data['home']['news_eyebrow'],
                'news_title' => $data['home']['news_title'],
                'news_text' => $data['home']['news_text'],
                'leadership_eyebrow' => $data['home']['leadership_eyebrow'],
                'leadership_title' => $data['home']['leadership_title'],
                'leadership_text' => $data['home']['leadership_text'],
                'media_eyebrow' => $data['home']['media_eyebrow'],
                'media_title' => $data['home']['media_title'],
                'media_text' => $data['home']['media_text'],
                'documents_eyebrow' => $data['home']['documents_eyebrow'],
                'documents_title' => $data['home']['documents_title'],
                'documents_text' => $data['home']['documents_text'],
                'partnerships_eyebrow' => $data['home']['partnerships_eyebrow'],
                'partnerships_title' => $data['home']['partnerships_title'],
                'partnerships_text' => $data['home']['partnerships_text'],
                'partners' => $this->splitLines($data['home']['partners_text'] ?? ''),
                'secondary_cta_label' => $data['home']['secondary_cta_label'],
            ],
        ]);

        SiteSetting::updateOrCreate(['key' => 'about'], ['value' => $data['about']]);
        SiteSetting::updateOrCreate(['key' => 'contact'], ['value' => $data['contact']]);
        SiteSetting::updateOrCreate(['key' => 'footer'], [
            'value' => [
                'strapline' => $data['footer']['strapline'],
                'description' => $data['footer']['description'],
                'chips' => $this->splitLines($data['footer']['chips_text'] ?? ''),
                'prompt_text' => $data['footer']['prompt_text'],
                'credit_name' => $data['footer']['credit_name'],
                'credit_url' => $data['footer']['credit_url'],
            ],
        ]);

        return redirect()
            ->route('admin.settings.index')
            ->with('success', 'Site settings updated successfully.');
    }

    private function splitLines(string $value): array
    {
        return collect(preg_split('/\r\n|\r|\n/', $value) ?: [])
            ->map(fn ($line) => trim((string) $line))
            ->filter()
            ->values()
            ->all();
    }

    private function explodeEntries(string $value, array $keys): array
    {
        return collect($this->splitLines($value))
            ->map(function (string $line) use ($keys): ?array {
                $parts = array_map('trim', explode('|', $line));
                $parts = array_slice(array_pad($parts, count($keys), ''), 0, count($keys));
                $entry = array_combine($keys, $parts);

                if (! is_array($entry) || $entry[$keys[0]] === '') {
                    return null;
                }

                return $entry;
            })
            ->filter()
            ->values()
            ->all();
    }

    private function implodeEntries(array $items, array $keys): string
    {
        return collect($items)
            ->filter(fn ($item) => is_array($item))
            ->map(function (array $item) use ($keys): string {
                return implode(' | ', array_map(
                    fn (string $key) => trim((string) ($item[$key] ?? '')),
                    $keys,
                ));
            })
            ->filter()
            ->implode(PHP_EOL);
    }
}
