<?php

namespace App\Http\Controllers\Admin;

use App\Models\Announcement;
use App\Models\Document;
use App\Models\Leader;
use App\Models\NewsPost;
use App\Models\VideoPost;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends AdminController
{
    public function index(Request $request): Response
    {
        abort_unless(
            $request->user() && $request->user()->can('access admin dashboard'),
            403,
            'You do not have permission to access the dashboard.',
        );

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                [
                    'label' => 'Announcements',
                    'value' => Announcement::query()->count(),
                    'detail' => Announcement::query()->active()->count().' active notices',
                    'href' => '/admin/announcements',
                ],
                [
                    'label' => 'News posts',
                    'value' => NewsPost::query()->count(),
                    'detail' => NewsPost::query()->published()->count().' published',
                    'href' => '/admin/news',
                ],
                [
                    'label' => 'Videos',
                    'value' => VideoPost::query()->count(),
                    'detail' => VideoPost::query()->published()->count().' published',
                    'href' => '/admin/videos',
                ],
                [
                    'label' => 'Leaders',
                    'value' => Leader::query()->count(),
                    'detail' => Leader::query()->active()->count().' active profiles',
                    'href' => '/admin/leaders',
                ],
                [
                    'label' => 'Documents',
                    'value' => Document::query()->count(),
                    'detail' => Document::query()->where('is_public', true)->count().' public resources',
                    'href' => '/admin/documents',
                ],
            ],
            'recentAnnouncements' => Announcement::query()
                ->priorityOrdered()
                ->limit(5)
                ->get(['id', 'title', 'priority_level', 'is_active', 'starts_at'])
                ->map(fn (Announcement $announcement) => [
                    'id' => $announcement->id,
                    'title' => $announcement->title,
                    'meta' => 'Priority '.($announcement->priority_level ?? 0),
                    'status' => $announcement->is_active ? 'Active' : 'Inactive',
                ])
                ->all(),
            'recentNews' => NewsPost::query()
                ->with('status')
                ->orderByDesc('published_at')
                ->orderByDesc('created_at')
                ->limit(5)
                ->get(['id', 'title', 'status_id', 'published_at'])
                ->map(fn (NewsPost $post) => [
                    'id' => $post->id,
                    'title' => $post->title,
                    'meta' => $post->published_at?->format('M d, Y') ?? 'Not scheduled',
                    'status' => ucfirst(str_replace('_', ' ', (string) $post->status?->slug)),
                ])
                ->all(),
            'recentDocuments' => Document::query()
                ->with('category')
                ->orderByDesc('published_at')
                ->orderByDesc('created_at')
                ->limit(5)
                ->get(['id', 'title', 'category_id', 'is_public'])
                ->map(fn (Document $document) => [
                    'id' => $document->id,
                    'title' => $document->title,
                    'meta' => $document->category?->name ?: 'Document',
                    'status' => $document->is_public ? 'Public' : 'Private',
                ])
                ->all(),
        ]);
    }
}
