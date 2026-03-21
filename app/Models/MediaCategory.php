<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MediaCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(MediaLibrary::class, 'category_id');
    }

    public function galleryItems(): HasMany
    {
        return $this->hasMany(GalleryItem::class, 'category_id');
    }
}
