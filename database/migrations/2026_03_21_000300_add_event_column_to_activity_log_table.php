<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('activity_log') || Schema::hasColumn('activity_log', 'event')) {
            return;
        }

        Schema::table('activity_log', function (Blueprint $table): void {
            $table->string('event')->nullable();
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('activity_log') || ! Schema::hasColumn('activity_log', 'event')) {
            return;
        }

        Schema::table('activity_log', function (Blueprint $table): void {
            $table->dropColumn('event');
        });
    }
};
