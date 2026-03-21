<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\StoreVideoPostRequest;
use App\Models\ContentStatus;
use App\Models\Tag;
use App\Models\VideoCategory;
use App\Models\VideoPost;
use App\Support\YouTube;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class VideoController extends AdminController
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', VideoPost::class);

        return Inertia::render('Admin/Videos', [
            'videos' => VideoPost::query()
                ->with(['category', 'status', 'tags'])
                ->orderByDesc('published_at')
                ->orderByDesc('created_at')
                ->get()
                ->map(fn (VideoPost $video) => [
                    'id' => $video->id,
                    'title' => $video->title,
                    'slug' => $video->slug,
                    'summary' => $video->summary,
                    'description' => $video->description,
                    'youtube_url' => $video->youtube_url,
                    'youtube_video_id' => $video->youtube_video_id,
                    'thumbnail' => $video->thumbnail,
                    'duration' => $video->duration,
                    'category_id' => $video->category_id,
                    'category' => $video->category?->name,
                    'status_id' => $video->status_id,
                    'status' => $video->status?->slug,
                    'is_featured' => $video->is_featured,
                    'published_at' => $video->published_at?->format('Y-m-d\TH:i'),
                    'tag_ids' => $video->tags->pluck('id')->all(),
                ])
                ->all(),
            'videoCategories' => VideoCategory::query()->orderBy('name')->get(['id', 'name']),
            'contentStatuses' => ContentStatus::query()->orderBy('sort_order')->get(['id', 'name', 'slug']),
            'tags' => Tag::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreVideoPostRequest $request): RedirectResponse
    {
        $this->authorize('create', VideoPost::class);
        $data = $request->validated();
        $video = VideoPost::query()->create($this->payload($request, $data));
        $video->tags()->sync($data['tag_ids'] ?? []);

        return redirect()->route('admin.videos.index')->with('success', 'Video created successfully.');
    }

    public function update(StoreVideoPostRequest $request, VideoPost $videoPost): RedirectResponse
    {
        $this->authorize('update', $videoPost);
        $data = $request->validated();
        $videoPost->update($this->payload($request, $data, $videoPost));
        $videoPost->tags()->sync($data['tag_ids'] ?? []);

        return redirect()->route('admin.videos.index')->with('success', 'Video updated successfully.');
    }

    public function destroy(Request $request, VideoPost $videoPost): RedirectResponse
    {
        $this->authorize('delete', $videoPost);
        $videoPost->delete();

        return redirect()->route('admin.videos.index')->with('success', 'Video deleted successfully.');
    }

    private function payload(Request $request, array $data, ?VideoPost $video = null): array
    {
        $statusId = $data['status_id'] ?? ($video?->status_id ?: ContentStatus::query()->where('slug', ContentStatus::DRAFT)->value('id'));

        return [
            'title' => $data['title'],
            'slug' => $this->generateUniqueSlug($data['slug'] ?: $data['title'], $video?->id),
            'summary' => $data['summary'] ?? null,
            'description' => $data['description'] ?? null,
            'youtube_url' => $data['youtube_url'],
            'youtube_video_id' => YouTube::parseVideoId($data['youtube_url']) ?? '',
            'thumbnail' => $data['thumbnail'] ?? null,
            'duration' => $data['duration'] ?? null,
            'category_id' => $data['category_id'] ?? null,
            'is_featured' => (bool) ($data['is_featured'] ?? false),
            'created_by' => $video?->created_by ?? $request->user()?->id,
            ...$this->applyWorkflow(
                $request,
                $video ?? new VideoPost(),
                $statusId,
                $data['published_at'] ?? null,
            ),
        ];
    }

    private function generateUniqueSlug(string $value, ?int $ignoreId = null): string
    {
        $base = Str::slug($value);
        $base = $base !== '' ? $base : 'video-post';
        $slug = $base;
        $suffix = 2;

        while (
            VideoPost::query()
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
