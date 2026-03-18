<?php

namespace Database\Seeders;

use App\Models\User;
use Database\Seeders\FemataContentSeeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call(FemataContentSeeder::class);

        User::factory()->create([
            'name' => 'FEMATA Admin',
            'email' => 'admin@femata.or.tz',
            'is_admin' => true,
        ]);
    }
}
