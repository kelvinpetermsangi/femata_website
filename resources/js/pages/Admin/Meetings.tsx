import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import AdminPageIntro from '@/components/AdminPageIntro';
import AdminLayout from '@/layouts/AdminLayout';
import type { MeetingRequestItem, SharedPageProps } from '@/types';

type FormShape = {
  status: string;
  proposed_date: string;
  proposed_slot: string;
  proposed_location: string;
  proposed_map_url: string;
  response_message: string;
};

function formatDate(value?: string | null) {
  if (!value) {
    return 'Not set';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function emptyForm(request?: MeetingRequestItem | null): FormShape {
  return {
    status: request?.status ?? 'pending',
    proposed_date: request?.proposed_date ?? '',
    proposed_slot: request?.proposed_slot ?? '',
    proposed_location: request?.proposed_location ?? '',
    proposed_map_url: request?.proposed_map_url ?? '',
    response_message: request?.response_message ?? '',
  };
}

export default function AdminMeetings({
  requests,
  statusOptions,
  slotOptions,
  meetingModes,
}: {
  requests: MeetingRequestItem[];
  statusOptions: Record<string, string>;
  slotOptions: string[];
  meetingModes: Record<string, string>;
}) {
  const { props } = usePage<SharedPageProps>();
  const [selectedId, setSelectedId] = useState<number | null>(requests[0]?.id ?? null);
  const selectedRequest = useMemo(
    () => requests.find((item) => item.id === selectedId) ?? null,
    [requests, selectedId],
  );
  const form = useForm<FormShape>(emptyForm(selectedRequest));

  useEffect(() => {
    form.setData(emptyForm(selectedRequest));
    form.clearErrors();
  }, [selectedRequest]);

  const pendingCount = requests.filter((item) => item.status === 'pending').length;
  const flashSuccess = props.flash?.success;

  return (
    <>
      <Head title="Meetings" />

      <AdminLayout title="Meetings">
        <AdminPageIntro
          eyebrow="Meeting queue"
          title="Review booking requests, adjust slot details, and respond from one workflow."
          text="Each request can be approved as submitted, adjusted with a new time or location, or declined with a clear response note. Email updates are sent to the requester automatically."
          metrics={[
            { label: 'Total requests', value: String(requests.length) },
            { label: 'Pending', value: String(pendingCount) },
          ]}
        />

        {flashSuccess ? (
          <div className="mt-6 rounded-[1.25rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {flashSuccess}
          </div>
        ) : null}

        <section className="mt-6 grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <div className="grid gap-4">
            {requests.length === 0 ? (
              <div className="card-shell p-6 text-sm leading-7 text-[rgb(var(--muted))]">
                No meeting requests have been submitted yet.
              </div>
            ) : (
              requests.map((request) => (
                <button
                  key={request.id}
                  type="button"
                  onClick={() => setSelectedId(request.id)}
                  className={[
                    'card-shell p-5 text-left transition',
                    selectedId === request.id ? 'ring-2 ring-[rgba(var(--primary),0.18)]' : 'hover:-translate-y-[1px]',
                  ].join(' ')}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className="ui-chip px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--primary))]">
                          {request.scope_type === 'association' ? request.association?.name || 'Association' : 'National'}
                        </span>
                        <span className="ui-chip px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--primary))]">
                          {request.status_label || request.status}
                        </span>
                      </div>
                      <h2 className="mt-3 text-lg font-semibold text-[rgb(var(--primary))]">
                        {request.requester_name}
                      </h2>
                      <p className="mt-1 text-sm text-[rgb(var(--muted))]">
                        {request.meeting_with_name ? `Requested with ${request.meeting_with_name}` : 'General contact routing'}
                      </p>
                    </div>

                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgb(var(--muted))]">
                      #{request.id}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-2 text-sm text-[rgb(var(--muted))]">
                    <p>{request.requester_email}</p>
                    <p>{formatDate(request.preferred_date)} | {request.preferred_slot || 'Slot pending'}</p>
                    <p>{request.subject || request.agenda || request.message || 'No detail provided'}</p>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="card-shell p-5 sm:p-6">
            {selectedRequest ? (
              <div className="grid gap-6">
                <div>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                        Booking request
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))]">
                        {selectedRequest.requester_name}
                      </h2>
                    </div>

                    <div className="ui-soft-panel px-4 py-3 text-sm text-[rgb(var(--muted))]">
                      <p className="font-semibold text-[rgb(var(--primary))]">
                        {selectedRequest.association?.name || 'FEMATA National'}
                      </p>
                      <p className="mt-1">Reference #{selectedRequest.id}</p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    <div className="ui-soft-panel p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">Requester</p>
                      <p className="mt-2 font-semibold text-[rgb(var(--primary))]">{selectedRequest.requester_name}</p>
                      <p className="mt-1 text-sm text-[rgb(var(--muted))]">{selectedRequest.requester_email}</p>
                      {selectedRequest.requester_phone ? <p className="mt-1 text-sm text-[rgb(var(--muted))]">{selectedRequest.requester_phone}</p> : null}
                    </div>
                    <div className="ui-soft-panel p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">Meeting contact</p>
                      <p className="mt-2 font-semibold text-[rgb(var(--primary))]">{selectedRequest.meeting_with_name || 'Scheduling desk'}</p>
                      {selectedRequest.meeting_with_title ? <p className="mt-1 text-sm text-[rgb(var(--muted))]">{selectedRequest.meeting_with_title}</p> : null}
                      {selectedRequest.meeting_with_group ? <p className="mt-1 text-sm text-[rgb(var(--muted))]">{selectedRequest.meeting_with_group}</p> : null}
                    </div>
                    <div className="ui-soft-panel p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">Preferred booking</p>
                      <p className="mt-2 font-semibold text-[rgb(var(--primary))]">{formatDate(selectedRequest.preferred_date)}</p>
                      <p className="mt-1 text-sm text-[rgb(var(--muted))]">{selectedRequest.preferred_slot || 'Slot not specified'}</p>
                      <p className="mt-1 text-sm text-[rgb(var(--muted))]">{meetingModes[selectedRequest.meeting_mode ?? ''] || 'Mode not specified'}</p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4">
                    <div className="ui-soft-panel p-4 text-sm leading-7 text-[rgb(var(--muted))]">
                      <p className="font-semibold text-[rgb(var(--primary))]">Agenda / message</p>
                      <p className="mt-2">{selectedRequest.agenda || selectedRequest.message || 'No additional detail provided.'}</p>
                    </div>
                    {selectedRequest.organization ? (
                      <div className="ui-soft-panel p-4 text-sm leading-7 text-[rgb(var(--muted))]">
                        <p className="font-semibold text-[rgb(var(--primary))]">Organization</p>
                        <p className="mt-2">{selectedRequest.organization}</p>
                      </div>
                    ) : null}
                  </div>
                </div>

                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    form.put(`/admin/meetings/${selectedRequest.id}`);
                  }}
                  className="grid gap-4"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="text-sm font-semibold text-[rgb(var(--primary))]">Decision</span>
                      <select value={form.data.status} onChange={(event) => form.setData('status', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]">
                        {Object.entries(statusOptions).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                      {form.errors.status ? <span className="text-xs font-medium text-red-600">{form.errors.status}</span> : null}
                    </label>

                    <label className="grid gap-2">
                      <span className="text-sm font-semibold text-[rgb(var(--primary))]">Suggested date</span>
                      <input type="date" value={form.data.proposed_date} onChange={(event) => form.setData('proposed_date', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" />
                      {form.errors.proposed_date ? <span className="text-xs font-medium text-red-600">{form.errors.proposed_date}</span> : null}
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="text-sm font-semibold text-[rgb(var(--primary))]">Suggested slot</span>
                      <select value={form.data.proposed_slot} onChange={(event) => form.setData('proposed_slot', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]">
                        <option value="">Use requested slot</option>
                        {slotOptions.map((slot) => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                      {form.errors.proposed_slot ? <span className="text-xs font-medium text-red-600">{form.errors.proposed_slot}</span> : null}
                    </label>

                    <label className="grid gap-2">
                      <span className="text-sm font-semibold text-[rgb(var(--primary))]">Suggested location</span>
                      <input value={form.data.proposed_location} onChange={(event) => form.setData('proposed_location', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" placeholder="Meeting room, video link, or office" />
                      {form.errors.proposed_location ? <span className="text-xs font-medium text-red-600">{form.errors.proposed_location}</span> : null}
                    </label>
                  </div>

                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[rgb(var(--primary))]">Map or joining link</span>
                    <input value={form.data.proposed_map_url} onChange={(event) => form.setData('proposed_map_url', event.target.value)} className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]" placeholder="https://..." />
                    {form.errors.proposed_map_url ? <span className="text-xs font-medium text-red-600">{form.errors.proposed_map_url}</span> : null}
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[rgb(var(--primary))]">Response note</span>
                    <textarea value={form.data.response_message} onChange={(event) => form.setData('response_message', event.target.value)} rows={5} className="field-shell px-4 py-3 text-sm leading-7 text-[rgb(var(--foreground))]" placeholder="Write the note that should be emailed to the requester." />
                    {form.errors.response_message ? <span className="text-xs font-medium text-red-600">{form.errors.response_message}</span> : null}
                  </label>

                  <div className="flex justify-end">
                    <button type="submit" disabled={form.processing} className="btn-primary min-w-[220px] disabled:cursor-not-allowed disabled:opacity-70">
                      {form.processing ? 'Sending update...' : 'Save and email update'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="text-sm leading-7 text-[rgb(var(--muted))]">
                Select a meeting request to review it.
              </div>
            )}
          </div>
        </section>
      </AdminLayout>
    </>
  );
}
