<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\UpdateAdminPasswordRequest;
use App\Http\Requests\Admin\UpdateSiteSettingsRequest;
use App\Models\SiteSetting;
use App\Support\SiteSettings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SiteSettingsController extends AdminController
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', SiteSetting::class);

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

    public function update(UpdateSiteSettingsRequest $request): RedirectResponse
    {
        $this->authorize('manage', SiteSetting::class);

        $data = $request->validated();
        $userId = $request->user()?->id;

        $this->storeSetting('branding', $data['branding'], 'branding', $userId);
        $this->storeSetting('home', [
            'hero_image' => $data['home']['hero_image'] ?? null,
            'hero_panel_label' => $data['home']['hero_panel_label'] ?? '',
            'why_eyebrow' => $data['home']['why_eyebrow'] ?? '',
            'why_title' => $data['home']['why_title'] ?? '',
            'why_text' => $data['home']['why_text'] ?? '',
            'mandate_label' => $data['home']['mandate_label'] ?? '',
            'mandate_title' => $data['home']['mandate_title'] ?? '',
            'mandate_text' => $data['home']['mandate_text'] ?? '',
            'highlights' => $this->explodeEntries($data['home']['highlights_text'] ?? '', ['label', 'text']),
            'pillars' => $this->explodeEntries($data['home']['pillars_text'] ?? '', ['title', 'text']),
            'footprint_eyebrow' => $data['home']['footprint_eyebrow'] ?? '',
            'footprint_title' => $data['home']['footprint_title'] ?? '',
            'footprint_text' => $data['home']['footprint_text'] ?? '',
            'zones' => $this->explodeEntries($data['home']['zones_text'] ?? '', ['name', 'focus', 'base']),
            'news_eyebrow' => $data['home']['news_eyebrow'] ?? '',
            'news_title' => $data['home']['news_title'] ?? '',
            'news_text' => $data['home']['news_text'] ?? '',
            'leadership_eyebrow' => $data['home']['leadership_eyebrow'] ?? '',
            'leadership_title' => $data['home']['leadership_title'] ?? '',
            'leadership_text' => $data['home']['leadership_text'] ?? '',
            'media_eyebrow' => $data['home']['media_eyebrow'] ?? '',
            'media_title' => $data['home']['media_title'] ?? '',
            'media_text' => $data['home']['media_text'] ?? '',
            'documents_eyebrow' => $data['home']['documents_eyebrow'] ?? '',
            'documents_title' => $data['home']['documents_title'] ?? '',
            'documents_text' => $data['home']['documents_text'] ?? '',
            'partnerships_eyebrow' => $data['home']['partnerships_eyebrow'] ?? '',
            'partnerships_title' => $data['home']['partnerships_title'] ?? '',
            'partnerships_text' => $data['home']['partnerships_text'] ?? '',
            'partners' => $this->splitLines($data['home']['partners_text'] ?? ''),
            'secondary_cta_label' => $data['home']['secondary_cta_label'] ?? '',
        ], 'home', $userId);
        $this->storeSetting('about', $data['about'], 'content', $userId);
        $this->storeSetting('contact', $data['contact'], 'contact', $userId);
        $this->storeSetting('footer', [
            'strapline' => $data['footer']['strapline'] ?? '',
            'description' => $data['footer']['description'] ?? '',
            'chips' => $this->splitLines($data['footer']['chips_text'] ?? ''),
            'prompt_text' => $data['footer']['prompt_text'] ?? '',
            'credit_name' => $data['footer']['credit_name'] ?? null,
            'credit_url' => $data['footer']['credit_url'] ?? null,
        ], 'footer', $userId);

        return redirect()
            ->route('admin.settings.index')
            ->with('success', 'Site settings updated successfully.');
    }

    public function updatePassword(UpdateAdminPasswordRequest $request): RedirectResponse
    {
        $this->authorize('manage', SiteSetting::class);

        $request->user()?->update([
            'password' => $request->validated()['password'],
        ]);

        return redirect()
            ->route('admin.settings.index')
            ->with('success', 'Admin password changed successfully.');
    }

    private function storeSetting(string $key, array $value, string $groupName, ?int $userId): void
    {
        SiteSetting::query()->updateOrCreate(
            ['setting_key' => $key],
            [
                'setting_value' => json_encode($value, JSON_THROW_ON_ERROR),
                'group_name' => $groupName,
                'updated_by' => $userId,
            ],
        );
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
