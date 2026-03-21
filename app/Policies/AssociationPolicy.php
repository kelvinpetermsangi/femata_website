<?php

namespace App\Policies;

use App\Models\AdminSection;

class AssociationPolicy extends CmsPolicy
{
    protected const SECTION = AdminSection::ASSOCIATIONS;
    protected const MANAGE_PERMISSION = 'manage associations';
}
