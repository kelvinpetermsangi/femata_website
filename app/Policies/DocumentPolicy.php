<?php

namespace App\Policies;

use App\Models\AdminSection;

class DocumentPolicy extends CmsPolicy
{
    protected const SECTION = AdminSection::LIBRARY;
    protected const MANAGE_PERMISSION = 'manage documents';
    protected const REVIEW_PERMISSION = 'review documents';
    protected const PUBLISH_PERMISSION = 'publish documents';
}
