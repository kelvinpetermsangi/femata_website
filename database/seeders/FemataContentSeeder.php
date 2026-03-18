<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\DocumentFile;
use App\Models\GalleryItem;
use App\Models\Leader;
use App\Models\NewsPost;
use App\Models\SiteSetting;
use App\Support\SiteSettings;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class FemataContentSeeder extends Seeder
{
    public function run(): void
    {
        Announcement::create([
            'title' => 'FEMATA Annual Stakeholder Meeting scheduled',
            'slug' => 'femata-annual-stakeholder-meeting',
            'body' => 'An invitation to senior members for the annual convening, plus agenda highlights.',
            'priority' => 9,
            'starts_at' => Carbon::now()->subDay(),
            'ends_at' => Carbon::now()->addMonth(),
            'is_active' => true,
        ]);

        NewsPost::create([
            'title' => 'FEMATA champions new responsible mining framework',
            'slug' => 'responsible-mining-framework',
            'excerpt' => 'Framework that binds FEMATA members to ESG commitments was endorsed by Council.',
            'body' => 'FEMATA’s leadership team introduced the Responsible Mining Framework to uplift governance and accountability...',
            'cover_image' => 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
            'published_at' => Carbon::now()->subDays(2),
            'is_published' => true,
        ]);

        NewsPost::create([
            'title' => 'FEMATA market analytics hub debuts digital report',
            'slug' => 'market-analytics-report',
            'excerpt' => 'New insights into commodity pipelines and fiscal frameworks featured in the quarterly report.',
            'body' => 'The analytics hub curates exports, pricing, and regulatory intelligence for FEMATA members...',
            'cover_image' => 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
            'published_at' => Carbon::now()->subDays(10),
            'is_published' => true,
        ]);

        Leader::create([
            'name' => 'Dr. Amina M. Kileo',
            'title' => 'Chairperson',
            'bio' => 'A governance expert and trusted voice for responsible extractive stewardship.',
            'photo_path' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80',
            'sort_order' => 0,
            'is_active' => true,
        ]);

        Leader::create([
            'name' => 'Mr. Jacob P. Mwenda',
            'title' => 'Executive Director',
            'bio' => 'Leads FEMATA’s operations with a focus on partnerships and institutional trust.',
            'photo_path' => 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        GalleryItem::create([
            'title' => 'FEMATA leadership forum',
            'slug' => 'leadership-forum',
            'type' => 'image',
            'image_path' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
            'description' => 'Recording the institution’s leadership forum in Dar es Salaam.',
            'is_featured' => true,
            'published_at' => Carbon::now()->subWeeks(3),
        ]);

        GalleryItem::create([
            'title' => 'YouTube address on mining governance',
            'slug' => 'youtube-mining-governance',
            'type' => 'youtube',
            'youtube_url' => 'https://www.youtube.com/watch?v=2g811Eo7K8U',
            'description' => 'Message from FEMATA’s Chairperson on ethical partnerships.',
            'is_featured' => false,
        ]);

        DocumentFile::create([
            'title' => 'FEMATA Strategic Outlook 2026',
            'slug' => 'strategic-outlook-2026',
            'description' => 'Strategic directions and institutional goals.',
            'file_path' => 'documents/femata-strategic-outlook-2026.pdf',
            'file_type' => 'application/pdf',
            'category' => 'Strategy',
            'published_at' => Carbon::now()->subMonth(),
        ]);

        DocumentFile::create([
            'title' => '2025 Annual Report Summary',
            'slug' => '2025-annual-report-summary',
            'description' => 'Executive summary and highlights from the latest annual report.',
            'file_path' => 'documents/femata-annual-report-summary.pdf',
            'file_type' => 'application/pdf',
            'category' => 'Report',
        ]);

        SiteSetting::updateOrCreate(['key' => 'branding'], [
            'value' => SiteSettings::branding(),
        ]);

        SiteSetting::updateOrCreate(['key' => 'home'], [
            'value' => SiteSettings::home(),
        ]);

        SiteSetting::updateOrCreate(['key' => 'about'], [
            'value' => SiteSettings::about(),
        ]);

        SiteSetting::updateOrCreate(['key' => 'contact'], [
            'value' => SiteSettings::contact(),
        ]);

        SiteSetting::updateOrCreate(['key' => 'footer'], [
            'value' => SiteSettings::footer(),
        ]);
    }
}
