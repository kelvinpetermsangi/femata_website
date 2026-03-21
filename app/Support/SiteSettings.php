<?php

namespace App\Support;

use App\Models\SiteSetting;
use Illuminate\Support\Facades\Storage;

class SiteSettings
{
    public static function branding(): array
    {
        $branding = self::get('branding', [
            'site_name' => 'FEMATA',
            'organization_name' => 'Federation of Miners\' Associations of Tanzania',
            'top_bar_primary' => 'Official Website of FEMATA',
            'top_bar_secondary' => 'Federation of Miners\' Associations of Tanzania',
            'logo_path' => null,
            'logo_alt' => 'FEMATA logo',
            'settings_label' => 'Settings',
            'navigation_cta_label' => 'Contact FEMATA',
            'navigation_cta_href' => '/contact',
        ]);

        $branding['logo_path'] = self::assetUrl($branding['logo_path'] ?? null);

        return $branding;
    }

    public static function home(): array
    {
        $home = self::get('home', [
            'hero_image' => 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1600&q=80',
            'hero_panel_label' => 'Institutional profile',
            'why_eyebrow' => 'Why FEMATA',
            'why_title' => 'A national platform for representation, visibility, and sector coordination.',
            'why_text' => 'FEMATA positions itself as a public-facing institution with a clear mandate, visible activities, and accessible information for members, partners, regulators, and communities.',
            'mandate_label' => 'Institutional mandate',
            'mandate_title' => 'Built for representation, productive growth, and public trust.',
            'mandate_text' => 'The FEMATA website should do more than publish notices. It should explain who FEMATA is, what it stands for, where it works, and how it advances the interests of mining associations across Tanzania.',
            'highlights' => [],
            'pillars' => [],
            'footprint_eyebrow' => 'National footprint',
            'footprint_title' => 'Regional presence across Tanzania\'s mining landscapes.',
            'footprint_text' => 'A stronger FEMATA website should communicate national reach and operational presence, not just office information.',
            'zones' => [],
            'news_eyebrow' => 'Official updates',
            'news_title' => 'News, notices, and sector communication presented with clarity.',
            'news_text' => 'The public newsroom should feel authoritative and current, balancing formal notices with broader institutional communication.',
            'leadership_eyebrow' => 'Leadership',
            'leadership_title' => 'Leadership presented as credible, accessible, and institutionally grounded.',
            'leadership_text' => 'The leadership section should foreground people, responsibility, and professional credibility with a more editorial presentation.',
            'media_eyebrow' => 'Field moments',
            'media_title' => 'Media that reflects actual work on the ground.',
            'media_text' => 'Strong imagery helps the website feel like an active sector institution, not a static noticeboard.',
            'documents_eyebrow' => 'Public resources',
            'documents_title' => 'Documents arranged like a proper institutional resource centre.',
            'documents_text' => 'Resources should feel easy to scan, easy to trust, and clearly separated by category and purpose.',
            'partnerships_eyebrow' => 'Institutional partnerships',
            'partnerships_title' => 'FEMATA works through coordination, public engagement, and national stakeholder relationships.',
            'partnerships_text' => 'The website should communicate a federation that collaborates with public institutions, sector bodies, and regional associations while remaining accessible to the wider public.',
            'partners' => [],
            'secondary_cta_label' => 'Learn more',
        ]);

        $home['hero_image'] = self::assetUrl($home['hero_image'] ?? null);

        return $home;
    }

    public static function about(): array
    {
        return self::get('about', [
            'title' => 'Federation of Miners\' Associations of Tanzania (FEMATA)',
            'body' => 'FEMATA is the national umbrella body that brings together mining associations across Tanzania to strengthen representation, coordination, responsible practice, policy dialogue, institutional visibility, and sector development.',
            'mission' => 'To unite, represent, and strengthen mining associations across Tanzania.',
            'vision' => 'A respected, coordinated, and sustainable mining sector that benefits communities and the nation.',
            'values' => 'Integrity, representation, professionalism, and partnership.',
        ]);
    }

    public static function contact(): array
    {
        return self::get('contact', [
            'phone' => '+255 22 222 3344',
            'email' => 'info@femata.or.tz',
            'address' => 'Undal Street, Upanga, Dar es Salaam, Tanzania',
            'postal_address' => 'P.O. Box 4958, Dar es Salaam',
            'description' => 'For partnerships, media engagement, membership matters, or institutional collaboration, contact the FEMATA secretariat.',
        ]);
    }

    public static function footer(): array
    {
        return self::get('footer', [
            'strapline' => 'A united voice for Tanzania\'s mining associations',
            'description' => 'FEMATA strengthens coordination, visibility, advocacy, and responsible growth across Tanzania\'s mining ecosystem by bringing regional and sector mining associations under one national platform.',
            'chips' => [],
            'prompt_text' => 'Use the website to publish updates, highlight leadership, share resources, and strengthen FEMATA\'s institutional visibility.',
            'credit_name' => 'FEMATA Secretariat',
            'credit_url' => null,
        ]);
    }

    public static function get(string $key, array $default = []): array
    {
        $value = SiteSetting::query()
            ->where('setting_key', $key)
            ->value('setting_value');

        if (! is_string($value) || $value === '') {
            return $default;
        }

        $decoded = json_decode($value, true);

        if (! is_array($decoded)) {
            return $default;
        }

        return array_replace_recursive($default, $decoded);
    }

    private static function assetUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        if (
            str_starts_with($path, 'http://')
            || str_starts_with($path, 'https://')
            || str_starts_with($path, '/')
            || str_starts_with($path, 'data:')
        ) {
            return $path;
        }

        return Storage::url($path);
    }
}
