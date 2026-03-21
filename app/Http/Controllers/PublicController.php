<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Document;
use App\Models\DocumentDownloadLog;
use App\Models\GalleryItem;
use App\Models\Leader;
use App\Models\NewsPost;
use App\Models\Page;
use App\Models\VideoPost;
use App\Support\SiteSettings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
        $page = Page::query()->published()->where('slug', 'about')->first();

        return Inertia::render('About', [
            'about' => $page
                ? [
                    'title' => $page->title,
                    'body' => $page->content,
                    'mission' => '',
                    'vision' => '',
                    'values' => '',
                ]
                : SiteSettings::about(),
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
        abort_unless($newsPost->status?->slug === 'published', 404);

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

    public function documentSingle(Document $document)
    {
        abort_unless($document->status?->slug === 'published' && $document->is_public, 404);

        return Inertia::render('Documents/Show', [
            'document' => $this->mapDocument($document),
            'announcements' => $this->buildAnnouncements(),
        ]);
    }

    public function downloadDocument(Request $request, Document $document): RedirectResponse
    {
        abort_unless($document->status?->slug === 'published' && $document->is_public, 404);

        $document->increment('download_count');

        DocumentDownloadLog::query()->create([
            'document_id' => $document->id,
            'user_id' => $request->user()?->id,
            'ip_address' => $request->ip(),
            'downloaded_at' => now(),
        ]);

        return redirect()->away($this->resolveUrl($document->file_path) ?? '/documents');
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
            ->active()
            ->priorityOrdered()
            ->get()
            ->map(fn (Announcement $announcement) => [
                'id' => $announcement->id,
                'title' => $announcement->title,
                'body' => $announcement->body,
                'slug' => 'announcement-'.$announcement->id,
                'priority' => $announcement->priority_level ?? 0,
                'starts_at' => $announcement->starts_at?->toDateString(),
                'ends_at' => $announcement->expires_at?->toDateString(),
            ])
            ->toArray();
    }

    private function buildNews(): array
    {
        return NewsPost::query()
            ->with(['status', 'category'])
            ->published()
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
            'body' => $news->content,
            'content' => $news->content,
            'cover_image' => $this->resolveUrl($news->featured_image),
            'featured_image' => $this->resolveUrl($news->featured_image),
            'published_at' => $news->published_at?->toDateString(),
            'status' => $news->status?->slug,
            'category' => $news->category?->name,
            'is_featured' => $news->is_featured,
        ];
    }

    private function buildLeaders(): array
    {
        return Leader::query()
            ->active()
            ->get()
            ->map(fn (Leader $leader) => [
                'id' => $leader->id,
                'name' => $leader->name,
                'title' => $leader->designation,
                'designation' => $leader->designation,
                'department' => $leader->department,
                'bio' => $leader->bio,
                'photo_path' => $this->resolveUrl($leader->image_path),
                'image_path' => $this->resolveUrl($leader->image_path),
                'rank_order' => $leader->rank_order,
            ])
            ->toArray();
    }

    private function buildGallery(): array
    {
        $gallery = GalleryItem::query()
            ->with('media')
            ->featuredFirst()
            ->get()
            ->map(fn (GalleryItem $item) => [
                'id' => $item->id,
                'title' => $item->title ?? $item->media?->title ?? $item->media?->file_name,
                'slug' => 'gallery-'.$item->id,
                'type' => 'image',
                'description' => $item->caption ?? $item->media?->caption,
                'image_path' => $this->resolveUrl($item->media?->file_path),
                'youtube_url' => null,
                'is_featured' => $item->is_featured,
                'published_at' => $item->created_at?->toDateString(),
            ]);

        $videos = VideoPost::query()
            ->with('status')
            ->published()
            ->featured()
            ->orderByDesc('published_at')
            ->limit(6)
            ->get()
            ->map(fn (VideoPost $video) => [
                'id' => 100000 + $video->id,
                'title' => $video->title,
                'slug' => $video->slug,
                'type' => 'youtube',
                'description' => $video->summary ?: $video->description,
                'image_path' => $video->thumbnail,
                'youtube_url' => $video->youtube_url,
                'is_featured' => $video->is_featured,
                'published_at' => $video->published_at?->toDateString(),
            ]);

        return $gallery
            ->concat($videos)
            ->sortByDesc(fn (array $item) => [$item['is_featured'], $item['published_at']])
            ->values()
            ->all();
    }

    private function buildDocuments(): array
    {
        return Document::query()
            ->with(['status', 'category'])
            ->published()
            ->where('is_public', true)
            ->orderByDesc('published_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Document $document) => $this->mapDocument($document))
            ->toArray();
    }

    private function mapDocument(Document $document): array
    {
        $url = $this->resolveUrl($document->file_path);
        $extension = strtolower((string) ($document->file_extension ?: pathinfo($document->file_path, PATHINFO_EXTENSION)));

        return [
            'id' => $document->id,
            'title' => $document->title,
            'slug' => $document->slug,
            'description' => $document->description,
            'file_path' => $url,
            'download_url' => route('documents.download', $document),
            'file_type' => $document->document_type ?: $extension,
            'category' => $document->category?->name,
            'published_at' => $document->published_at?->toDateString(),
            'preview' => $extension === 'pdf'
                ? 'pdf'
                : (in_array($extension, ['jpg', 'jpeg', 'png', 'webp', 'gif'], true) ? 'image' : null),
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
