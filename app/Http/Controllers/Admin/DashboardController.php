<?php

namespace App\Http\Controllers\Admin;

use App\Models\Announcement;
use App\Models\Association;
use App\Models\Document;
use App\Models\Leader;
use App\Models\MeetingRequest;
use App\Models\NewsPost;
use App\Models\VideoPost;
use App\Models\AdminSection;
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

        $user = $request->user();
        $stats = [];
        $visibleSections = collect($user?->adminSections()->pluck('slug')->all() ?? []);
        $showSection = fn (string $section): bool => $user?->hasRole('super-admin') || $visibleSections->contains($section);

        if ($showSection(AdminSection::ANNOUNCEMENTS)) {
            $stats[] = [
                'label' => 'Announcements',
                'value' => Announcement::query()->count(),
                'detail' => Announcement::query()->active()->count().' active notices',
                'href' => '/admin/announcements',
            ];
        }

        if ($showSection(AdminSection::NEWSWIRE)) {
            $stats[] = [
                'label' => 'News posts',
                'value' => NewsPost::query()->count(),
                'detail' => NewsPost::query()->published()->count().' published',
                'href' => '/admin/news',
            ];
        }

        if ($showSection(AdminSection::ONLINE_TV)) {
            $stats[] = [
                'label' => 'Videos',
                'value' => VideoPost::query()->count(),
                'detail' => VideoPost::query()->published()->count().' published',
                'href' => '/admin/videos',
            ];
        }

        if ($showSection(AdminSection::LEADERSHIP)) {
            $stats[] = [
                'label' => 'Leaders',
                'value' => Leader::query()->count(),
                'detail' => Leader::query()->active()->count().' active profiles',
                'href' => '/admin/leaders',
            ];
        }

        $associationQuery = Association::query();
        if ($user && ! $user->hasRole('super-admin') && $user->associations()->exists()) {
            $associationQuery->whereIn('id', $user->associations()->pluck('associations.id'));
        }

        if ($showSection(AdminSection::ASSOCIATIONS)) {
            $stats[] = [
                'label' => 'Associations',
                'value' => (clone $associationQuery)->count(),
                'detail' => (clone $associationQuery)->where('is_active', true)->count().' public directory profiles',
                'href' => '/admin/associations',
            ];
        }

        if ($showSection(AdminSection::LIBRARY)) {
            $stats[] = [
                'label' => 'Documents',
                'value' => Document::query()->count(),
                'detail' => Document::query()->where('is_public', true)->count().' public resources',
                'href' => '/admin/documents',
            ];
        }

        $meetingQuery = MeetingRequest::query();
        if ($user && ! $user->hasRole('super-admin') && $user->associations()->exists()) {
            $meetingQuery->whereIn('association_id', $user->associations()->pluck('associations.id'));
        }

        if ($user && $user->can('manage meetings') && $showSection(AdminSection::MEETINGS)) {
            $stats[] = [
                'label' => 'Meetings',
                'value' => (clone $meetingQuery)->count(),
                'detail' => (clone $meetingQuery)->where('status', MeetingRequest::STATUS_PENDING)->count().' pending requests',
                'href' => '/admin/meetings',
            ];
        }

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentAnnouncements' => $showSection(AdminSection::ANNOUNCEMENTS)
                ? Announcement::query()
                    ->priorityOrdered()
                    ->limit(5)
                    ->get(['id', 'title', 'priority_level', 'is_active', 'starts_at'])
                    ->map(fn (Announcement $announcement) => [
                        'id' => $announcement->id,
                        'title' => $announcement->title,
                        'meta' => 'Priority '.($announcement->priority_level ?? 0),
                        'status' => $announcement->is_active ? 'Active' : 'Inactive',
                    ])
                    ->all()
                : [],
            'recentNews' => $showSection(AdminSection::NEWSWIRE)
                ? NewsPost::query()
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
                    ->all()
                : [],
            'recentDocuments' => $showSection(AdminSection::LIBRARY)
                ? Document::query()
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
                    ->all()
                : [],
            'recentMeetings' => $user && $user->can('manage meetings') && $showSection(AdminSection::MEETINGS)
                ? (clone $meetingQuery)
                    ->latest()
                    ->limit(5)
                    ->get()
                    ->map(fn (MeetingRequest $meetingRequest) => [
                        'id' => $meetingRequest->id,
                        'title' => $meetingRequest->meeting_with_name ?: $meetingRequest->requester_name,
                        'meta' => $meetingRequest->requester_name.' | '.($meetingRequest->preferred_date?->format('M d, Y') ?? 'Date pending'),
                        'status' => MeetingRequest::statuses()[$meetingRequest->status] ?? ucfirst($meetingRequest->status),
                    ])
                    ->all()
                : [],
            'associationWorkspaces' => (clone $associationQuery)
                ->orderBy('name')
                ->limit(6)
                ->get()
                ->map(fn (Association $association) => [
                    'id' => $association->id,
                    'name' => $association->name,
                    'slug' => $association->slug,
                    'regions' => $association->regions ?? [$association->region],
                    'leaders_count' => count($association->leaders ?? []),
                    'gallery_count' => count($association->gallery ?? []),
                    'document_count' => $association->documents()->count(),
                    'is_active' => $association->is_active,
                    'href' => '/admin/associations/'.$association->slug,
                ])
                ->all(),
        ]);
    }
}
