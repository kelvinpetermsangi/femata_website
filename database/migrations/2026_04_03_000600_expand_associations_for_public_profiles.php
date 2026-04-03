<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('associations', function (Blueprint $table): void {
            $table->json('regions')->nullable()->after('region');
            $table->string('postal_address')->nullable()->after('address');
            $table->string('rema_website_url')->nullable()->after('website');
            $table->string('hero_image', 2048)->nullable()->after('logo_path');
            $table->string('about_title')->nullable()->after('description');
            $table->text('about_body')->nullable()->after('about_title');
            $table->text('focus_areas')->nullable()->after('about_body');
            $table->json('highlights')->nullable()->after('focus_areas');
            $table->json('leaders')->nullable()->after('highlights');
            $table->json('gallery')->nullable()->after('leaders');
        });
    }

    public function down(): void
    {
        Schema::table('associations', function (Blueprint $table): void {
            $table->dropColumn([
                'regions',
                'postal_address',
                'rema_website_url',
                'hero_image',
                'about_title',
                'about_body',
                'focus_areas',
                'highlights',
                'leaders',
                'gallery',
            ]);
        });
    }
};
