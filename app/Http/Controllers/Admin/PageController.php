<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\StorePageRequest;
use App\Models\ContentStatus;
use App\Models\Page;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends AdminController
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Page::class);

        return Inertia::render('Admin/Pages', [
            'pages' => Page::query()
                ->with('status')
                ->orderByDesc('updated_at')
                ->get()
                ->map(fn (Page $page) => [
                    'id' => $page->id,
                    'title' => $page->title,
                    'slug' => $page->slug,
                    'content' => $page->content,
                    'featured_image' => $page->featured_image,
                    'seo_title' => $page->seo_title,
                    'seo_description' => $page->seo_description,
                    'status_id' => $page->status_id,
                    'status' => $page->status?->slug,
                    'published_at' => $page->published_at?->format('Y-m-d\TH:i'),
                ])->all(),
            'contentStatuses' => ContentStatus::query()->orderBy('sort_order')->get(['id', 'name', 'slug']),
        ]);
    }

    public function store(StorePageRequest $request): RedirectResponse
    {
        $this->authorize('create', Page::class);
        Page::query()->create($this->payload($request, $request->validated()));

        return redirect()->route('admin.pages.index')->with('success', 'Page created successfully.');
    }

    public function update(StorePageRequest $request, Page $page): RedirectResponse
    {
        $this->authorize('update', $page);
        $page->update($this->payload($request, $request->validated(), $page));

        return redirect()->route('admin.pages.index')->with('success', 'Page updated successfully.');
    }

    public function destroy(Request $request, Page $page): RedirectResponse
    {
        $this->authorize('delete', $page);
        $page->delete();

        return redirect()->route('admin.pages.index')->with('success', 'Page deleted successfully.');
    }

    private function payload(Request $request, array $data, ?Page $page = null): array
    {
        $statusId = $data['status_id'] ?? ($page?->status_id ?: ContentStatus::query()->where('slug', ContentStatus::DRAFT)->value('id'));

        return [
            'title' => $data['title'],
            'slug' => $this->generateUniqueSlug($data['slug'] ?: $data['title'], $page?->id),
            'content' => $data['content'],
            'featured_image' => $data['featured_image'] ?? null,
            'seo_title' => $data['seo_title'] ?? null,
            'seo_description' => $data['seo_description'] ?? null,
            'created_by' => $page?->created_by ?? $request->user()?->id,
            ...$this->applyWorkflow(
                $request,
                $page ?? new Page(),
                $statusId,
                $data['published_at'] ?? null,
            ),
        ];
    }

    private function generateUniqueSlug(string $value, ?int $ignoreId = null): string
    {
        $base = Str::slug($value);
        $base = $base !== '' ? $base : 'page';
        $slug = $base;
        $suffix = 2;

        while (
            Page::query()
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
