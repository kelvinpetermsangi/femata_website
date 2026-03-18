<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('gallery_items', function (Blueprint $table): void {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->enum('type', ['image', 'youtube']);
            $table->string('image_path')->nullable();
            $table->string('youtube_url')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_featured')->default(false)->index();
            $table->timestamp('published_at')->nullable()->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gallery_items');
    }
};
