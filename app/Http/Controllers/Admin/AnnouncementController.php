<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\StoreAnnouncementRequest;
use App\Models\Announcement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends AdminController
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Announcement::class);

        $announcements = Announcement::query()
            ->priorityOrdered()
            ->get()
            ->map(fn (Announcement $announcement) => [
                'id' => $announcement->id,
                'slug' => 'announcement-'.$announcement->id,
                'title' => $announcement->title,
                'body' => $announcement->body,
                'is_active' => $announcement->is_active,
                'starts_at' => $announcement->starts_at?->format('Y-m-d\TH:i'),
                'ends_at' => $announcement->expires_at?->format('Y-m-d\TH:i'),
                'priority' => $announcement->priority_level ?? 0,
            ])
            ->all();

        return Inertia::render('Admin/Announcements', [
            'announcements' => $announcements,
        ]);
    }

    public function store(StoreAnnouncementRequest $request): RedirectResponse
    {
        $this->authorize('create', Announcement::class);

        Announcement::query()->create([
            ...$request->validated(),
            'created_by' => $request->user()?->id,
            'updated_by' => $request->user()?->id,
            'expires_at' => $request->validated()['expires_at'] ?? ($request->validated()['ends_at'] ?? null),
            'priority_level' => $request->validated()['priority_level'] ?? ($request->validated()['priority'] ?? null),
        ]);

        return redirect()
            ->route('admin.announcements.index')
            ->with('success', 'Announcement created successfully.');
    }

    public function update(StoreAnnouncementRequest $request, Announcement $announcement): RedirectResponse
    {
        $this->authorize('update', $announcement);

        $announcement->update([
            ...$request->validated(),
            'updated_by' => $request->user()?->id,
            'expires_at' => $request->validated()['expires_at'] ?? ($request->validated()['ends_at'] ?? null),
            'priority_level' => $request->validated()['priority_level'] ?? ($request->validated()['priority'] ?? null),
        ]);

        return redirect()
            ->route('admin.announcements.index')
            ->with('success', 'Announcement updated successfully.');
    }

    public function destroy(Request $request, Announcement $announcement): RedirectResponse
    {
        $this->authorize('delete', $announcement);

        $announcement->delete();

        return redirect()
            ->route('admin.announcements.index')
            ->with('success', 'Announcement deleted successfully.');
    }
}
