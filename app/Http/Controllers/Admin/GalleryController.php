<?php

namespace App\Http\Controllers\Admin;

use App\Models\GalleryItem;
use App\Models\MediaLibrary;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends AdminController
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', GalleryItem::class);

        $items = GalleryItem::query()
            ->with('media')
            ->featuredFirst()
            ->get()
            ->map(fn (GalleryItem $item) => [
                'id' => $item->id,
                'slug' => 'gallery-'.$item->id,
                'title' => $item->title ?? $item->media?->title ?? '',
                'type' => 'image',
                'image_path' => $item->media?->file_path,
                'youtube_url' => null,
                'description' => $item->caption ?? $item->media?->caption,
                'is_featured' => $item->is_featured,
                'published_at' => $item->created_at?->format('Y-m-d\TH:i'),
            ])
            ->all();

        return Inertia::render('Admin/Gallery', [
            'galleryItems' => $items,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', GalleryItem::class);
        $data = $this->validatedData($request);

        $media = MediaLibrary::query()->create([
            'title' => $data['title'],
            'file_name' => basename((string) parse_url($data['image_path'], PHP_URL_PATH)),
            'file_path' => $data['image_path'],
            'file_type' => 'image',
            'caption' => $data['description'],
            'uploaded_by' => $request->user()?->id,
        ]);

        GalleryItem::query()->create([
            'title' => $data['title'],
            'caption' => $data['description'],
            'media_id' => $media->id,
            'display_order' => 0,
            'is_featured' => $data['is_featured'],
            'created_by' => $request->user()?->id,
        ]);

        return redirect()
            ->route('admin.gallery.index')
            ->with('success', 'Gallery item created successfully.');
    }

    public function update(Request $request, GalleryItem $galleryItem): RedirectResponse
    {
        $this->authorize('update', $galleryItem);
        $data = $this->validatedData($request);

        $galleryItem->update([
            'title' => $data['title'],
            'caption' => $data['description'],
            'is_featured' => $data['is_featured'],
        ]);

        $galleryItem->media?->update([
            'title' => $data['title'],
            'file_name' => basename((string) parse_url($data['image_path'], PHP_URL_PATH)),
            'file_path' => $data['image_path'],
            'file_type' => 'image',
            'caption' => $data['description'],
        ]);

        return redirect()
            ->route('admin.gallery.index')
            ->with('success', 'Gallery item updated successfully.');
    }

    public function destroy(Request $request, GalleryItem $galleryItem): RedirectResponse
    {
        $this->authorize('delete', $galleryItem);

        $galleryItem->media?->delete();
        $galleryItem->delete();

        return redirect()
            ->route('admin.gallery.index')
            ->with('success', 'Gallery item deleted successfully.');
    }

    private function validatedData(Request $request): array
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'type' => ['nullable', 'string'],
            'image_path' => ['nullable', 'string', 'max:2048'],
            'youtube_url' => ['nullable', 'string', 'max:2048'],
            'description' => ['nullable', 'string'],
            'is_featured' => ['required', 'boolean'],
        ]);

        if (($data['type'] ?? 'image') === 'youtube') {
            throw ValidationException::withMessages([
                'type' => 'Online TV videos are now managed through the video module.',
            ]);
        }

        if (blank($data['image_path'] ?? null)) {
            throw ValidationException::withMessages([
                'image_path' => 'An image URL or storage path is required.',
            ]);
        }

        return $data;
    }
}
