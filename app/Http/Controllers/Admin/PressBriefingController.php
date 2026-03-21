<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\StorePressBriefingRequest;
use App\Models\ContentStatus;
use App\Models\PressBriefing;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PressBriefingController extends AdminController
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', PressBriefing::class);

        return Inertia::render('Admin/PressBriefings', [
            'pressBriefings' => PressBriefing::query()
                ->with(['status', 'tags'])
                ->orderByDesc('briefing_date')
                ->orderByDesc('created_at')
                ->get()
                ->map(fn (PressBriefing $briefing) => [
                    'id' => $briefing->id,
                    'title' => $briefing->title,
                    'slug' => $briefing->slug,
                    'summary' => $briefing->summary,
                    'content' => $briefing->content,
                    'featured_image' => $briefing->featured_image,
                    'briefing_date' => $briefing->briefing_date?->toDateString(),
                    'location' => $briefing->location,
                    'status_id' => $briefing->status_id,
                    'status' => $briefing->status?->slug,
                    'published_at' => $briefing->published_at?->format('Y-m-d\TH:i'),
                    'tag_ids' => $briefing->tags->pluck('id')->all(),
                ])->all(),
            'contentStatuses' => ContentStatus::query()->orderBy('sort_order')->get(['id', 'name', 'slug']),
            'tags' => Tag::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StorePressBriefingRequest $request): RedirectResponse
    {
        $this->authorize('create', PressBriefing::class);
        $data = $request->validated();
        $briefing = PressBriefing::query()->create($this->payload($request, $data));
        $briefing->tags()->sync($data['tag_ids'] ?? []);

        return redirect()->route('admin.press-briefings.index')->with('success', 'Press briefing created successfully.');
    }

    public function update(StorePressBriefingRequest $request, PressBriefing $pressBriefing): RedirectResponse
    {
        $this->authorize('update', $pressBriefing);
        $data = $request->validated();
        $pressBriefing->update($this->payload($request, $data, $pressBriefing));
        $pressBriefing->tags()->sync($data['tag_ids'] ?? []);

        return redirect()->route('admin.press-briefings.index')->with('success', 'Press briefing updated successfully.');
    }

    public function destroy(Request $request, PressBriefing $pressBriefing): RedirectResponse
    {
        $this->authorize('delete', $pressBriefing);
        $pressBriefing->delete();

        return redirect()->route('admin.press-briefings.index')->with('success', 'Press briefing deleted successfully.');
    }

    private function payload(Request $request, array $data, ?PressBriefing $briefing = null): array
    {
        $statusId = $data['status_id'] ?? ($briefing?->status_id ?: ContentStatus::query()->where('slug', ContentStatus::DRAFT)->value('id'));

        return [
            'title' => $data['title'],
            'slug' => $this->generateUniqueSlug($data['slug'] ?: $data['title'], $briefing?->id),
            'summary' => $data['summary'] ?? null,
            'content' => $data['content'],
            'featured_image' => $data['featured_image'] ?? null,
            'briefing_date' => $data['briefing_date'] ?? null,
            'location' => $data['location'] ?? null,
            'created_by' => $briefing?->created_by ?? $request->user()?->id,
            ...$this->applyWorkflow(
                $request,
                $briefing ?? new PressBriefing(),
                $statusId,
                $data['published_at'] ?? null,
            ),
        ];
    }

    private function generateUniqueSlug(string $value, ?int $ignoreId = null): string
    {
        $base = Str::slug($value);
        $base = $base !== '' ? $base : 'press-briefing';
        $slug = $base;
        $suffix = 2;

        while (
            PressBriefing::query()
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
