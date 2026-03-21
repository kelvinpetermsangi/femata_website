<?php

namespace App\Policies;

use App\Models\AdminSection;
use App\Models\User;

class SiteSettingPolicy extends CmsPolicy
{
    protected const SECTION = AdminSection::SETTINGS;
    protected const MANAGE_PERMISSION = 'manage settings';

    public function manage(User $user, mixed $model = null): bool
    {
        return $this->canManage($user);
    }
}
