<?php

namespace Tests\Feature;

use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProgramPagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_program_directory_and_profile_pages_render(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->get('/programs')
            ->assertOk()
            ->assertSee('Tanzania Mining Exhibition and Conference');

        $this->get('/programs/tanzania-mining-exhibition-conference')
            ->assertOk()
            ->assertSee('TMEC 2026 | Mwanza Edition')
            ->assertSee('A national exhibition and conference platform with regional delivery every year');

        $this->get('/programs/tanzania-mining-exhibition-conference/current-year')
            ->assertOk()
            ->assertSee('TMEC 2026 | Mwanza Edition')
            ->assertSee('Connecting ASM productivity, local content, and finance-ready mining growth');
    }
}
