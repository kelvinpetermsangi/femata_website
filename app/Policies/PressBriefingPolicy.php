<?php

namespace App\Policies;

use App\Models\AdminSection;

class PressBriefingPolicy extends CmsPolicy
{
    protected const SECTION = AdminSection::PRESS_BRIEFINGS;
    protected const MANAGE_PERMISSION = 'manage press briefings';
    protected const PUBLISH_PERMISSION = 'publish press briefings';
}
