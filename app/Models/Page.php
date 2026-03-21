<?php

namespace App\Models;

use App\Models\Concerns\HasContentWorkflow;
use App\Models\Concerns\LogsCmsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class Page extends Model
{
    use HasFactory, HasContentWorkflow, LogsActivity, LogsCmsActivity;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'featured_image',
        'seo_title',
        'seo_description',
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
}
