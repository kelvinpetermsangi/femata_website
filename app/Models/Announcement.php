<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'body',
        'is_active',
        'starts_at',
        'ends_at',
        'priority',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'priority' => 'integer',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query
            ->where('is_active', true)
            ->where(function (Builder $subQuery): void {
                $subQuery->whereNull('starts_at')->orWhere('starts_at', '<=', now());
            })
            ->where(function (Builder $subQuery): void {
                $subQuery->whereNull('ends_at')->orWhere('ends_at', '>=', now());
            });
    }

    public function scopePriorityOrdered(Builder $query): Builder
    {
        return $query
            ->orderByDesc('priority')
            ->orderByDesc('starts_at')
            ->orderByDesc('created_at');
    }
}
