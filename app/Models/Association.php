<?php

namespace App\Models;

use App\Models\Concerns\LogsCmsActivity;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Activitylog\Traits\LogsActivity;

class Association extends Model
{
    use HasFactory, LogsActivity, LogsCmsActivity;

    protected $fillable = [
        'name',
        'slug',
        'region',
        'district',
        'address',
        'phone',
        'email',
        'website',
        'logo_path',
        'description',
        'chairperson_name',
        'secretary_name',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function documents(): BelongsToMany
    {
        return $this->belongsToMany(Document::class, 'association_documents')->withTimestamps();
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
