<?php

namespace App\Policies;

use App\Models\AdminSection;

class AssociationTypePolicy extends CmsPolicy
{
    protected const SECTION = AdminSection::ASSOCIATION_TYPES;
    protected const MANAGE_PERMISSION = 'manage association types';
}
