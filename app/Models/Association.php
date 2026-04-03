<?php

namespace App\Models;

use App\Models\Concerns\LogsCmsActivity;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\Traits\LogsActivity;

class Association extends Model
{
    use HasFactory, LogsActivity, LogsCmsActivity;

    protected $fillable = [
        'name',
        'association_type_id',
        'slug',
        'region',
        'regions',
        'district',
        'address',
        'postal_address',
        'phone',
        'email',
        'website',
        'rema_website_url',
        'logo_path',
        'hero_image',
        'description',
        'homepage_title',
        'homepage_intro',
        'mission',
        'vision',
        'gender_commitment',
        'esg_commitment',
        'about_title',
        'about_body',
        'focus_areas',
        'highlights',
        'leaders',
        'gallery',
        'profile_pages',
        'social_links',
        'chairperson_name',
        'secretary_name',
        'contact_title',
        'contact_body',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'regions' => 'array',
            'highlights' => 'array',
            'leaders' => 'array',
            'gallery' => 'array',
            'profile_pages' => 'array',
            'social_links' => 'array',
        ];
    }

    public static function supportedPageKeys(): array
    {
        return ['home', 'about', 'leadership', 'documents', 'gallery', 'contact'];
    }

    public static function supportedSocialPlatforms(): array
    {
        return ['website', 'instagram', 'facebook', 'x', 'linkedin', 'youtube', 'whatsapp'];
    }

    public static function socialPlatformLabel(string $platform): string
    {
        return match ($platform) {
            'website' => 'Website',
            'instagram' => 'Instagram',
            'facebook' => 'Facebook',
            'x' => 'X',
            'linkedin' => 'LinkedIn',
            'youtube' => 'YouTube',
            'whatsapp' => 'WhatsApp',
            default => ucfirst(str_replace(['-', '_'], ' ', $platform)),
        };
    }

    public static function defaultProfilePages(?string $associationName = null): array
    {
        $name = trim((string) $associationName);
        $entity = $name !== '' ? $name : 'this association';

        return [
            [
                'key' => 'home',
                'label' => 'Home',
                'slug' => 'home',
                'visible' => true,
                'headline' => $name !== '' ? $name : 'Association home',
                'intro' => "Explore {$entity}'s public profile, leadership, documents, gallery, and contact channels.",
            ],
            [
                'key' => 'about',
                'label' => 'About',
                'slug' => 'about',
                'visible' => true,
                'headline' => $name !== '' ? "About {$name}" : 'About this association',
                'intro' => 'Read the association story, mandate, focus areas, and operational coverage.',
            ],
            [
                'key' => 'leadership',
                'label' => 'Leadership',
                'slug' => 'leadership',
                'visible' => true,
                'headline' => $name !== '' ? "{$name} leadership" : 'Association leadership',
                'intro' => 'Meet the office bearers and leadership team representing this association.',
            ],
            [
                'key' => 'documents',
                'label' => 'Documents',
                'slug' => 'documents',
                'visible' => true,
                'headline' => $name !== '' ? "{$name} documents" : 'Association documents',
                'intro' => 'Browse linked public documents, reference material, and downloadable resources.',
            ],
            [
                'key' => 'gallery',
                'label' => 'Gallery',
                'slug' => 'gallery',
                'visible' => true,
                'headline' => $name !== '' ? "{$name} gallery" : 'Association gallery',
                'intro' => 'See images that showcase field work, meetings, events, and regional activity.',
            ],
            [
                'key' => 'contact',
                'label' => 'Contact',
                'slug' => 'contact',
                'visible' => true,
                'headline' => $name !== '' ? "Contact {$name}" : 'Association contact',
                'intro' => 'Use the official addresses, phone, email, social links, and website channels for this profile.',
            ],
        ];
    }

    public static function normalizeProfilePages(?array $items, ?string $associationName = null): array
    {
        $defaults = collect(static::defaultProfilePages($associationName))->keyBy('key');
        $provided = collect($items ?? [])
            ->filter(fn ($item) => in_array((string) data_get($item, 'key'), static::supportedPageKeys(), true))
            ->keyBy(fn ($item) => (string) data_get($item, 'key'));

        $pages = $defaults
            ->map(function (array $page, string $key) use ($provided): array {
                $configured = $provided->get($key, []);
                $label = trim((string) data_get($configured, 'label', $page['label']));
                $slug = trim((string) data_get($configured, 'slug', $page['slug']));

                return [
                    'key' => $key,
                    'label' => $label !== '' ? $label : $page['label'],
                    'slug' => $slug !== '' ? str($slug)->slug()->value() : $page['slug'],
                    'visible' => (bool) data_get($configured, 'visible', $page['visible']),
                    'headline' => trim((string) data_get($configured, 'headline', $page['headline'])) ?: $page['headline'],
                    'intro' => trim((string) data_get($configured, 'intro', $page['intro'])) ?: $page['intro'],
                ];
            })
            ->values();

        $usedSlugs = [];

        return $pages
            ->map(function (array $page) use (&$usedSlugs): array {
                $slug = $page['slug'];
                $suffix = 2;

                while (in_array($slug, $usedSlugs, true)) {
                    $slug = $page['slug'].'-'.$suffix;
                    $suffix++;
                }

                $usedSlugs[] = $slug;
                $page['slug'] = $slug;

                return $page;
            })
            ->values()
            ->all();
    }

    public static function normalizeSocialLinks(
        ?array $items,
        ?string $website = null,
        ?string $legacyWebsite = null,
    ): array {
        $provided = collect($items ?? [])
            ->filter(fn ($item) => in_array((string) data_get($item, 'platform'), static::supportedSocialPlatforms(), true))
            ->keyBy(fn ($item) => (string) data_get($item, 'platform'));

        return collect(static::supportedSocialPlatforms())
            ->map(function (string $platform) use ($provided, $website, $legacyWebsite): array {
                $configured = $provided->get($platform, []);
                $fallbackUrl = $platform === 'website'
                    ? trim((string) ($website ?: $legacyWebsite))
                    : '';
                $url = trim((string) data_get($configured, 'url', $fallbackUrl));

                return [
                    'platform' => $platform,
                    'label' => static::socialPlatformLabel($platform),
                    'url' => $url,
                    'visible' => (bool) data_get(
                        $configured,
                        'visible',
                        $platform === 'website' && $url !== '',
                    ),
                ];
            })
            ->values()
            ->all();
    }

    public function documents(): BelongsToMany
    {
        return $this->belongsToMany(Document::class, 'association_documents')->withTimestamps();
    }

    public function associationType(): BelongsTo
    {
        return $this->belongsTo(AssociationType::class);
    }

    public function adverts(): HasMany
    {
        return $this->hasMany(Advert::class);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)->orderBy('name');
    }
}
