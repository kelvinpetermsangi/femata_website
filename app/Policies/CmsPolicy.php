<?php

namespace App\Policies;

use App\Models\ContentStatus;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

abstract class CmsPolicy
{
    use HandlesAuthorization;

    protected const SECTION = '';
    protected const MANAGE_PERMISSION = '';
    protected const REVIEW_PERMISSION = null;
    protected const PUBLISH_PERMISSION = null;

    public function viewAny(User $user): bool
    {
        return $this->inSection($user) && $this->hasAnyModulePermission($user);
    }

    public function view(User $user, mixed $model): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->canManage($user);
    }

    public function update(User $user, mixed $model): bool
    {
        return $this->canManage($user);
    }

    public function delete(User $user, mixed $model): bool
    {
        return $this->canManage($user);
    }

    public function transitionToStatus(User $user, mixed $model, string $targetStatus): bool
    {
        if (! $this->inSection($user)) {
            return false;
        }

        return match ($targetStatus) {
            ContentStatus::DRAFT,
            ContentStatus::PENDING_REVIEW => $this->canManage($user),
            ContentStatus::REVIEWED,
            ContentStatus::REJECTED => $this->canReview($user),
            ContentStatus::APPROVED,
            ContentStatus::PUBLISHED => $this->canPublish($user),
            ContentStatus::ARCHIVED => $this->canManage($user) || $this->canPublish($user),
            default => false,
        };
    }

    protected function inSection(User $user): bool
    {
        return $user->managesSection(static::SECTION);
    }

    protected function canManage(User $user): bool
    {
        return $this->hasPermission($user, static::MANAGE_PERMISSION);
    }

    protected function canReview(User $user): bool
    {
        return $this->hasPermission($user, static::REVIEW_PERMISSION)
            || $this->canPublish($user);
    }

    protected function canPublish(User $user): bool
    {
        $permission = static::PUBLISH_PERMISSION ?? static::REVIEW_PERMISSION;

        return $this->hasPermission($user, $permission);
    }

    protected function hasAnyModulePermission(User $user): bool
    {
        return collect([
            static::MANAGE_PERMISSION,
            static::REVIEW_PERMISSION,
            static::PUBLISH_PERMISSION,
        ])->filter()->contains(fn (string $permission) => $this->hasPermission($user, $permission));
    }

    protected function hasPermission(User $user, ?string $permission): bool
    {
        return $permission !== null && $user->can($permission);
    }
}
