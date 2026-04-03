<?php

namespace App\Http\Controllers;

use App\Mail\ContactFormMessage;
use App\Models\Announcement;
use App\Models\Advert;
use App\Models\Association;
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
use Illuminate\Support\Facades\Mail;
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
        $associations = $this->buildAssociations();

        return Inertia::render('Home', [
            'announcements' => $announcements,
            'news' => $news,
            'leaders' => $leaders,
            'documents' => $documents,
            'galleryItems' => $galleryItems,
            'associations' => $associations,
            'adverts' => $this->buildAdvertSlots(Advert::PAGE_HOME),
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
                'mission' => data_get($siteAbout, 'mission', ''),
                'vision' => data_get($siteAbout, 'vision', ''),
                'values' => data_get($siteAbout, 'values', ''),
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

    public function associations(): Response
    {
        $associations = $this->buildAssociations();

        return Inertia::render('Associations/Index', [
            'associations' => $associations,
            'adverts' => $this->buildAdvertSlots(Advert::PAGE_ASSOCIATIONS),
            'announcements' => $this->buildAnnouncements(),
            'pageMeta' => $this->buildPageMeta(
                title: 'Associations Directory',
                eyebrow: 'Association Network',
                description: 'Explore active FEMATA member associations, sector groups, their regional coverage, and their public profiles.',
                image: data_get($associations, '0.hero_image'),
            ),
        ]);
    }

    public function associationSingle(Association $association): Response
    {
        return $this->renderAssociationProfile($association);
    }

    public function associationPage(Association $association, string $page): Response
    {
        return $this->renderAssociationProfile($association, $page);
    }

    private function renderAssociationProfile(Association $association, ?string $requestedPage = null): Response
    {
        abort_unless($association->is_active, 404);

        $association->load(['documents.status', 'documents.category', 'associationType']);
        $mapped = $this->mapAssociation($association, true);
        $currentPage = $this->resolveAssociationPage($mapped['profile_pages'] ?? [], $requestedPage);

        abort_unless($currentPage !== null, 404);

        $mapped['current_page'] = $currentPage;
        $mapped['profile_pages'] = collect($mapped['profile_pages'] ?? [])
            ->where('visible', true)
            ->values()
            ->all();
        $pageDescription = match ($currentPage['key']) {
            'home' => (string) ($mapped['homepage_intro'] ?: $currentPage['intro'] ?: $mapped['description'] ?: $mapped['about_body'] ?: $mapped['name']),
            'about' => (string) ($mapped['about_body'] ?: $currentPage['intro'] ?: $mapped['description'] ?: $mapped['name']),
            default => (string) ($currentPage['intro'] ?: $mapped['description'] ?: $mapped['about_body'] ?: $mapped['name']),
        };

        return Inertia::render('Associations/Show', [
            'association' => $mapped,
            'adverts' => $this->buildAdvertSlots($this->associationAdvertPageKey($currentPage['key']), $association),
            'announcements' => $this->buildAnnouncements(),
            'pageMeta' => $this->buildPageMeta(
                title: $currentPage['key'] === 'home'
                    ? $mapped['name']
                    : "{$mapped['name']} | {$currentPage['label']}",
                eyebrow: 'Association Profile',
                description: $pageDescription,
                image: $mapped['hero_image'] ?: $mapped['logo_path'],
            ),
        ]);
    }

    public function news(): Response
    {
        $news = $this->buildNews();

        return Inertia::render('News/Archive', [
            'news' => $news,
            'adverts' => $this->buildAdvertSlots(Advert::PAGE_NEWS),
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
            'newsCategories' => collect($news)->pluck('category')->filter()->unique()->values()->all(),
        ]);
    }

    public function newsSingle(NewsPost $newsPost): Response
    {
        abort_unless($newsPost->status?->slug === 'published', 404);

        $news = $this->mapNewsPost($newsPost);

        return Inertia::render('News/Index', [
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
            'adverts' => $this->buildAdvertSlots(Advert::PAGE_GALLERY),
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
            'adverts' => $this->buildAdvertSlots(Advert::PAGE_DOCUMENTS),
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
            'adverts' => $this->buildAdvertSlots(Advert::PAGE_CONTACT),
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

    public function submitContact(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $contact = SiteSettings::contact();
        $recipient = data_get($contact, 'email', config('mail.from.address'));
        Mail::to($recipient)->send(new ContactFormMessage($validated));

        return back()->with('success', 'Thanks for reaching out. We will respond shortly.');
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
        $publishedAt = $news->published_at;
        $updatedAt = $news->updated_at;

        return [
            'id' => $news->id,
            'title' => $news->title,
            'slug' => $news->slug,
            'excerpt' => $news->excerpt,
            'body' => $news->content,
            'content' => $news->content,
            'cover_image' => $image,
            'featured_image' => $image,
            'published_at' => $publishedAt?->toDateString(),
            'updated_at' => $updatedAt?->toDateString(),
            'status' => $news->status?->slug,
            'category' => $news->category?->name,
            'is_featured' => (bool) $news->is_featured,
            'is_breaking' => (bool) ($news->is_featured && $publishedAt?->greaterThanOrEqualTo(now()->subDays(7))),
            'reading_time' => $this->estimateReadingTime($news->content),
        ];
    }

    private function buildLeaders(): array
    {
        return Cache::remember('public_leaders_v3', 3600, function () {
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
                'event_name' => $item->event_name,
                'event_date' => $item->event_date?->toDateString(),
                'published_at' => $item->created_at?->toDateString(),
            ]);

        $videos = VideoPost::query()
            ->with(['status', 'category'])
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
                'event_name' => $video->category?->name ?: 'FEMATA Online TV',
                'event_date' => $video->published_at?->toDateString(),
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

    private function buildAssociations(): array
    {
        return Association::query()
            ->with(['documents.status', 'documents.category', 'associationType'])
            ->active()
            ->get()
            ->map(fn (Association $association) => $this->mapAssociation($association))
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

    private function mapAssociation(Association $association, bool $withDocuments = true): array
    {
        $regions = collect($association->regions ?? [])
            ->filter()
            ->values()
            ->all();

        if ($regions === [] && $association->region) {
            $regions = [$association->region];
        }

        $leaders = collect($association->leaders ?? [])
            ->filter(fn ($item) => filled(data_get($item, 'name')))
            ->map(fn ($item) => [
                'name' => data_get($item, 'name'),
                'group' => Association::normalizeLeaderGroup(
                    data_get($item, 'group'),
                    data_get($item, 'title'),
                ),
                'title' => data_get($item, 'title'),
                'bio' => data_get($item, 'bio'),
                'photo_path' => $this->resolveUrl(data_get($item, 'photo_path')),
                'email' => data_get($item, 'email'),
                'phone' => data_get($item, 'phone'),
                'contact_qr_path' => $this->resolveUrl(data_get($item, 'contact_qr_path')),
            ])
            ->values()
            ->all();

        if ($leaders === []) {
            $leaders = collect([
                $association->chairperson_name ? [
                    'name' => $association->chairperson_name,
                    'group' => 'management',
                    'title' => 'Chairperson',
                    'bio' => null,
                    'photo_path' => null,
                    'email' => null,
                    'phone' => null,
                    'contact_qr_path' => null,
                ] : null,
                $association->secretary_name ? [
                    'name' => $association->secretary_name,
                    'group' => 'secretariat',
                    'title' => 'Secretary',
                    'bio' => null,
                    'photo_path' => null,
                    'email' => null,
                    'phone' => null,
                    'contact_qr_path' => null,
                ] : null,
            ])->filter()->values()->all();
        }

        $profilePages = Association::normalizeProfilePages($association->profile_pages, $association->name);
        $socialLinks = collect(
            Association::normalizeSocialLinks(
                $association->social_links,
                $association->website,
                $association->rema_website_url,
            ),
        )
            ->filter(fn ($item) => filled(data_get($item, 'url')))
            ->values()
            ->all();

        return [
            'id' => $association->id,
            'name' => $association->name,
            'slug' => $association->slug,
            'association_type_id' => $association->association_type_id,
            'association_type' => $association->associationType
                ? [
                    'id' => $association->associationType->id,
                    'name' => $association->associationType->name,
                    'slug' => $association->associationType->slug,
                    'description' => $association->associationType->description,
                    'is_active' => $association->associationType->is_active,
                ]
                : null,
            'region' => $association->region,
            'regions' => $regions,
            'district' => $association->district,
            'address' => $association->address,
            'postal_address' => $association->postal_address,
            'phone' => $association->phone,
            'email' => $association->email,
            'website' => $association->website,
            'logo_path' => $this->resolveUrl($association->logo_path),
            'hero_image' => $this->resolveUrl($association->hero_image),
            'description' => $association->description,
            'homepage_title' => $association->homepage_title ?: $association->name,
            'homepage_intro' => $association->homepage_intro ?: $association->description,
            'mission' => $association->mission,
            'vision' => $association->vision,
            'gender_commitment' => $association->gender_commitment,
            'esg_commitment' => $association->esg_commitment,
            'about_title' => $association->about_title ?: 'About '.$association->name,
            'about_body' => $association->about_body ?: $association->description,
            'focus_areas' => collect(preg_split('/\r\n|\r|\n/', (string) $association->focus_areas) ?: [])
                ->map(fn ($line) => trim((string) $line))
                ->filter()
                ->values()
                ->all(),
            'highlights' => collect($association->highlights ?? [])
                ->filter(fn ($item) => filled(data_get($item, 'title')) || filled(data_get($item, 'text')))
                ->values()
                ->all(),
            'leaders' => $leaders,
            'gallery' => collect($association->gallery ?? [])
                ->filter(fn ($item) => filled(data_get($item, 'image_path')))
                ->map(fn ($item) => [
                    'image_path' => $this->resolveUrl(data_get($item, 'image_path')),
                    'caption' => data_get($item, 'caption'),
                    'event_title' => data_get($item, 'event_title'),
                    'event_date' => data_get($item, 'event_date'),
                ])
                ->values()
                ->all(),
            'chairperson_name' => $association->chairperson_name,
            'secretary_name' => $association->secretary_name,
            'contact_title' => $association->contact_title ?: "Contact {$association->name}",
            'contact_body' => $association->contact_body ?: 'Reach the association through its official address, phone, email, and approved digital channels.',
            'profile_pages' => collect($profilePages)
                ->map(fn ($page) => [
                    ...$page,
                    'href' => $page['key'] === 'home'
                        ? route('associations.show', $association)
                        : route('associations.page', ['association' => $association, 'page' => $page['slug']]),
                ])
                ->values()
                ->all(),
            'social_links' => $socialLinks,
            'is_active' => $association->is_active,
            'documents' => $withDocuments
                ? $association->documents->map(fn (Document $document) => $this->mapDocument($document))->values()->all()
                : [],
        ];
    }

    private function resolveAssociationPage(array $pages, ?string $requestedPage = null): ?array
    {
        $visiblePages = collect($pages)->where('visible', true)->values();

        if ($visiblePages->isEmpty()) {
            return null;
        }

        $requested = trim((string) $requestedPage);

        if ($requested === '' || $requested === 'home') {
            return $visiblePages->firstWhere('key', 'home') ?? $visiblePages->first();
        }

        return $visiblePages->first(
            fn ($page) => data_get($page, 'slug') === $requested || data_get($page, 'key') === $requested,
        );
    }

    private function buildAdvertSlots(string $pageKey, ?Association $association = null): array
    {
        return Advert::query()
            ->with(['association:id,name', 'associationType:id,name'])
            ->active()
            ->where('page_key', $pageKey)
            ->get()
            ->filter(fn (Advert $advert) => $this->advertMatchesContext($advert, $association))
            ->groupBy(fn (Advert $advert) => (string) $advert->slot_number)
            ->map(fn ($items) => $items
                ->map(fn (Advert $advert) => $this->mapAdvert($advert))
                ->values()
                ->all())
            ->all();
    }

    private function advertMatchesContext(Advert $advert, ?Association $association = null): bool
    {
        return match ($advert->placement_scope) {
            Advert::SCOPE_NATIONAL => true,
            Advert::SCOPE_ASSOCIATION => $association !== null
                && $advert->association_id === $association->id,
            Advert::SCOPE_ASSOCIATION_TYPE => $association !== null
                && $association->association_type_id !== null
                && $advert->association_type_id === $association->association_type_id,
            Advert::SCOPE_REGION => $association !== null
                && filled($advert->region)
                && in_array($advert->region, $association->regions ?? [$association->region], true),
            default => false,
        };
    }

    private function mapAdvert(Advert $advert): array
    {
        return [
            'id' => $advert->id,
            'title' => $advert->title,
            'slug' => $advert->slug,
            'media_type' => $advert->media_type,
            'asset_url' => $advert->asset_url,
            'poster_url' => $advert->poster_url,
            'headline' => $advert->headline,
            'body' => $advert->body,
            'cta_label' => $advert->cta_label,
            'cta_url' => $advert->cta_url,
            'page_key' => $advert->page_key,
            'page_label' => Advert::pageOptions()[$advert->page_key] ?? $advert->page_key,
            'slot_number' => $advert->slot_number,
            'placement_scope' => $advert->placement_scope,
            'placement_label' => Advert::placementScopes()[$advert->placement_scope] ?? $advert->placement_scope,
            'association_id' => $advert->association_id,
            'association_type_id' => $advert->association_type_id,
            'association_name' => $advert->association?->name,
            'association_type_name' => $advert->associationType?->name,
            'region' => $advert->region,
            'display_order' => $advert->display_order,
            'duration_seconds' => $advert->duration_seconds,
            'is_active' => $advert->is_active,
        ];
    }

    private function associationAdvertPageKey(string $pageKey): string
    {
        return match ($pageKey) {
            'about' => Advert::PAGE_ASSOCIATION_ABOUT,
            'leadership' => Advert::PAGE_ASSOCIATION_LEADERSHIP,
            'documents' => Advert::PAGE_ASSOCIATION_DOCUMENTS,
            'gallery' => Advert::PAGE_ASSOCIATION_GALLERY,
            'contact' => Advert::PAGE_ASSOCIATION_CONTACT,
            default => Advert::PAGE_ASSOCIATION_HOME,
        };
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
