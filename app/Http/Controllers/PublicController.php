<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\DocumentFile;
use App\Models\GalleryItem;
use App\Models\Leader;
use App\Models\NewsPost;
use App\Support\SiteSettings;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PublicController extends Controller
{
    public function home()
    {
        return Inertia::render('Home', [
            'announcements' => $this->buildAnnouncements(),
            'news' => $this->buildNews(),
            'leaders' => $this->buildLeaders(),
            'documents' => $this->buildDocuments(),
            'galleryItems' => $this->buildGallery(),
            'homeContent' => SiteSettings::home(),
        ]);
    }

    public function about()
    {
        return Inertia::render('About', [
            'about' => SiteSettings::about(),
            'announcements' => $this->buildAnnouncements(),
        ]);
    }

    public function leadership()
    {
        return Inertia::render('Leadership', [
            'leaders' => $this->buildLeaders(),
            'announcements' => $this->buildAnnouncements(),
        ]);
    }

    public function news()
    {
        return Inertia::render('News/Index', [
            'news' => $this->buildNews(),
            'announcements' => $this->buildAnnouncements(),
        ]);
    }

    public function newsSingle(NewsPost $newsPost)
    {
        return Inertia::render('News/Show', [
            'news' => $this->mapNewsPost($newsPost),
            'announcements' => $this->buildAnnouncements(),
        ]);
    }

    public function gallery()
    {
        return Inertia::render('Gallery', [
            'galleryItems' => $this->buildGallery(),
            'announcements' => $this->buildAnnouncements(),
        ]);
    }

    public function documents()
    {
        return Inertia::render('Documents/Index', [
            'documents' => $this->buildDocuments(),
            'announcements' => $this->buildAnnouncements(),
        ]);
    }

    public function documentSingle(DocumentFile $documentFile)
    {
        return Inertia::render('Documents/Show', [
            'document' => $this->mapDocument($documentFile),
            'announcements' => $this->buildAnnouncements(),
        ]);
    }

    public function contact()
    {
        return Inertia::render('Contact', [
            'contact' => SiteSettings::contact(),
            'announcements' => $this->buildAnnouncements(),
        ]);
    }

    public function announcements()
    {
        return Inertia::render('Announcements', [
            'announcements' => $this->buildAnnouncements(),
        ]);
    }

    private function buildAnnouncements(): array
    {
        return Announcement::query()
            ->where('is_active', true)
            ->where(function ($query) {
                $query->whereNull('starts_at')->orWhere('starts_at', '<=', now());
            })
            ->where(function ($query) {
                $query->whereNull('ends_at')->orWhere('ends_at', '>=', now());
            })
            ->orderByDesc('priority')
            ->orderByDesc('starts_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Announcement $announcement) => [
                'id' => $announcement->id,
                'title' => $announcement->title,
                'body' => $announcement->body,
                'slug' => $announcement->slug,
                'priority' => $announcement->priority,
            ])
            ->toArray();
    }

    private function buildNews(): array
    {
        return NewsPost::query()
            ->where('is_published', true)
            ->where(function ($query) {
                $query->whereNull('published_at')->orWhere('published_at', '<=', now());
            })
            ->orderByDesc('published_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (NewsPost $news) => $this->mapNewsPost($news))
            ->toArray();
    }

    private function mapNewsPost(NewsPost $news): array
    {
        return [
            'id' => $news->id,
            'title' => $news->title,
            'slug' => $news->slug,
            'excerpt' => $news->excerpt,
            'body' => $news->body,
            'cover_image' => $this->resolveUrl($news->cover_image),
            'published_at' => $news->published_at?->toDateString(),
        ];
    }

    private function buildLeaders(): array
    {
        return Leader::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn (Leader $leader) => [
                'id' => $leader->id,
                'name' => $leader->name,
                'title' => $leader->title,
                'bio' => $leader->bio,
                'photo_path' => $this->resolveUrl($leader->photo_path),
            ])
            ->toArray();
    }

    private function buildGallery(): array
    {
        return GalleryItem::query()
            ->where(function ($query) {
                $query->whereNull('published_at')->orWhere('published_at', '<=', now());
            })
            ->orderByDesc('is_featured')
            ->orderByDesc('published_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (GalleryItem $item) => [
                'id' => $item->id,
                'title' => $item->title,
                'slug' => $item->slug,
                'type' => $item->type,
                'description' => $item->description,
                'image_path' => $this->resolveUrl($item->image_path),
                'youtube_url' => $item->youtube_url,
                'is_featured' => $item->is_featured,
                'published_at' => $item->published_at?->toDateString(),
            ])
            ->toArray();
    }

    private function buildDocuments(): array
    {
        return DocumentFile::query()
            ->where('is_public', true)
            ->where(function ($query) {
                $query->whereNull('published_at')->orWhere('published_at', '<=', now());
            })
            ->orderByDesc('published_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (DocumentFile $document) => $this->mapDocument($document))
            ->toArray();
    }

    private function mapDocument(DocumentFile $document): array
    {
        $url = $this->resolveUrl($document->file_path);

        return [
            'id' => $document->id,
            'title' => $document->title,
            'slug' => $document->slug,
            'description' => $document->description,
            'file_path' => $url,
            'file_type' => $document->file_type,
            'category' => $document->category,
            'published_at' => $document->published_at?->toDateString(),
            'preview' => $document->file_type === 'application/pdf'
                ? 'pdf'
                : ($document->file_type && str_starts_with($document->file_type, 'image/')
                    ? 'image'
                    : null),
        ];
    }

    private function resolveUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        if (str_starts_with($path, 'http')) {
            return $path;
        }

        return Storage::url($path);
    }
}
