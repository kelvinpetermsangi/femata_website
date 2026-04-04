New FEMATA website request

Scope: {{ $request->association?->name ? 'Association: '.$request->association->name : 'FEMATA National' }}
Type: {{ ucfirst($request->request_type) }}
Status: {{ ucfirst(str_replace('_', ' ', $request->status)) }}

Requester: {{ $request->requester_name }}
Email: {{ $request->requester_email }}
Phone: {{ $request->requester_phone ?: 'Not provided' }}
Organization: {{ $request->organization ?: 'Not provided' }}

Meeting with: {{ $request->meeting_with_name ?: 'Not specified' }}
Role: {{ $request->meeting_with_title ?: 'Not specified' }}
Mode: {{ $request->meeting_mode ?: 'Not specified' }}
Preferred date: {{ optional($request->preferred_date)->format('Y-m-d') ?: 'Not specified' }}
Preferred slot: {{ $request->preferred_slot ?: 'Not specified' }}
Alternate date: {{ optional($request->alternate_date)->format('Y-m-d') ?: 'Not specified' }}
Alternate slot: {{ $request->alternate_slot ?: 'Not specified' }}
Duration: {{ $request->duration_minutes ? $request->duration_minutes.' minutes' : 'Not specified' }}

Subject:
{{ $request->subject ?: 'Not provided' }}

Agenda / Message:
{{ $request->agenda ?: $request->message ?: 'No additional details provided.' }}
