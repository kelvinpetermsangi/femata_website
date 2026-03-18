<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    public function index(): Response
    {
        $announcements = Announcement::query()
            ->priorityOrdered()
            ->get()
            ->map(fn (Announcement $announcement) => [
                'id' => $announcement->id,
                'title' => $announcement->title,
                'slug' => $announcement->slug,
                'body' => $announcement->body,
                'is_active' => $announcement->is_active,
                'starts_at' => $announcement->starts_at?->format('Y-m-d\TH:i'),
                'ends_at' => $announcement->ends_at?->format('Y-m-d\TH:i'),
                'priority' => $announcement->priority,
            ])
            ->all();

        return Inertia::render('Admin/Announcements', [
            'announcements' => $announcements,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatedData($request);

        Announcement::query()->create([
            'title' => $data['title'],
            'slug' => $this->generateUniqueSlug($data['slug'] ?: $data['title']),
            'body' => $data['body'],
            'is_active' => $data['is_active'],
            'starts_at' => $data['starts_at'],
            'ends_at' => $data['ends_at'],
            'priority' => $data['priority'],
        ]);

        return redirect()
            ->route('admin.announcements.index')
            ->with('success', 'Announcement created successfully.');
    }

    public function update(Request $request, Announcement $announcement): RedirectResponse
    {
        $data = $this->validatedData($request, $announcement);

        $announcement->update([
            'title' => $data['title'],
            'slug' => $this->generateUniqueSlug($data['slug'] ?: $data['title'], $announcement->id),
            'body' => $data['body'],
            'is_active' => $data['is_active'],
            'starts_at' => $data['starts_at'],
            'ends_at' => $data['ends_at'],
            'priority' => $data['priority'],
        ]);

        return redirect()
            ->route('admin.announcements.index')
            ->with('success', 'Announcement updated successfully.');
    }

    public function destroy(Announcement $announcement): RedirectResponse
    {
        $announcement->delete();

        return redirect()
            ->route('admin.announcements.index')
            ->with('success', 'Announcement deleted successfully.');
    }

    private function validatedData(Request $request, ?Announcement $announcement = null): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('announcements', 'slug')->ignore($announcement?->id),
            ],
            'body' => ['required', 'string'],
            'is_active' => ['required', 'boolean'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'priority' => ['required', 'integer', 'min:0', 'max:9999'],
        ]);
    }

    private function generateUniqueSlug(string $value, ?int $ignoreId = null): string
    {
        $base = Str::slug($value);
        $base = $base !== '' ? $base : 'announcement';
        $slug = $base;
        $suffix = 2;

        while (
            Announcement::query()
                ->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = $base.'-'.$suffix;
            $suffix++;
        }

        return $slug;
    }
}
