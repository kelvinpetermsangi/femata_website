<?php

namespace App\Policies;

use App\Models\AdminSection;

class NewsPostPolicy extends CmsPolicy
{
    protected const SECTION = AdminSection::NEWSWIRE;
    protected const MANAGE_PERMISSION = 'manage news';
    protected const REVIEW_PERMISSION = 'review news';
    protected const PUBLISH_PERMISSION = 'publish news';
}
