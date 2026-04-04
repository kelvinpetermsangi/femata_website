<?php

namespace App\Http\Controllers\Admin;

use App\Mail\MeetingRequestStatusMessage;
use App\Models\MeetingRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;
use App\Support\SiteSettings;

class MeetingRequestController extends AdminController
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', MeetingRequest::class);

        $user = $request->user();
        $query = MeetingRequest::query()
            ->with('association:id,name,slug')
            ->orderByRaw("case when status = 'pending' then 0 else 1 end")
            ->latest();

        if ($user && ! $user->hasRole('super-admin') && $user->associations()->exists()) {
            $query->whereIn('association_id', $user->associations()->pluck('associations.id'));
        }

        return Inertia::render('Admin/Meetings', [
            'requests' => $query
                ->get()
                ->map(fn (MeetingRequest $meetingRequest) => $this->mapRequest($meetingRequest))
                ->all(),
            'statusOptions' => MeetingRequest::statuses(),
            'slotOptions' => MeetingRequest::slotOptions(),
            'meetingModes' => MeetingRequest::meetingModes(),
        ]);
    }

    public function update(Request $request, MeetingRequest $meetingRequest): RedirectResponse
    {
        $this->authorize('update', $meetingRequest);

        $user = $request->user();
        abort_unless($user?->canAccessAssociation($meetingRequest->association_id), 403);

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:pending,approved,adjustment_sent,declined'],
            'proposed_date' => ['nullable', 'date'],
            'proposed_slot' => ['nullable', 'string', 'max:80'],
            'proposed_location' => ['nullable', 'string', 'max:255'],
            'proposed_map_url' => ['nullable', 'url', 'max:2048'],
            'response_message' => ['nullable', 'string', 'max:5000'],
        ]);

        $meetingRequest->update([
            'status' => $validated['status'],
            'proposed_date' => $validated['proposed_date'] ?? ($validated['status'] === MeetingRequest::STATUS_APPROVED ? $meetingRequest->preferred_date : null),
            'proposed_slot' => trim((string) ($validated['proposed_slot'] ?? '')) ?: ($validated['status'] === MeetingRequest::STATUS_APPROVED ? $meetingRequest->preferred_slot : null),
            'proposed_location' => trim((string) ($validated['proposed_location'] ?? '')) ?: null,
            'proposed_map_url' => trim((string) ($validated['proposed_map_url'] ?? '')) ?: null,
            'response_message' => trim((string) ($validated['response_message'] ?? '')) ?: null,
            'responded_by' => $user?->id,
            'responded_at' => now(),
        ]);

        Mail::to($meetingRequest->requester_email)->send(
            new MeetingRequestStatusMessage($meetingRequest->fresh('association'), SiteSettings::contact()),
        );

        return redirect()
            ->route('admin.meetings.index')
            ->with('success', 'Meeting request updated and notification sent.');
    }

    private function mapRequest(MeetingRequest $meetingRequest): array
    {
        return [
            'id' => $meetingRequest->id,
            'scope_type' => $meetingRequest->scope_type,
            'request_type' => $meetingRequest->request_type,
            'status' => $meetingRequest->status,
            'status_label' => MeetingRequest::statuses()[$meetingRequest->status] ?? ucfirst($meetingRequest->status),
            'requester_name' => $meetingRequest->requester_name,
            'requester_email' => $meetingRequest->requester_email,
            'requester_phone' => $meetingRequest->requester_phone,
            'organization' => $meetingRequest->organization,
            'meeting_with_name' => $meetingRequest->meeting_with_name,
            'meeting_with_title' => $meetingRequest->meeting_with_title,
            'meeting_with_email' => $meetingRequest->meeting_with_email,
            'meeting_with_group' => $meetingRequest->meeting_with_group,
            'subject' => $meetingRequest->subject,
            'meeting_mode' => $meetingRequest->meeting_mode,
            'preferred_date' => $meetingRequest->preferred_date?->toDateString(),
            'preferred_slot' => $meetingRequest->preferred_slot,
            'alternate_date' => $meetingRequest->alternate_date?->toDateString(),
            'alternate_slot' => $meetingRequest->alternate_slot,
            'duration_minutes' => $meetingRequest->duration_minutes,
            'message' => $meetingRequest->message,
            'agenda' => $meetingRequest->agenda,
            'recipient_email' => $meetingRequest->recipient_email,
            'proposed_date' => $meetingRequest->proposed_date?->toDateString(),
            'proposed_slot' => $meetingRequest->proposed_slot,
            'proposed_location' => $meetingRequest->proposed_location,
            'proposed_map_url' => $meetingRequest->proposed_map_url,
            'response_message' => $meetingRequest->response_message,
            'association' => $meetingRequest->association
                ? [
                    'id' => $meetingRequest->association->id,
                    'name' => $meetingRequest->association->name,
                    'slug' => $meetingRequest->association->slug,
                ]
                : null,
            'created_at' => $meetingRequest->created_at?->toDateTimeString(),
            'updated_at' => $meetingRequest->updated_at?->toDateTimeString(),
        ];
    }
}
