<?php

namespace App\Policies;

use App\Models\AdminSection;

class VideoPostPolicy extends CmsPolicy
{
    protected const SECTION = AdminSection::ONLINE_TV;
    protected const MANAGE_PERMISSION = 'manage videos';
    protected const REVIEW_PERMISSION = 'review videos';
    protected const PUBLISH_PERMISSION = 'publish videos';
}
