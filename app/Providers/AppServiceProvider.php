<?php

namespace App\Providers;

use App\Models\Announcement;
use App\Models\Association;
use App\Models\Document;
use App\Models\GalleryItem;
use App\Models\Leader;
use App\Models\MediaLibrary;
use App\Models\NewsPost;
use App\Models\Page;
use App\Models\Program;
use App\Models\PressBriefing;
use App\Models\SiteSetting;
use App\Models\User;
use App\Models\VideoPost;
use App\Policies\AnnouncementPolicy;
use App\Policies\AssociationPolicy;
use App\Policies\DocumentPolicy;
use App\Policies\GalleryItemPolicy;
use App\Policies\LeaderPolicy;
use App\Policies\NewsPostPolicy;
use App\Policies\PagePolicy;
use App\Policies\ProgramPolicy;
use App\Policies\PressBriefingPolicy;
use App\Policies\SiteSettingPolicy;
use App\Policies\VideoPostPolicy;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Relation::enforceMorphMap([
            'announcement' => Announcement::class,
            'association' => Association::class,
            'gallery_item' => GalleryItem::class,
            'leader' => Leader::class,
            'media_library' => MediaLibrary::class,
            'news_post' => NewsPost::class,
            'document' => Document::class,
            'page' => Page::class,
            'program' => Program::class,
            'video_post' => VideoPost::class,
            'press_briefing' => PressBriefing::class,
            'site_setting' => SiteSetting::class,
            'user' => User::class,
        ]);

        Gate::policy(Announcement::class, AnnouncementPolicy::class);
        Gate::policy(Association::class, AssociationPolicy::class);
        Gate::policy(Document::class, DocumentPolicy::class);
        Gate::policy(GalleryItem::class, GalleryItemPolicy::class);
        Gate::policy(Leader::class, LeaderPolicy::class);
        Gate::policy(NewsPost::class, NewsPostPolicy::class);
        Gate::policy(Page::class, PagePolicy::class);
        Gate::policy(Program::class, ProgramPolicy::class);
        Gate::policy(PressBriefing::class, PressBriefingPolicy::class);
        Gate::policy(SiteSetting::class, SiteSettingPolicy::class);
        Gate::policy(VideoPost::class, VideoPostPolicy::class);

        Gate::before(function ($user, string $ability): ?bool {
            if ($user->hasRole('super-admin')) {
                return true;
            }

            return null;
        });
    }
}
