<?php

namespace App\Policies;

use App\Models\AdminSection;

class GalleryItemPolicy extends CmsPolicy
{
    protected const SECTION = AdminSection::MEDIA;
    protected const MANAGE_PERMISSION = 'manage media';
}
