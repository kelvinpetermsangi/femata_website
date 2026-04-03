<?php

namespace Tests\Feature;

use App\Mail\ContactFormMessage;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ContactFormTest extends TestCase
{
    public function test_contact_form_can_be_submitted(): void
    {
        Mail::fake();

        $response = $this->post('/contact', [
            'name' => 'Test User',
            'email' => 'tester@example.com',
            'message' => 'Hello from the website contact form.',
        ]);

        $response
            ->assertRedirect()
            ->assertSessionHas('success');

        Mail::assertSent(ContactFormMessage::class, function (ContactFormMessage $mail): bool {
            return $mail->submission['email'] === 'tester@example.com'
                && $mail->submission['name'] === 'Test User';
        });
    }
}
