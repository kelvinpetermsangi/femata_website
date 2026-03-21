<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasRoles, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'is_admin' => 'boolean',
            'password' => 'hashed',
        ];
    }

    public function adminSections(): BelongsToMany
    {
        return $this->belongsToMany(AdminSection::class, 'user_admin_sections')->withTimestamps();
    }

    public function hasAdminAccess(): bool
    {
        return $this->is_admin || $this->hasRole('super-admin') || $this->roles()->exists();
    }

    public function managesSection(string $section): bool
    {
        if ($this->hasRole('super-admin')) {
            return true;
        }

        return $this->adminSections()->where('slug', $section)->exists();
    }
}
