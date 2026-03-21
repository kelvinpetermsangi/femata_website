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
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PublicController extends Controller
{
    public function home(): Response
    {
        $announcements = $this->buildAnnouncements();
        $news = $this->buildNews();
        $leaders = $this->buildLeaders();
        $documents = $this->buildDocuments();
        $galleryItems = $this->buildGallery();

        return Inertia::render('Home', [
            'announcements' => $announcements,
            'news' => $news,
            'leaders' => $leaders,
            'documents' => $documents,
            'galleryItems' => $galleryItems,
            'homeContent' => SiteSettings::home(),
            'pageMeta' => $this->buildPageMeta(
                title: 'Home',
                eyebrow: 'Welcome',
                description: 'Explore FEMATA news, leadership, documents, and sector updates.',
            ),
            'highlights' => [
                'featuredNews' => collect($news)->take(3)->values()->all(),
                'featuredLeaders' => collect($leaders)->take(4)->values()->all(),
                'featuredDocuments' => collect($documents)->take(4)->values()->all(),
                'featuredGallery' => collect($galleryItems)->take(6)->values()->all(),
            ],
        ]);
    }

    public function about(): Response
    {
        $page = Page::query()->published()->where('slug', 'about')->first();
        $announcements = $this->buildAnnouncements();
        $gallery = $this->buildImageGallery(limit: 8);
        $documents = $this->buildDocuments();
        $leaders = $this->buildLeaders();
        $news = $this->buildNews();
        $siteAbout = SiteSettings::about();

        $heroImage = $page?->featured_image
            ? $this->resolveUrl($page->featured_image)
            : ($gallery[0] ?? null);

        $aboutContent = $page
            ? [
                'title' => $page->title,
                'body' => $page->content,
                'mission' => '',
                'vision' => '',
                'values' => '',
                'featured_image' => $heroImage,
                'gallery' => $gallery,
                'hero' => [
                    'title' => $page->title,
                    'description' => $page->content,
                    'image' => $heroImage,
                    'eyebrow' => 'About FEMATA',
                ],
                'stats' => [
                    ['label' => 'Featured Photos', 'value' => count($gallery)],
                    ['label' => 'Public Documents', 'value' => count($documents)],
                    ['label' => 'Leadership Profiles', 'value' => count($leaders)],
                ],
            ]
            : array_merge($siteAbout, [
                'featured_image' => $heroImage,
                'gallery' => $gallery,
                'hero' => [
                    'title' => data_get($siteAbout, 'title', 'About FEMATA'),
                    'description' => data_get($siteAbout, 'body', ''),
                    'image' => $heroImage,
                    'eyebrow' => 'About FEMATA',
                ],
                'stats' => [
                    ['label' => 'Featured Photos', 'value' => count($gallery)],
                    ['label' => 'Public Documents', 'value' => count($documents)],
                    ['label' => 'Leadership Profiles', 'value' => count($leaders)],
                ],
            ]);

        return Inertia::render('About', [
            'about' => $aboutContent,
            'announcements' => $announcements,
            'pageMeta' => $this->buildPageMeta(
                title: $aboutContent['title'] ?? 'About',
                eyebrow: 'About FEMATA',
                description: strip_tags((string) ($aboutContent['body'] ?? '')),
                image: $heroImage,
            ),
            'relatedContent' => [
                'leaders' => collect($leaders)->take(4)->values()->all(),
                'news' => collect($news)->take(3)->values()->all(),
                'gallery' => collect($gallery)->take(6)->values()->all(),
            ],
        ]);
    }

    public function leadership(): Response
    {
        $leaders = $this->buildLeaders();
        $heroImage = data_get($leaders, '0.photo_path') ?: data_get($leaders, '0.image_path');

        return Inertia::render('Leadership', [
            'leaders' => $leaders,
            'announcements' => $this->buildAnnouncements(),
            'pageMeta' => $this->buildPageMeta(
                title: 'Leadership',
                eyebrow: 'Our Leadership',
                description: 'Meet the leadership team guiding FEMATA.',
                image: $heroImage,
            ),
            'hero' => [
                'title' => 'Leadership',
                'description' => 'Meet the leaders driving representation, advocacy, and sector coordination.',
                'image' => $heroImage,
                'eyebrow' => 'Leadership Team',
            ],
        ]);
    }

    public function news(): Response
    {
        $news = $this->buildNews();

        return Inertia::render('News/Index', [
            'news' => $news,
            'announcements' => $this->buildAnnouncements(),
            'pageMeta' => $this->buildPageMeta(
                title: 'News & Updates',
                eyebrow: 'Latest Updates',
                description: 'Read the latest FEMATA news, announcements, and sector developments.',
                image: data_get($news, '0.featured_image'),
            ),
            'hero' => [
                'title' => 'News & Updates',
                'description' => 'Stay informed with the latest institutional updates, stories, and sector highlights.',
                'image' => data_get($news, '0.featured_image'),
                'eyebrow' => 'Newsroom',
            ],
            'featuredNews' => collect($news)->where('is_featured', true)->take(5)->values()->all(),
        ]);
    }

    public function newsSingle(NewsPost $newsPost): Response
    {
        abort_unless($newsPost->status?->slug === 'published', 404);

        $news = $this->mapNewsPost($newsPost);

        return Inertia::render('News/Show', [
            'news' => $news,
            'announcements' => $this->buildAnnouncements(),
            'pageMeta' => $this->buildPageMeta(
                title: $news['title'],
                eyebrow: 'News Article',
                description: (string) ($news['excerpt'] ?: $news['title']),
                image: $news['featured_image'] ?? null,
            ),
            'relatedNews' => collect($this->buildNews())
                ->where('id', '!=', $news['id'])
                ->take(4)
                ->values()
                ->all(),
        ]);
    }

    public function gallery(): Response
    {
        $galleryItems = $this->buildGallery();

        return Inertia::render('Gallery', [
            'galleryItems' => $galleryItems,
            'announcements' => $this->buildAnnouncements(),
            'pageMeta' => $this->buildPageMeta(
                title: 'Media Gallery',
                eyebrow: 'Gallery',
                description: 'Browse photos and videos from FEMATA activities and sector events.',
                image: data_get($galleryItems, '0.image_path'),
            ),
            'hero' => [
                'title' => 'Media Gallery',
                'description' => 'A visual archive of people, places, events, and mining-sector moments.',
                'image' => data_get($galleryItems, '0.image_path'),
                'eyebrow' => 'Photos & Media',
            ],
        ]);
    }

    public function documents(): Response
    {
        $documents = $this->buildDocuments();

        return Inertia::render('Documents/Index', [
            'documents' => $documents,
            'announcements' => $this->buildAnnouncements(),
            'pageMeta' => $this->buildPageMeta(
                title: 'Documents',
                eyebrow: 'Public Documents',
                description: 'Access public reports, notices, publications, and downloadable materials.',
            ),
            'hero' => [
                'title' => 'Documents',
                'description' => 'Access official resources, public downloads, and institutional documents.',
                'image' => null,
                'eyebrow' => 'Resources',
            ],
            'documentSummary' => [
                'total' => count($documents),
                'categories' => collect($documents)->pluck('category')->filter()->unique()->values()->all(),
            ],
        ]);
    }

    public function documentSingle(Document $document): Response
    {
        abort_unless($document->status?->slug === 'published' && $document->is_public, 404);

        $mapped = $this->mapDocument($document);

        return Inertia::render('Documents/Show', [
            'document' => $mapped,
            'announcements' => $this->buildAnnouncements(),
            'pageMeta' => $this->buildPageMeta(
                title: $mapped['title'],
                eyebrow: 'Document',
                description: (string) ($mapped['description'] ?: $mapped['title']),
            ),
            'relatedDocuments' => collect($this->buildDocuments())
                ->where('id', '!=', $mapped['id'])
                ->take(4)
                ->values()
                ->all(),
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

    public function contact(): Response
    {
        $contact = SiteSettings::contact();

        return Inertia::render('Contact', [
            'contact' => $contact,
            'announcements' => $this->buildAnnouncements(),
            'pageMeta' => $this->buildPageMeta(
                title: 'Contact',
                eyebrow: 'Get in Touch',
                description: 'Reach out to FEMATA for inquiries, collaboration, and communication.',
            ),
            'hero' => [
                'title' => 'Contact',
                'description' => 'Connect with FEMATA for inquiries, partnerships, and official communication.',
                'image' => null,
                'eyebrow' => 'Contact Us',
            ],
        ]);
    }

    public function announcements(): Response
    {
        $announcements = $this->buildAnnouncements();

        return Inertia::render('Announcements', [
            'announcements' => $announcements,
            'pageMeta' => $this->buildPageMeta(
                title: 'Announcements',
                eyebrow: 'Public Notices',
                description: 'Review active notices, updates, and official announcements.',
            ),
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
                'slug' => 'announcement-' . $announcement->id,
                'priority' => $announcement->priority_level ?? 0,
                'starts_at' => $announcement->starts_at?->toDateString(),
                'ends_at' => $announcement->expires_at?->toDateString(),
                'is_active' => true,
            ])
            ->values()
            ->all();
    }

    private function buildNews(): array
    {
        return NewsPost::query()
            ->with(['status', 'category'])
            ->published()
            ->orderByDesc('is_featured')
            ->orderByDesc('published_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (NewsPost $news) => $this->mapNewsPost($news))
            ->values()
            ->all();
    }

    private function mapNewsPost(NewsPost $news): array
    {
        $image = $this->resolveUrl($news->featured_image);

        return [
            'id' => $news->id,
            'title' => $news->title,
            'slug' => $news->slug,
            'excerpt' => $news->excerpt,
            'body' => $news->content,
            'content' => $news->content,
            'cover_image' => $image,
            'featured_image' => $image,
            'published_at' => $news->published_at?->toDateString(),
            'status' => $news->status?->slug,
            'category' => $news->category?->name,
            'is_featured' => (bool) $news->is_featured,
            'reading_time' => $this->estimateReadingTime($news->content),
        ];
    }

    private function buildLeaders(): array
    {
        return Cache::remember('public_leaders_v2', 3600, function () {
            return Leader::query()
                ->active()
                ->orderBy('rank_order')
                ->orderBy('name')
                ->get()
                ->map(fn (Leader $leader) => [
                    'id' => $leader->id,
                    'name' => $leader->name,
                    'title' => $leader->designation,
                    'designation' => $leader->designation,
                    'administration_level' => $leader->administration_level,
                    'department' => $leader->department,
                    'bio' => $leader->bio,
                    'photo_path' => $this->resolveUrl($leader->image_path),
                    'image_path' => $this->resolveUrl($leader->image_path),
                    'contact_qr_path' => $this->resolveUrl($leader->contact_qr_path),
                    'rank_order' => $leader->rank_order,
                    'initials' => $this->initials($leader->name),
                ])
                ->values()
                ->all();
        });
    }

    private function buildGallery(): array
    {
        $gallery = GalleryItem::query()
            ->with('media')
            ->featuredFirst()
            ->latest()
            ->get()
            ->map(fn (GalleryItem $item) => [
                'id' => $item->id,
                'title' => $item->title ?? $item->media?->title ?? $item->media?->file_name,
                'slug' => 'gallery-' . $item->id,
                'type' => 'image',
                'description' => $item->caption ?? $item->media?->caption,
                'image_path' => $this->resolveUrl($item->media?->file_path),
                'thumbnail' => $this->resolveUrl($item->media?->file_path),
                'youtube_url' => null,
                'is_featured' => (bool) $item->is_featured,
                'published_at' => $item->created_at?->toDateString(),
            ]);

        $videos = VideoPost::query()
            ->with('status')
            ->published()
            ->featured()
            ->orderByDesc('published_at')
            ->limit(12)
            ->get()
            ->map(fn (VideoPost $video) => [
                'id' => 100000 + $video->id,
                'title' => $video->title,
                'slug' => $video->slug,
                'type' => 'youtube',
                'description' => $video->summary ?: $video->description,
                'image_path' => $video->thumbnail,
                'thumbnail' => $video->thumbnail,
                'youtube_url' => $video->youtube_url,
                'is_featured' => (bool) $video->is_featured,
                'published_at' => $video->published_at?->toDateString(),
            ]);

        return $gallery
            ->concat($videos)
            ->sortByDesc(fn (array $item) => [
                $item['is_featured'] ? 1 : 0,
                $item['published_at'] ?? '',
            ])
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
            ->values()
            ->all();
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

    private function buildImageGallery(int $limit = 6): array
    {
        return GalleryItem::query()
            ->with('media')
            ->featuredFirst()
            ->latest()
            ->limit($limit)
            ->get()
            ->map(fn (GalleryItem $item) => $this->resolveUrl($item->media?->file_path))
            ->filter()
            ->values()
            ->all();
    }

    private function buildPageMeta(
        string $title,
        string $eyebrow,
        string $description,
        ?string $image = null
    ): array {
        return [
            'title' => $title,
            'eyebrow' => $eyebrow,
            'description' => $description,
            'image' => $image,
        ];
    }

    private function estimateReadingTime(?string $content): int
    {
        $words = str_word_count(strip_tags((string) $content));

        return max(1, (int) ceil($words / 200));
    }

    private function initials(?string $name): string
    {
        $parts = collect(explode(' ', (string) $name))
            ->filter()
            ->take(2)
            ->map(fn (string $part) => strtoupper(substr($part, 0, 1)));

        return $parts->implode('');
    }

    private function resolveUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        return Storage::url($path);
    }
}
