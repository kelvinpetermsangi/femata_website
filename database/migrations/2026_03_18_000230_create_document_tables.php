<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_categories', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('document_categories')->nullOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->unsignedInteger('sort_order')->default(0)->index();
            $table->timestamps();
        });

        Schema::create('documents', function (Blueprint $table): void {
            $table->id();
            $table->string('public_id', 26)->nullable()->unique();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('file_path', 2048);
            $table->string('thumbnail_path', 2048)->nullable();
            $table->string('file_extension', 20)->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
            $table->string('document_type')->nullable()->index();
            $table->foreignId('category_id')->nullable()->constrained('document_categories')->nullOnDelete();
            $table->unsignedSmallInteger('year')->nullable()->index();
            $table->string('author_source')->nullable();
            $table->string('source_organization')->nullable();
            $table->unsignedBigInteger('download_count')->default(0);
            $table->boolean('is_featured')->default(false)->index();
            $table->boolean('is_public')->default(true)->index();
            $table->foreignId('status_id')->constrained('content_statuses');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('submitted_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('published_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('published_at')->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['category_id', 'status_id']);
            $table->index(['status_id', 'published_at']);
        });

        Schema::create('document_download_logs', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('document_id')->constrained('documents')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('ip_address', 45)->nullable();
            $table->timestamp('downloaded_at')->index();
            $table->index(['document_id', 'downloaded_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_download_logs');
        Schema::dropIfExists('documents');
        Schema::dropIfExists('document_categories');
    }
};
