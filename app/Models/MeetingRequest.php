<?php

namespace App\Models;

use App\Models\Concerns\LogsCmsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\Traits\LogsActivity;

class MeetingRequest extends Model
{
    use HasFactory, LogsActivity, LogsCmsActivity;

    public const STATUS_PENDING = 'pending';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_ADJUSTMENT_SENT = 'adjustment_sent';
    public const STATUS_DECLINED = 'declined';

    public const TYPE_MEETING = 'meeting';
    public const TYPE_GENERAL = 'general';

    protected $fillable = [
        'association_id',
        'scope_type',
        'request_type',
        'status',
        'requester_name',
        'requester_email',
        'requester_phone',
        'organization',
        'meeting_with_name',
        'meeting_with_title',
        'meeting_with_email',
        'meeting_with_group',
        'subject',
        'meeting_mode',
        'preferred_date',
        'preferred_slot',
        'alternate_date',
        'alternate_slot',
        'duration_minutes',
        'message',
        'agenda',
        'recipient_email',
        'proposed_date',
        'proposed_slot',
        'proposed_location',
        'proposed_map_url',
        'response_message',
        'responded_by',
        'responded_at',
    ];

    protected function casts(): array
    {
        return [
            'preferred_date' => 'date',
            'alternate_date' => 'date',
            'proposed_date' => 'date',
            'responded_at' => 'datetime',
            'duration_minutes' => 'integer',
        ];
    }

    public static function statuses(): array
    {
        return [
            self::STATUS_PENDING => 'Pending review',
            self::STATUS_APPROVED => 'Approved',
            self::STATUS_ADJUSTMENT_SENT => 'Changes proposed',
            self::STATUS_DECLINED => 'Declined',
        ];
    }

    public static function meetingModes(): array
    {
        return [
            'in-person' => 'In-person meeting',
            'virtual' => 'Virtual meeting',
            'phone' => 'Phone call',
        ];
    }

    public static function slotOptions(): array
    {
        return [
            '08:00 - 08:30',
            '08:30 - 09:00',
            '09:00 - 09:30',
            '09:30 - 10:00',
            '10:00 - 10:30',
            '10:30 - 11:00',
            '11:00 - 11:30',
            '11:30 - 12:00',
            '12:00 - 12:30',
            '13:00 - 13:30',
            '13:30 - 14:00',
            '14:00 - 14:30',
            '14:30 - 15:00',
            '15:00 - 15:30',
            '15:30 - 16:00',
            '16:00 - 16:30',
        ];
    }

    public function association(): BelongsTo
    {
        return $this->belongsTo(Association::class);
    }

    public function responder(): BelongsTo
    {
        return $this->belongsTo(User::class, 'responded_by');
    }
}
