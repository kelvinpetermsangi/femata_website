Update on your FEMATA request

Status: {{ ucfirst(str_replace('_', ' ', $request->status)) }}
Reference: #{{ $request->id }}
Meeting with: {{ $request->meeting_with_name ?: 'FEMATA contact desk' }}

Requested date: {{ optional($request->preferred_date)->format('Y-m-d') ?: 'Not provided' }}
Requested slot: {{ $request->preferred_slot ?: 'Not provided' }}

@if($request->proposed_date || $request->proposed_slot || $request->proposed_location)
Updated meeting details:
Date: {{ optional($request->proposed_date)->format('Y-m-d') ?: 'Not yet confirmed' }}
Time slot: {{ $request->proposed_slot ?: 'Not yet confirmed' }}
Location: {{ $request->proposed_location ?: 'Not yet confirmed' }}
Map link: {{ $request->proposed_map_url ?: 'Not provided' }}
@endif

Response message:
{{ $request->response_message ?: 'No additional note was included.' }}
