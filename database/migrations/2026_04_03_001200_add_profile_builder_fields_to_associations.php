<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('associations', function (Blueprint $table): void {
            $table->string('homepage_title')->nullable()->after('description');
            $table->text('homepage_intro')->nullable()->after('homepage_title');
            $table->string('contact_title')->nullable()->after('secretary_name');
            $table->text('contact_body')->nullable()->after('contact_title');
            $table->json('profile_pages')->nullable()->after('gallery');
            $table->json('social_links')->nullable()->after('profile_pages');
        });
    }

    public function down(): void
    {
        Schema::table('associations', function (Blueprint $table): void {
            $table->dropColumn([
                'homepage_title',
                'homepage_intro',
                'contact_title',
                'contact_body',
                'profile_pages',
                'social_links',
            ]);
        });
    }
};
