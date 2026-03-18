<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentFile extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'file_path',
        'file_type',
        'category',
        'is_public',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'is_public' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function scopePublicVisible(Builder $query): Builder
    {
        return $query
            ->where('is_public', true)
            ->where(function (Builder $subQuery): void {
                $subQuery->whereNull('published_at')->orWhere('published_at', '<=', now());
            })
            ->orderByDesc('published_at')
            ->orderByDesc('created_at');
    }
}
