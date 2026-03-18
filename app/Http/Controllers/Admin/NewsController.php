<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsPost;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class NewsController extends Controller
{
    public function index(): Response
    {
        $news = NewsPost::query()
            ->orderByDesc('published_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (NewsPost $item) => [
                'id' => $item->id,
                'title' => $item->title,
                'slug' => $item->slug,
                'excerpt' => $item->excerpt,
                'body' => $item->body,
                'cover_image' => $item->cover_image,
                'published_at' => $item->published_at?->format('Y-m-d\TH:i'),
                'is_published' => $item->is_published,
            ])
            ->all();

        return Inertia::render('Admin/News', [
            'news' => $news,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatedData($request);

        NewsPost::query()->create([
            'title' => $data['title'],
            'slug' => $this->generateUniqueSlug($data['slug'] ?: $data['title']),
            'excerpt' => $data['excerpt'],
            'body' => $data['body'],
            'cover_image' => $data['cover_image'],
            'published_at' => $data['published_at'],
            'is_published' => $data['is_published'],
        ]);

        return redirect()
            ->route('admin.news.index')
            ->with('success', 'News post created successfully.');
    }

    public function update(Request $request, NewsPost $newsPost): RedirectResponse
    {
        $data = $this->validatedData($request, $newsPost);

        $newsPost->update([
            'title' => $data['title'],
            'slug' => $this->generateUniqueSlug($data['slug'] ?: $data['title'], $newsPost->id),
            'excerpt' => $data['excerpt'],
            'body' => $data['body'],
            'cover_image' => $data['cover_image'],
            'published_at' => $data['published_at'],
            'is_published' => $data['is_published'],
        ]);

        return redirect()
            ->route('admin.news.index')
            ->with('success', 'News post updated successfully.');
    }

    public function destroy(NewsPost $newsPost): RedirectResponse
    {
        $newsPost->delete();

        return redirect()
            ->route('admin.news.index')
            ->with('success', 'News post deleted successfully.');
    }

    private function validatedData(Request $request, ?NewsPost $newsPost = null): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('news_posts', 'slug')->ignore($newsPost?->id),
            ],
            'excerpt' => ['nullable', 'string', 'max:1000'],
            'body' => ['required', 'string'],
            'cover_image' => ['nullable', 'string', 'max:2048'],
            'published_at' => ['nullable', 'date'],
            'is_published' => ['required', 'boolean'],
        ]);
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
