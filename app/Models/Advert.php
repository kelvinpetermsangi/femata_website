<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Advert extends Model
{
    use HasFactory;

    public const PAGE_HOME = 'home';
    public const PAGE_ASSOCIATIONS = 'associations';
    public const PAGE_NEWS = 'news';
    public const PAGE_DOCUMENTS = 'documents';
    public const PAGE_GALLERY = 'gallery';
    public const PAGE_CONTACT = 'contact';
    public const PAGE_ASSOCIATION_HOME = 'association_home';
    public const PAGE_ASSOCIATION_ABOUT = 'association_about';
    public const PAGE_ASSOCIATION_LEADERSHIP = 'association_leadership';
    public const PAGE_ASSOCIATION_DOCUMENTS = 'association_documents';
    public const PAGE_ASSOCIATION_GALLERY = 'association_gallery';
    public const PAGE_ASSOCIATION_CONTACT = 'association_contact';

    public const SCOPE_NATIONAL = 'national';
    public const SCOPE_REGION = 'region';
    public const SCOPE_ASSOCIATION_TYPE = 'association_type';
    public const SCOPE_ASSOCIATION = 'association';

    protected $fillable = [
        'title',
        'slug',
        'media_type',
        'asset_url',
        'poster_url',
        'headline',
        'body',
        'cta_label',
        'cta_url',
        'page_key',
        'slot_number',
        'placement_scope',
        'association_id',
        'association_type_id',
        'region',
        'display_order',
        'duration_seconds',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'association_id' => 'integer',
            'association_type_id' => 'integer',
            'slot_number' => 'integer',
            'display_order' => 'integer',
            'duration_seconds' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public static function pageOptions(): array
    {
        return [
            self::PAGE_HOME => 'Homepage',
            self::PAGE_ASSOCIATIONS => 'Associations directory',
            self::PAGE_NEWS => 'News archive',
            self::PAGE_DOCUMENTS => 'Documents page',
            self::PAGE_GALLERY => 'Gallery page',
            self::PAGE_CONTACT => 'Contact page',
            self::PAGE_ASSOCIATION_HOME => 'Association home',
            self::PAGE_ASSOCIATION_ABOUT => 'Association about',
            self::PAGE_ASSOCIATION_LEADERSHIP => 'Association leadership',
            self::PAGE_ASSOCIATION_DOCUMENTS => 'Association documents',
            self::PAGE_ASSOCIATION_GALLERY => 'Association gallery',
            self::PAGE_ASSOCIATION_CONTACT => 'Association contact',
        ];
    }

    public static function placementScopes(): array
    {
        return [
            self::SCOPE_NATIONAL => 'National',
            self::SCOPE_REGION => 'Region',
            self::SCOPE_ASSOCIATION_TYPE => 'Association type',
            self::SCOPE_ASSOCIATION => 'Specific association',
        ];
    }

    public function association(): BelongsTo
    {
        return $this->belongsTo(Association::class);
    }

    public function associationType(): BelongsTo
    {
        return $this->belongsTo(AssociationType::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)
            ->orderBy('slot_number')
            ->orderBy('display_order')
            ->orderBy('title');
    }
}
