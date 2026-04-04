New website contact form submission

Name: {{ $submission['name'] }}
Email: {{ $submission['email'] }}
Phone: {{ $submission['phone'] ?? 'Not provided' }}
Organization: {{ $submission['organization'] ?? 'Not provided' }}
Subject: {{ $submission['subject'] ?? 'Not provided' }}

Message:
{{ $submission['message'] }}
