<?php

namespace App\Models;

use App\Models\Concerns\HasContentWorkflow;
use App\Models\Concerns\HasTags;
use App\Models\Concerns\LogsCmsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Traits\LogsActivity;

class Document extends Model
{
    use HasFactory, HasContentWorkflow, HasTags, LogsActivity, LogsCmsActivity, SoftDeletes;

    protected $fillable = [
        'public_id',
        'title',
        'slug',
        'description',
        'file_path',
        'thumbnail_path',
        'file_extension',
        'file_size',
        'document_type',
        'category_id',
        'year',
        'author_source',
        'source_organization',
        'download_count',
        'is_featured',
        'is_public',
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
            'file_size' => 'integer',
            'year' => 'integer',
            'download_count' => 'integer',
            'is_featured' => 'boolean',
            'is_public' => 'boolean',
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
        return $this->belongsTo(DocumentCategory::class, 'category_id');
    }

    public function downloadLogs(): HasMany
    {
        return $this->hasMany(DocumentDownloadLog::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(DocumentComment::class);
    }

    public function associations(): BelongsToMany
    {
        return $this->belongsToMany(Association::class, 'association_documents')->withTimestamps();
    }
}
