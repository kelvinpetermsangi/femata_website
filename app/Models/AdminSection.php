<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class AdminSection extends Model
{
    use HasFactory;

    public const NEWSWIRE = 'newswire';
    public const ONLINE_TV = 'online-tv';
    public const LIBRARY = 'library';
    public const ANNOUNCEMENTS = 'announcements';
    public const LEADERSHIP = 'leadership';
    public const MEDIA = 'media';
    public const PAGES = 'pages';
    public const SETTINGS = 'settings';
    public const ASSOCIATIONS = 'associations';
    public const ASSOCIATION_TYPES = 'association-types';
    public const ADVERTS = 'adverts';
    public const PRESS_BRIEFINGS = 'press-briefings';

    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_admin_sections')->withTimestamps();
    }
}
