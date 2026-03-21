<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('associations', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('region')->nullable()->index();
            $table->string('district')->nullable();
            $table->string('address')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->string('logo_path', 2048)->nullable();
            $table->text('description')->nullable();
            $table->string('chairperson_name')->nullable();
            $table->string('secretary_name')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        Schema::create('association_documents', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('association_id')->constrained('associations')->cascadeOnDelete();
            $table->foreignId('document_id')->constrained('documents')->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['association_id', 'document_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('association_documents');
        Schema::dropIfExists('associations');
    }
};
