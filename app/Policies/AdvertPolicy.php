<?php

namespace App\Policies;

use App\Models\AdminSection;

class AdvertPolicy extends CmsPolicy
{
    protected const SECTION = AdminSection::ADVERTS;
    protected const MANAGE_PERMISSION = 'manage adverts';
}
