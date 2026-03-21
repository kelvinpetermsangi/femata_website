<?php

namespace App\Policies;

use App\Models\AdminSection;

class LeaderPolicy extends CmsPolicy
{
    protected const SECTION = AdminSection::LEADERSHIP;
    protected const MANAGE_PERMISSION = 'manage leaders';
}
