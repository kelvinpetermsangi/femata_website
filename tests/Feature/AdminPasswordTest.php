<?php

namespace Tests\Feature;

use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminPasswordTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_change_password_from_settings(): void
    {
        $this->seed(DatabaseSeeder::class);

        $user = \App\Models\User::query()->where('email', 'admin@femata.or.tz')->firstOrFail();

        $response = $this
            ->actingAs($user)
            ->put('/admin/settings/password', [
                'current_password' => 'password',
                'password' => 'new-secure-password',
                'password_confirmation' => 'new-secure-password',
            ]);

        $response
            ->assertRedirect('/admin/settings')
            ->assertSessionHas('success');

        $this->assertTrue(Hash::check('new-secure-password', $user->fresh()->password));
    }
}
