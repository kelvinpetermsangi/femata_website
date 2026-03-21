<?php

namespace App\Models;

use App\Models\Concerns\LogsCmsActivity;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Leader extends Model
{
    use HasFactory, LogsActivity, LogsCmsActivity;

    protected $fillable = [
        'name',
        'designation',
        'administration_level',
        'department',
        'rank_order',
        'bio',
        'image_path',
        'contact_qr_path',
        'email',
        'phone',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'rank_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query
            ->where('is_active', true)
            ->orderBy('rank_order')
            ->orderBy('name');
    }
}
