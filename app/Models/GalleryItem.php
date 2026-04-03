<?php

namespace App\Models;

use App\Models\Concerns\LogsCmsActivity;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\Traits\LogsActivity;

class GalleryItem extends Model
{
    use HasFactory, LogsActivity, LogsCmsActivity;

    protected $fillable = [
        'title',
        'caption',
        'event_name',
        'event_date',
        'media_id',
        'category_id',
        'display_order',
        'is_featured',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'display_order' => 'integer',
            'is_featured' => 'boolean',
            'event_date' => 'date',
        ];
    }

    public function media(): BelongsTo
    {
        return $this->belongsTo(MediaLibrary::class, 'media_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(MediaCategory::class, 'category_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopeFeaturedFirst(Builder $query): Builder
    {
        return $query->orderByDesc('is_featured')->orderBy('display_order')->orderByDesc('created_at');
    }
}
