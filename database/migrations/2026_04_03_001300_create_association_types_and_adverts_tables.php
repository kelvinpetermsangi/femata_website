<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('association_types', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        Schema::table('associations', function (Blueprint $table): void {
            $table->foreignId('association_type_id')
                ->nullable()
                ->after('name')
                ->constrained('association_types')
                ->nullOnDelete();
            $table->text('mission')->nullable()->after('homepage_intro');
            $table->text('vision')->nullable()->after('mission');
            $table->text('gender_commitment')->nullable()->after('vision');
            $table->text('esg_commitment')->nullable()->after('gender_commitment');
        });

        Schema::create('adverts', function (Blueprint $table): void {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('media_type', 20);
            $table->string('asset_url', 2048);
            $table->string('poster_url', 2048)->nullable();
            $table->string('headline')->nullable();
            $table->text('body')->nullable();
            $table->string('cta_label')->nullable();
            $table->string('cta_url')->nullable();
            $table->string('page_key', 80)->index();
            $table->unsignedInteger('slot_number')->default(1)->index();
            $table->string('placement_scope', 40)->default('national')->index();
            $table->foreignId('association_id')->nullable()->constrained('associations')->nullOnDelete();
            $table->foreignId('association_type_id')->nullable()->constrained('association_types')->nullOnDelete();
            $table->string('region')->nullable()->index();
            $table->unsignedInteger('display_order')->default(0);
            $table->unsignedInteger('duration_seconds')->default(6);
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('adverts');

        Schema::table('associations', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('association_type_id');
            $table->dropColumn([
                'mission',
                'vision',
                'gender_commitment',
                'esg_commitment',
            ]);
        });

        Schema::dropIfExists('association_types');
    }
};
