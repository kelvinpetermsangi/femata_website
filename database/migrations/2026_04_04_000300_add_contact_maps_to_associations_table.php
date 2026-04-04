<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('associations', function (Blueprint $table): void {
            $table->string('map_embed_url', 2048)->nullable()->after('contact_body');
            $table->string('google_map_url', 2048)->nullable()->after('map_embed_url');
            $table->string('apple_map_url', 2048)->nullable()->after('google_map_url');
        });
    }

    public function down(): void
    {
        Schema::table('associations', function (Blueprint $table): void {
            $table->dropColumn(['map_embed_url', 'google_map_url', 'apple_map_url']);
        });
    }
};
