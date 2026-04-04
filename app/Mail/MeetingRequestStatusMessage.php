<?php

namespace App\Mail;

use App\Models\MeetingRequest;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MeetingRequestStatusMessage extends Mailable
{
    use SerializesModels;

    public function __construct(
        public MeetingRequest $meetingRequest,
        public array $contactSettings = [],
    ) {
    }

    public function envelope(): Envelope
    {
        $fromEmail = data_get($this->contactSettings, 'booking_email');
        $fromName = data_get($this->contactSettings, 'booking_sender_name', 'FEMATA Secretariat');

        return new Envelope(
            from: $fromEmail ? new Address($fromEmail, $fromName) : null,
            subject: 'Update on your FEMATA meeting request',
        );
    }

    public function content(): Content
    {
        return new Content(
            text: 'emails.meeting-request-status',
            with: [
                'request' => $this->meetingRequest,
            ],
        );
    }
}
