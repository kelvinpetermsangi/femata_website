<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leaders', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('designation');
            $table->string('department')->nullable();
            $table->unsignedInteger('rank_order')->default(0)->index();
            $table->text('bio')->nullable();
            $table->string('image_path', 2048)->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leaders');
    }
};
