<?php

namespace App\Policies;

use App\Models\AdminSection;

class PagePolicy extends CmsPolicy
{
    protected const SECTION = AdminSection::PAGES;
    protected const MANAGE_PERMISSION = 'manage pages';
    protected const PUBLISH_PERMISSION = 'publish pages';
}
