<?php

namespace App\Models\Concerns;

use Spatie\Activitylog\LogOptions;

trait LogsCmsActivity
{
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }
}
