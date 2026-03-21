<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContentStatus extends Model
{
    use HasFactory;

    public const DRAFT = 'draft';
    public const PENDING_REVIEW = 'pending_review';
    public const REVIEWED = 'reviewed';
    public const APPROVED = 'approved';
    public const PUBLISHED = 'published';
    public const ARCHIVED = 'archived';
    public const REJECTED = 'rejected';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'sort_order',
        'is_public',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_public' => 'boolean',
        ];
    }
}
