<?php

namespace Tests\Feature;

use App\Models\Association;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AssociationPagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_association_directory_and_profile_pages_render(): void
    {
        $this->seed(DatabaseSeeder::class);

        $directoryResponse = $this->get('/associations');
        $directoryResponse
            ->assertOk()
            ->assertSee('Geita Miners Association');

        $profileResponse = $this->get('/associations/geita-miners-association');
        $profileResponse
            ->assertOk()
            ->assertSee('A Lake Zone association with practical field coordination');

        $aboutResponse = $this->get('/associations/geita-miners-association/about');
        $aboutResponse
            ->assertOk()
            ->assertSee('A Lake Zone association with practical field coordination');
    }

    public function test_hidden_association_subpages_return_not_found(): void
    {
        $this->seed(DatabaseSeeder::class);

        $association = Association::query()->where('slug', 'geita-miners-association')->firstOrFail();
        $profilePages = collect($association->profile_pages ?: Association::defaultProfilePages($association->name))
            ->map(function (array $page): array {
                if (($page['key'] ?? null) === 'gallery') {
                    $page['visible'] = false;
                }

                return $page;
            })
            ->values()
            ->all();

        $association->update(['profile_pages' => $profilePages]);

        $this->get('/associations/geita-miners-association/gallery')->assertNotFound();
    }
}
