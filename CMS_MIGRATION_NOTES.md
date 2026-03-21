# FEMATA CMS Migration Notes

## Architecture shift

- Database target changes from SQLite-first defaults to MySQL 8+ defaults in `.env.example` and `config/database.php`.
- Roles and permissions now align with Spatie table conventions instead of the old single `users.is_admin` flag.
- Activity logging now aligns with Spatie's `activity_log` table structure.
- Content workflow is centralized through `content_statuses` and shared workflow ownership fields.
- Tagging is centralized through `tags` and `taggables` with an enforced morph map.

## Legacy to new schema mapping

- `users`
  - preserved
  - existing `is_admin` remains for compatibility, but runtime authorization now prefers roles/permissions plus section assignments
- `announcements`
  - preserved as `announcements`
  - `ends_at` becomes `expires_at`
  - `priority` becomes `priority_level`
- `news_posts`
  - preserved as `news_posts`
  - `body` becomes `content`
  - `cover_image` becomes `featured_image`
  - category, tags, workflow, SEO, and soft deletes added
- `document_files`
  - replaced by `documents`
  - string `category` becomes relational `category_id`
  - file metadata, workflow, download metrics, and public `public_id` added
- `gallery_items`
  - rebuilt as gallery records pointing to `media_library`
  - image file paths move into reusable media records
  - YouTube content moves to `video_posts`
- `leaders`
  - preserved as `leaders`
  - `title` becomes `designation`
  - `sort_order` becomes `rank_order`
  - contact fields added
- `site_settings`
  - preserved as `site_settings`
  - `key` becomes `setting_key`
  - `value` becomes `setting_value`
  - values are now stored as JSON-encoded long text

## Public route compatibility

- Public news slugs remain stable.
- Public document slugs remain stable.
- A tracked download endpoint is added at `/documents/{document}/download`.
- Public controllers continue shaping payloads close to the old frontend contracts so the visible UI stays stable.

## Admin compatibility

- Existing admin pages for news, documents, leaders, announcements, and settings are preserved with compatibility payloads.
- Announcements and gallery admin actions now use IDs server-side.
- Gallery management is now image-first; YouTube/video publishing belongs in the new `video_posts` module.
- Admin authorization is now policy-backed per module instead of relying only on controller-level permission checks.
- News and document admin forms now expose workflow status selection so they can work with the stricter editorial state model.

## Authorization and workflow hardening

- Dedicated Laravel policies now protect announcements, news, videos, documents, pages, press briefings, leaders, gallery/media, associations, and site settings.
- Publishable modules now use a shared workflow manager that validates allowed transitions and stamps `submitted_*`, `reviewed_*`, `approved_*`, and `published_*` fields centrally.
- Server-side workflow transitions are now constrained to the editorial path:
  - `draft -> pending_review`
  - `pending_review -> reviewed|rejected|draft`
  - `reviewed -> approved|rejected|pending_review`
  - `approved -> published|archived|reviewed`
  - `published -> archived`
  - `archived -> draft`
  - `rejected -> draft|pending_review|archived`

## Breaking changes to account for

- Fresh installs should run against MySQL, not SQLite.
- Old migrations were replaced with new normalized CMS migrations.
- Running legacy data against the new schema requires reseeding or a one-time production data migration script.
- Package installation and actual migration execution still require `php` and `composer`, which were not available in this workspace session.

## Recommended next execution steps

1. Install PHP 8.3+ and Composer on the target machine.
2. Run `composer install`.
3. Run `php artisan migrate:fresh --seed`.
4. Review admin pages for new modules not yet surfaced in UI, especially videos, pages, associations, and press briefings.
