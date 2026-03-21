<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphedByMany;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
    ];

    public function newsPosts(): MorphedByMany
    {
        return $this->morphedByMany(NewsPost::class, 'taggable');
    }

    public function documents(): MorphedByMany
    {
        return $this->morphedByMany(Document::class, 'taggable');
    }

    public function videoPosts(): MorphedByMany
    {
        return $this->morphedByMany(VideoPost::class, 'taggable');
    }

    public function pressBriefings(): MorphedByMany
    {
        return $this->morphedByMany(PressBriefing::class, 'taggable');
    }
}
