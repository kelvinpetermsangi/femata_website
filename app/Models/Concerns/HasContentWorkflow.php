<?php

namespace App\Models\Concerns;

use App\Models\ContentStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait HasContentWorkflow
{
    public function status(): BelongsTo
    {
        return $this->belongsTo(ContentStatus::class, 'status_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function submitter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function publisher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'published_by');
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query
            ->whereHas('status', fn (Builder $statusQuery) => $statusQuery->where('slug', ContentStatus::PUBLISHED))
            ->where(function (Builder $builder): void {
                $builder->whereNull($this->qualifyColumn('published_at'))
                    ->orWhere($this->qualifyColumn('published_at'), '<=', now());
            });
    }

    public function scopePendingReview(Builder $query): Builder
    {
        return $query->whereHas('status', fn (Builder $statusQuery) => $statusQuery->where('slug', ContentStatus::PENDING_REVIEW));
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where($this->qualifyColumn('is_featured'), true);
    }
}
