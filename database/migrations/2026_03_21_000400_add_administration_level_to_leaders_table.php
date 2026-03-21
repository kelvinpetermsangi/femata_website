<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('leaders', function (Blueprint $table): void {
            $table->string('administration_level')->nullable()->after('designation');
        });

        DB::table('leaders')
            ->whereNull('administration_level')
            ->update([
                'administration_level' => DB::raw(
                    "CASE
                        WHEN LOWER(COALESCE(designation, '')) LIKE '%chair%'
                          OR LOWER(COALESCE(designation, '')) LIKE '%director%'
                          OR LOWER(COALESCE(designation, '')) LIKE '%executive%'
                          OR LOWER(COALESCE(designation, '')) LIKE '%ceo%'
                          OR LOWER(COALESCE(designation, '')) LIKE '%chief%'
                          OR LOWER(COALESCE(designation, '')) LIKE '%president%'
                          OR LOWER(COALESCE(designation, '')) LIKE '%managing%'
                          OR LOWER(COALESCE(designation, '')) LIKE '%board%'
                        THEN 'Management Team'
                        ELSE 'Secretariat'
                    END"
                ),
            ]);
    }

    public function down(): void
    {
        Schema::table('leaders', function (Blueprint $table): void {
            $table->dropColumn('administration_level');
        });
    }
};
