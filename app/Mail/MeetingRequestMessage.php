<?php

namespace App\Mail;

use App\Models\MeetingRequest;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MeetingRequestMessage extends Mailable
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
            subject: $this->meetingRequest->request_type === MeetingRequest::TYPE_GENERAL
                ? 'FEMATA website inquiry'
                : 'New FEMATA meeting request',
            replyTo: [
                new Address($this->meetingRequest->requester_email, $this->meetingRequest->requester_name),
            ],
        );
    }

    public function content(): Content
    {
        return new Content(
            text: 'emails.meeting-request',
            with: [
                'request' => $this->meetingRequest,
            ],
        );
    }
}
