<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media_categories', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::create('media_library', function (Blueprint $table): void {
            $table->id();
            $table->string('title')->nullable();
            $table->string('file_name');
            $table->string('file_path', 2048);
            $table->string('file_type')->nullable();
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
            $table->string('alt_text')->nullable();
            $table->text('caption')->nullable();
            $table->foreignId('category_id')->nullable()->constrained('media_categories')->nullOnDelete();
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('gallery_items', function (Blueprint $table): void {
            $table->id();
            $table->string('title')->nullable();
            $table->text('caption')->nullable();
            $table->foreignId('media_id')->constrained('media_library')->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained('media_categories')->nullOnDelete();
            $table->unsignedInteger('display_order')->default(0)->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gallery_items');
        Schema::dropIfExists('media_library');
        Schema::dropIfExists('media_categories');
    }
};
