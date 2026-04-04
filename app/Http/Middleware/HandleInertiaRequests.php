<?php

namespace App\Http\Middleware;

use App\Models\Announcement;
use App\Support\SiteSettings;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'appName' => config('app.name', 'FEMATA'),
            'appVersion' => config('app.version', 'v0.3.0'),
            'appReleaseDate' => config('app.release_date', '2026-03-21'),
            'auth' => [
                'user' => $request->user()
                    ? [
                        'id' => $request->user()->id,
                        'name' => $request->user()->name,
                        'email' => $request->user()->email,
                        'is_admin' => $request->user()->hasAdminAccess(),
                        'roles' => $request->user()->getRoleNames()->values()->all(),
                        'admin_sections' => $request->user()->adminSections()->pluck('slug')->all(),
                        'managed_associations' => $request->user()->associations()
                            ->get(['associations.id', 'associations.name', 'associations.slug'])
                            ->map(fn ($association) => [
                                'id' => $association->id,
                                'name' => $association->name,
                                'slug' => $association->slug,
                            ])
                            ->all(),
                    ]
                    : null,
            ],
            'announcementTicker' => fn () => Announcement::query()
                ->active()
                ->priorityOrdered()
                ->limit(3)
                ->get(['id', 'title', 'body', 'priority_level', 'starts_at', 'expires_at'])
                ->map(fn (Announcement $announcement) => [
                    'id' => $announcement->id,
                    'title' => $announcement->title,
                    'slug' => 'announcement-'.$announcement->id,
                    'body' => $announcement->body,
                    'priority' => $announcement->priority_level ?? 0,
                    'starts_at' => $announcement->starts_at,
                    'ends_at' => $announcement->expires_at,
                ]),
            'siteBranding' => fn () => SiteSettings::branding(),
            'siteFooter' => fn () => SiteSettings::footer(),
            'siteContact' => fn () => SiteSettings::contact(),
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
        ]);
    }
}
