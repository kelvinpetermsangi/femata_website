# FEMATA_WEBSITE

Premium FEMATA institutional web experience built with Laravel, Inertia React, Vite, and Tailwind CSS.

## Local Setup

1. Copy `.env.example` to `.env` and configure database credentials (MySQL recommended).
2. Run `composer install` then `npm install`.
3. Run `php artisan key:generate`.
4. Run `php artisan migrate`.
5. Run `php artisan db:seed` to populate demo content.
6. Run `php artisan storage:link` so uploaded documents resolve via `/storage`.
7. Start the frontend dev server with `npm run dev` and the backend with `php artisan serve` (or combine with `npm run dev -- --host 0.0.0.0` when using Vite hot reload).

## Authentication

- Admin login: `admin@femata.or.tz` / `password`.
- Visit `/admin/login` to sign in, `/dashboard` to check the protected console, and `/admin/*` for content areas.

## Frontend Structure

- `resources/js/app.tsx`: Inertia entrypoint with theme/language providers.
- `resources/js/layouts`: Public and admin layouts.
- `resources/js/pages`: Inertia pages for home, news, documents, gallery, leadership, announcements, contact, login, and admin CRUD views.
- `resources/css/app.css`: Theme-aware Tailwind setup with light/dark/gray palettes and reusable component layers.

## Data & Media

- Tables: `announcements`, `news_posts`, `leaders`, `gallery_items`, `document_files`, `site_settings`.
- Documents store metadata via `DocumentFile` and rely on `storage/app/public/documents/`. Use `Storage::url()` to render/download files.
- Gallery supports both images and YouTube links with dedicated cards.
- Seeders provide sample announcements, news, leaders, gallery items, documents, and site settings.

## Production & Caching Notes

### Laravel optimizations
Run the following during deployment/release:

```bash
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
npm run build
```

### HTTP caching guidance

- **HTML** (`/`, `/news`, `/documents`, etc.): send `Cache-Control: no-cache, must-revalidate` since each visit should reflect fresh announcements, news, and documents.
- **Versioned assets** (built JS/CSS): leverage long-lived caching `Cache-Control: max-age=31536000, immutable` because Vite fingerprints filenames.
- **Documents/images** (stored in `/storage/documents` and `/storage/app/public/*`): use `Cache-Control: public, max-age=86400` with conditional requests (`Last-Modified`/`ETag`) to keep downloads responsive while allowing refreshes when files change.

Ensure `public/storage` is symlinked to `storage/app/public` (via `php artisan storage:link`) so documents/images are accessible and ready for CDN/frontend caching.

## Notes

- This project intentionally keeps dependencies minimal for fast loads: React + Inertia + Tailwind + Vite only.
- Theme selection (light/dark/gray) and locale toggles (English/Swahili) are handled entirely on the client with localStorage persistence.
- Admin skeleton is ready for future CRUD enhancement without forcing a heavy SPA dashboard.
