<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactFormMessage extends Mailable
{
    use SerializesModels;

    /**
     * @param  array{name: string, email: string, message: string}  $submission
     */
    public function __construct(public array $submission)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'FEMATA website contact form',
            replyTo: [
                new Address($this->submission['email'], $this->submission['name']),
            ],
        );
    }

    public function content(): Content
    {
        return new Content(
            text: 'emails.contact-form',
            with: [
                'submission' => $this->submission,
            ],
        );
    }
}
