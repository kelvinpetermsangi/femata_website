<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GalleryItem extends Model
{
    use HasFactory;

    public const TYPE_IMAGE = 'image';

    public const TYPE_YOUTUBE = 'youtube';

    protected $fillable = [
        'title',
        'slug',
        'type',
        'image_path',
        'youtube_url',
        'description',
        'is_featured',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query
            ->where(function (Builder $subQuery): void {
                $subQuery->whereNull('published_at')->orWhere('published_at', '<=', now());
            })
            ->orderByDesc('is_featured')
            ->orderByDesc('published_at')
            ->orderByDesc('created_at');
    }
}
