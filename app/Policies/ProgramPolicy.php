<?php

namespace App\Policies;

use App\Models\AdminSection;

class ProgramPolicy extends CmsPolicy
{
    protected const SECTION = AdminSection::PROGRAMS;
    protected const MANAGE_PERMISSION = 'manage programs';
}
