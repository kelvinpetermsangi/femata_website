<?php

namespace App\Models;

use App\Models\Concerns\LogsCmsActivity;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Program extends Model
{
    use HasFactory, LogsActivity, LogsCmsActivity;

    protected $fillable = [
        'name',
        'slug',
        'tagline',
        'summary',
        'hero_image',
        'home_title',
        'home_intro',
        'home_body',
        'about_title',
        'about_body',
        'team_intro',
        'years_intro',
        'current_year_intro',
        'highlights',
        'metrics',
        'team',
        'years',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'highlights' => 'array',
            'metrics' => 'array',
            'team' => 'array',
            'years' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)->orderBy('name');
    }

    public static function profilePages(): array
    {
        return [
            [
                'key' => 'home',
                'label' => 'Home',
                'slug' => 'home',
            ],
            [
                'key' => 'about',
                'label' => 'About',
                'slug' => 'about',
            ],
            [
                'key' => 'team',
                'label' => 'Team',
                'slug' => 'team',
            ],
            [
                'key' => 'years',
                'label' => 'Years',
                'slug' => 'years',
            ],
            [
                'key' => 'current-year',
                'label' => 'Current Year',
                'slug' => 'current-year',
            ],
        ];
    }
}
