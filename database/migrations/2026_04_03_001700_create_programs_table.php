<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('programs', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('tagline')->nullable();
            $table->text('summary')->nullable();
            $table->string('hero_image')->nullable();
            $table->string('home_title')->nullable();
            $table->text('home_intro')->nullable();
            $table->longText('home_body')->nullable();
            $table->string('about_title')->nullable();
            $table->longText('about_body')->nullable();
            $table->text('team_intro')->nullable();
            $table->text('years_intro')->nullable();
            $table->text('current_year_intro')->nullable();
            $table->json('highlights')->nullable();
            $table->json('metrics')->nullable();
            $table->json('team')->nullable();
            $table->json('years')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('programs');
    }
};
