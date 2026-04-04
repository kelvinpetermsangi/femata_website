<?php

namespace App\Policies;

use App\Models\AdminSection;

class MeetingRequestPolicy extends CmsPolicy
{
    protected const SECTION = AdminSection::MEETINGS;
    protected const MANAGE_PERMISSION = 'manage meetings';
}
