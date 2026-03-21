<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Support\ContentWorkflowManager;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

abstract class AdminController extends Controller
{
    protected function applyWorkflow(Request $request, Model $record, int|string|null $status, mixed $publishedAt = null): array
    {
        return app(ContentWorkflowManager::class)->apply(
            $request->user(),
            $record,
            $status,
            $publishedAt,
        );
    }
}
