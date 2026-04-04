<?php

namespace Tests\Feature;

use App\Models\GalleryItem;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class PublicDocumentsAndGalleryTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_documents_pages_and_download_route_render(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->get('/documents')
            ->assertOk()
            ->assertSee('FEMATA Strategic Outlook 2026')
            ->assertSee('FEM-LIB-2026-001');

        $this->get('/documents/strategic-outlook-2026')
            ->assertOk()
            ->assertSee('Strategic directions, institutional priorities, and key delivery themes for the 2026 operating cycle.')
            ->assertSee('Joseph M. Bendera');

        $this->get('/documents/strategic-outlook-2026/download')
            ->assertRedirect('/assets/documents/strategic-outlook-2026.pdf');
    }

    public function test_public_document_comments_can_be_submitted(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->post('/documents/strategic-outlook-2026/comments', [
            'name' => 'Comment Tester',
            'email' => 'commenter@example.com',
            'comment' => 'This publication reads much more clearly in the new library format.',
        ])
            ->assertRedirect()
            ->assertSessionHas('success');

        $this->get('/documents/strategic-outlook-2026')
            ->assertOk()
            ->assertSee('Comment Tester')
            ->assertSee('This publication reads much more clearly in the new library format.');
    }

    public function test_gallery_event_story_route_renders_grouped_event_media(): void
    {
        $this->seed(DatabaseSeeder::class);

        $galleryItem = GalleryItem::query()
            ->whereNotNull('event_name')
            ->whereNotNull('event_date')
            ->firstOrFail();

        $slug = Str::slug((string) $galleryItem->event_name).'-'.$galleryItem->event_date?->format('Ymd');

        $this->get("/gallery/events/{$slug}")
            ->assertOk()
            ->assertSee((string) $galleryItem->event_name);
    }
}
