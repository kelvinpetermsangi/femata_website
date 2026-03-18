<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function index(): Response
    {
        $items = GalleryItem::query()
            ->orderByDesc('is_featured')
            ->orderByDesc('published_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (GalleryItem $item) => [
                'id' => $item->id,
                'title' => $item->title,
                'slug' => $item->slug,
                'type' => $item->type,
                'image_path' => $item->image_path,
                'youtube_url' => $item->youtube_url,
                'description' => $item->description,
                'is_featured' => $item->is_featured,
                'published_at' => $item->published_at?->format('Y-m-d\TH:i'),
            ])
            ->all();

        return Inertia::render('Admin/Gallery', [
            'galleryItems' => $items,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatedData($request);

        GalleryItem::query()->create($this->payload($data));

        return redirect()
            ->route('admin.gallery.index')
            ->with('success', 'Gallery item created successfully.');
    }

    public function update(Request $request, GalleryItem $galleryItem): RedirectResponse
    {
        $data = $this->validatedData($request, $galleryItem);

        $galleryItem->update($this->payload($data, $galleryItem->id));

        return redirect()
            ->route('admin.gallery.index')
            ->with('success', 'Gallery item updated successfully.');
    }

    public function destroy(GalleryItem $galleryItem): RedirectResponse
    {
        $galleryItem->delete();

        return redirect()
            ->route('admin.gallery.index')
            ->with('success', 'Gallery item deleted successfully.');
    }

    private function validatedData(Request $request, ?GalleryItem $galleryItem = null): array
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('gallery_items', 'slug')->ignore($galleryItem?->id),
            ],
            'type' => ['required', Rule::in([GalleryItem::TYPE_IMAGE, GalleryItem::TYPE_YOUTUBE])],
            'image_path' => ['nullable', 'string', 'max:2048'],
            'youtube_url' => ['nullable', 'string', 'max:2048'],
            'description' => ['nullable', 'string'],
            'is_featured' => ['required', 'boolean'],
            'published_at' => ['nullable', 'date'],
        ]);

        if ($data['type'] === GalleryItem::TYPE_IMAGE && blank($data['image_path'] ?? null)) {
            throw ValidationException::withMessages([
                'image_path' => 'An image URL is required for image items.',
            ]);
        }

        if ($data['type'] === GalleryItem::TYPE_YOUTUBE && blank($data['youtube_url'] ?? null)) {
            throw ValidationException::withMessages([
                'youtube_url' => 'A YouTube URL is required for video items.',
            ]);
        }

        return $data;
    }

    private function payload(array $data, ?int $ignoreId = null): array
    {
        return [
            'title' => $data['title'],
            'slug' => $this->generateUniqueSlug($data['slug'] ?: $data['title'], $ignoreId),
            'type' => $data['type'],
            'image_path' => $data['type'] === GalleryItem::TYPE_IMAGE ? $data['image_path'] : null,
            'youtube_url' => $data['type'] === GalleryItem::TYPE_YOUTUBE ? $data['youtube_url'] : null,
            'description' => $data['description'],
            'is_featured' => $data['is_featured'],
            'published_at' => $data['published_at'],
        ];
    }

    private function generateUniqueSlug(string $value, ?int $ignoreId = null): string
    {
        $base = Str::slug($value);
        $base = $base !== '' ? $base : 'gallery-item';
        $slug = $base;
        $suffix = 2;

        while (
            GalleryItem::query()
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
