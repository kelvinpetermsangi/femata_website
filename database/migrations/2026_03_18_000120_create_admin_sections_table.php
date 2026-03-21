<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admin_sections', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('description')->nullable();
            $table->timestamps();
        });

        Schema::create('user_admin_sections', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('admin_section_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['user_id', 'admin_section_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_admin_sections');
        Schema::dropIfExists('admin_sections');
    }
};
