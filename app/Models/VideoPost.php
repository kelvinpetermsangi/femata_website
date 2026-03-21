<?php

namespace App\Models;

use App\Models\Concerns\HasContentWorkflow;
use App\Models\Concerns\HasTags;
use App\Models\Concerns\LogsCmsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Traits\LogsActivity;

class VideoPost extends Model
{
    use HasFactory, HasContentWorkflow, HasTags, LogsActivity, LogsCmsActivity, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'summary',
        'description',
        'youtube_url',
        'youtube_video_id',
        'thumbnail',
        'duration',
        'category_id',
        'is_featured',
        'views_count',
        'status_id',
        'created_by',
        'updated_by',
        'submitted_by',
        'reviewed_by',
        'approved_by',
        'published_by',
        'submitted_at',
        'reviewed_at',
        'approved_at',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'views_count' => 'integer',
            'submitted_at' => 'datetime',
            'reviewed_at' => 'datetime',
            'approved_at' => 'datetime',
            'published_at' => 'datetime',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(VideoCategory::class, 'category_id');
    }
}
