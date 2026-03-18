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
            'auth' => [
                'user' => $request->user()
                    ? [
                        'id' => $request->user()->id,
                        'name' => $request->user()->name,
                        'email' => $request->user()->email,
                        'is_admin' => $request->user()->is_admin,
                    ]
                    : null,
            ],
            'announcementTicker' => fn () => Announcement::query()
                ->active()
                ->priorityOrdered()
                ->limit(3)
                ->get(['id', 'title', 'slug', 'body', 'priority', 'starts_at', 'ends_at']),
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
