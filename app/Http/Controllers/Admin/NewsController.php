<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\StoreNewsPostRequest;
use App\Models\ContentStatus;
use App\Models\NewsCategory;
use App\Models\NewsPost;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class NewsController extends AdminController
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', NewsPost::class);

        $news = NewsPost::query()
            ->with(['category', 'status', 'tags'])
            ->orderByDesc('published_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (NewsPost $item) => [
                'id' => $item->id,
                'title' => $item->title,
                'slug' => $item->slug,
                'excerpt' => $item->excerpt,
                'body' => $item->content,
                'content' => $item->content,
                'cover_image' => $item->featured_image,
                'featured_image' => $item->featured_image,
                'published_at' => $item->published_at?->format('Y-m-d\TH:i'),
                'is_published' => $item->status?->slug === ContentStatus::PUBLISHED,
                'is_featured' => $item->is_featured,
                'status_id' => $item->status_id,
                'status' => $item->status?->slug,
                'category_id' => $item->category_id,
                'category' => $item->category?->name,
                'tag_ids' => $item->tags->pluck('id')->all(),
            ])
            ->all();

        return Inertia::render('Admin/News', [
            'news' => $news,
            'newsCategories' => NewsCategory::query()->orderBy('name')->get(['id', 'name', 'slug']),
            'contentStatuses' => ContentStatus::query()->orderBy('sort_order')->get(['id', 'name', 'slug', 'is_public']),
        ]);
    }

    public function store(StoreNewsPostRequest $request): RedirectResponse
    {
        $this->authorize('create', NewsPost::class);

        $data = $request->validated();
        $newsPost = NewsPost::query()->create($this->payload($request, $data));
        $newsPost->tags()->sync($data['tag_ids'] ?? []);

        return redirect()
            ->route('admin.news.index')
            ->with('success', 'News post created successfully.');
    }

    public function update(StoreNewsPostRequest $request, NewsPost $newsPost): RedirectResponse
    {
        $this->authorize('update', $newsPost);

        $data = $request->validated();
        $newsPost->update($this->payload($request, $data, $newsPost));
        $newsPost->tags()->sync($data['tag_ids'] ?? []);

        return redirect()
            ->route('admin.news.index')
            ->with('success', 'News post updated successfully.');
    }

    public function destroy(Request $request, NewsPost $newsPost): RedirectResponse
    {
        $this->authorize('delete', $newsPost);

        $newsPost->delete();

        return redirect()
            ->route('admin.news.index')
            ->with('success', 'News post deleted successfully.');
    }

    private function payload(Request $request, array $data, ?NewsPost $newsPost = null): array
    {
        $statusId = $this->resolveStatusId(
            $data['status_id'] ?? null,
            (bool) ($data['is_published'] ?? false),
        );

        return [
            'title' => $data['title'],
            'slug' => $this->generateUniqueSlug($data['slug'] ?: $data['title'], $newsPost?->id),
            'excerpt' => $data['excerpt'] ?? null,
            'content' => $data['content'] ?: ($data['body'] ?? ''),
            'featured_image' => $data['featured_image'] ?? ($data['cover_image'] ?? null),
            'seo_title' => $data['seo_title'] ?? null,
            'seo_description' => $data['seo_description'] ?? null,
            'category_id' => $data['category_id'] ?? null,
            'is_featured' => (bool) ($data['is_featured'] ?? false),
            'created_by' => $newsPost?->created_by ?? $request->user()?->id,
            ...$this->applyWorkflow(
                $request,
                $newsPost ?? new NewsPost(),
                $statusId,
                $data['published_at'] ?? null,
            ),
        ];
    }

    private function resolveStatusId(?int $statusId, bool $isPublished): int
    {
        if ($statusId) {
            return $statusId;
        }

        return ContentStatus::query()
            ->where('slug', $isPublished ? ContentStatus::PENDING_REVIEW : ContentStatus::DRAFT)
            ->value('id');
    }

    private function generateUniqueSlug(string $value, ?int $ignoreId = null): string
    {
        $base = Str::slug($value);
        $base = $base !== '' ? $base : 'news-post';
        $slug = $base;
        $suffix = 2;

        while (
            NewsPost::query()
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
