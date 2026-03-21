<?php

namespace Database\Seeders;

use App\Models\AdminSection;
use App\Models\Announcement;
use App\Models\ContentStatus;
use App\Models\Document;
use App\Models\DocumentCategory;
use App\Models\GalleryItem;
use App\Models\Leader;
use App\Models\MediaLibrary;
use App\Models\NewsCategory;
use App\Models\NewsPost;
use App\Models\Page;
use App\Models\SiteSetting;
use App\Models\User;
use App\Models\VideoCategory;
use App\Models\VideoPost;
use App\Support\SiteSettings;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class FemataContentSeeder extends Seeder
{
    public function run(): void
    {
        $publishedStatusId = ContentStatus::query()->where('slug', ContentStatus::PUBLISHED)->value('id');

        $admin = User::query()->firstOrCreate(
            ['email' => 'admin@femata.or.tz'],
            [
                'name' => 'FEMATA Admin',
                'password' => 'password',
                'is_admin' => true,
            ],
        );

        $admin->assignRole('super-admin');
        $admin->adminSections()->sync(AdminSection::query()->pluck('id')->all());

        Announcement::query()->updateOrCreate(
            ['title' => 'FEMATA Annual Stakeholder Meeting scheduled'],
            [
                'body' => 'An invitation to senior members for the annual convening, plus agenda highlights.',
                'priority_level' => 9,
                'starts_at' => Carbon::now()->subDay(),
                'expires_at' => Carbon::now()->addMonth(),
                'is_active' => true,
                'created_by' => $admin->id,
                'updated_by' => $admin->id,
            ],
        );

        $newsCategoryId = NewsCategory::query()->where('slug', 'official-statements')->value('id');

        NewsPost::query()->updateOrCreate(
            ['slug' => 'responsible-mining-framework'],
            [
                'title' => 'FEMATA champions new responsible mining framework',
                'excerpt' => 'Framework that binds FEMATA members to ESG commitments was endorsed by Council.',
                'content' => 'FEMATA leadership introduced the Responsible Mining Framework to uplift governance, accountability, and stronger institutional trust across the mining ecosystem.',
                'featured_image' => 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
                'category_id' => $newsCategoryId,
                'status_id' => $publishedStatusId,
                'is_featured' => true,
                'created_by' => $admin->id,
                'updated_by' => $admin->id,
                'published_by' => $admin->id,
                'published_at' => Carbon::now()->subDays(2),
            ],
        );

        $documentCategoryId = DocumentCategory::query()->where('slug', 'strategic-plan')->value('id');

        Document::query()->updateOrCreate(
            ['slug' => 'strategic-outlook-2026'],
            [
                'public_id' => '01J0FEMATASTRATEGIC2026AB',
                'title' => 'FEMATA Strategic Outlook 2026',
                'description' => 'Strategic directions and institutional goals.',
                'file_path' => 'documents/femata-strategic-outlook-2026.pdf',
                'file_extension' => 'pdf',
                'document_type' => 'strategy',
                'category_id' => $documentCategoryId,
                'year' => 2026,
                'is_public' => true,
                'status_id' => $publishedStatusId,
                'created_by' => $admin->id,
                'updated_by' => $admin->id,
                'published_by' => $admin->id,
                'published_at' => Carbon::now()->subMonth(),
            ],
        );

        Leader::query()->updateOrCreate(
            ['name' => 'Dr. Amina M. Kileo'],
            [
                'designation' => 'Chairperson',
                'bio' => 'A governance expert and trusted voice for responsible extractive stewardship.',
                'image_path' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80',
                'rank_order' => 0,
                'is_active' => true,
            ],
        );

        $media = MediaLibrary::query()->updateOrCreate(
            ['file_path' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80'],
            [
                'title' => 'FEMATA leadership forum',
                'file_name' => 'femata-leadership-forum.jpg',
                'file_type' => 'image',
                'caption' => 'Recording the institution\'s leadership forum in Dar es Salaam.',
                'uploaded_by' => $admin->id,
            ],
        );

        GalleryItem::query()->updateOrCreate(
            ['media_id' => $media->id],
            [
                'title' => 'FEMATA leadership forum',
                'caption' => 'Recording the institution\'s leadership forum in Dar es Salaam.',
                'display_order' => 1,
                'is_featured' => true,
                'created_by' => $admin->id,
            ],
        );

        $videoCategoryId = VideoCategory::query()->where('slug', 'chairperson-address')->value('id');

        VideoPost::query()->updateOrCreate(
            ['slug' => 'youtube-mining-governance'],
            [
                'title' => 'YouTube address on mining governance',
                'summary' => 'Message from FEMATA\'s Chairperson on ethical partnerships.',
                'youtube_url' => 'https://www.youtube.com/watch?v=2g811Eo7K8U',
                'youtube_video_id' => '2g811Eo7K8U',
                'thumbnail' => 'https://img.youtube.com/vi/2g811Eo7K8U/hqdefault.jpg',
                'category_id' => $videoCategoryId,
                'status_id' => $publishedStatusId,
                'is_featured' => true,
                'created_by' => $admin->id,
                'updated_by' => $admin->id,
                'published_by' => $admin->id,
                'published_at' => Carbon::now()->subWeeks(2),
            ],
        );

        Page::query()->updateOrCreate(
            ['slug' => 'about'],
            [
                'title' => 'About FEMATA',
                'content' => SiteSettings::about()['body'],
                'status_id' => $publishedStatusId,
                'created_by' => $admin->id,
                'updated_by' => $admin->id,
                'published_by' => $admin->id,
                'published_at' => Carbon::now()->subWeek(),
            ],
        );

        foreach ([
            'branding' => SiteSettings::branding(),
            'home' => SiteSettings::home(),
            'about' => SiteSettings::about(),
            'contact' => SiteSettings::contact(),
            'footer' => SiteSettings::footer(),
        ] as $key => $value) {
            SiteSetting::query()->updateOrCreate(
                ['setting_key' => $key],
                [
                    'setting_value' => json_encode($value, JSON_THROW_ON_ERROR),
                    'group_name' => 'site',
                    'updated_by' => $admin->id,
                ],
            );
        }
    }
}
