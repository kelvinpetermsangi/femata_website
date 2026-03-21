<?php

namespace App\Policies;

use App\Models\AdminSection;

class AnnouncementPolicy extends CmsPolicy
{
    protected const SECTION = AdminSection::ANNOUNCEMENTS;
    protected const MANAGE_PERMISSION = 'manage announcements';
}
