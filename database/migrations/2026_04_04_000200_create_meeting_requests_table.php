<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meeting_requests', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('association_id')->nullable()->constrained()->nullOnDelete();
            $table->string('scope_type', 40)->default('national');
            $table->string('request_type', 40)->default('meeting');
            $table->string('status', 40)->default('pending');
            $table->string('requester_name');
            $table->string('requester_email');
            $table->string('requester_phone', 60)->nullable();
            $table->string('organization', 255)->nullable();
            $table->string('meeting_with_name', 255)->nullable();
            $table->string('meeting_with_title', 255)->nullable();
            $table->string('meeting_with_email', 255)->nullable();
            $table->string('meeting_with_group', 80)->nullable();
            $table->string('subject', 255)->nullable();
            $table->string('meeting_mode', 40)->nullable();
            $table->date('preferred_date')->nullable();
            $table->string('preferred_slot', 80)->nullable();
            $table->date('alternate_date')->nullable();
            $table->string('alternate_slot', 80)->nullable();
            $table->unsignedSmallInteger('duration_minutes')->nullable();
            $table->text('message')->nullable();
            $table->text('agenda')->nullable();
            $table->string('recipient_email', 255)->nullable();
            $table->date('proposed_date')->nullable();
            $table->string('proposed_slot', 80)->nullable();
            $table->string('proposed_location', 255)->nullable();
            $table->string('proposed_map_url', 2048)->nullable();
            $table->text('response_message')->nullable();
            $table->foreignId('responded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('responded_at')->nullable();
            $table->timestamps();
            $table->index(['status', 'scope_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meeting_requests');
    }
};
