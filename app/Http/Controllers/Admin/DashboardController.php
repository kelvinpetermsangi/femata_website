<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\DocumentFile;
use App\Models\GalleryItem;
use App\Models\Leader;
use App\Models\NewsPost;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
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
                    'label' => 'Leaders',
                    'value' => Leader::query()->count(),
                    'detail' => Leader::query()->active()->count().' active profiles',
                    'href' => '/admin/leaders',
                ],
                [
                    'label' => 'Gallery items',
                    'value' => GalleryItem::query()->count(),
                    'detail' => GalleryItem::query()->where('is_featured', true)->count().' featured',
                    'href' => '/admin/gallery',
                ],
                [
                    'label' => 'Documents',
                    'value' => DocumentFile::query()->count(),
                    'detail' => DocumentFile::query()->where('is_public', true)->count().' public resources',
                    'href' => '/admin/documents',
                ],
            ],
            'recentAnnouncements' => Announcement::query()
                ->priorityOrdered()
                ->limit(5)
                ->get(['id', 'title', 'priority', 'is_active', 'starts_at'])
                ->map(fn (Announcement $announcement) => [
                    'id' => $announcement->id,
                    'title' => $announcement->title,
                    'meta' => 'Priority '.$announcement->priority,
                    'status' => $announcement->is_active ? 'Active' : 'Inactive',
                ])
                ->all(),
            'recentNews' => NewsPost::query()
                ->orderByDesc('published_at')
                ->orderByDesc('created_at')
                ->limit(5)
                ->get(['id', 'title', 'is_published', 'published_at'])
                ->map(fn (NewsPost $post) => [
                    'id' => $post->id,
                    'title' => $post->title,
                    'meta' => $post->published_at?->format('M d, Y') ?? 'Not scheduled',
                    'status' => $post->is_published ? 'Published' : 'Draft',
                ])
                ->all(),
            'recentDocuments' => DocumentFile::query()
                ->orderByDesc('published_at')
                ->orderByDesc('created_at')
                ->limit(5)
                ->get(['id', 'title', 'category', 'is_public'])
                ->map(fn (DocumentFile $document) => [
                    'id' => $document->id,
                    'title' => $document->title,
                    'meta' => $document->category ?: 'Document',
                    'status' => $document->is_public ? 'Public' : 'Private',
                ])
                ->all(),
        ]);
    }
}
