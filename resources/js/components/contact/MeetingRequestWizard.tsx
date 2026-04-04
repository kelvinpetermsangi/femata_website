import { useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import type { ContactInfo, MeetingLeaderOption } from '@/types';

type MeetingOptions = {
  modes: Record<string, string>;
  slots: string[];
};

type WizardStep = {
  key: string;
  label: string;
  note: string;
};

function leaderLabel(leader: MeetingLeaderOption) {
  return [leader.name, leader.title].filter(Boolean).join(' | ');
}

function meetingGroupLabel(value?: string | null) {
  return value === 'secretariat' ? 'Secretariat' : 'Management Team';
}

function durationLabel(value: string) {
  return `${value} minutes`;
}

export default function MeetingRequestWizard({
  action,
  contact,
  leaders,
  meetingOptions,
  scopeLabel,
  scopeNote,
  flashSuccess,
  submitLabel = 'Send request',
}: {
  action: string;
  contact: Pick<ContactInfo, 'booking_sender_name' | 'booking_email'>;
  leaders: MeetingLeaderOption[];
  meetingOptions: MeetingOptions;
  scopeLabel: string;
  scopeNote: string;
  flashSuccess?: string | null;
  submitLabel?: string;
}) {
  const form = useForm({
    request_type: 'meeting',
    name: '',
    email: '',
    phone: '',
    organization: '',
    subject: '',
    message: '',
    meeting_mode: 'in-person',
    meeting_with_key: '',
    preferred_date: '',
    preferred_slot: '',
    alternate_date: '',
    alternate_slot: '',
    duration_minutes: '30',
    agenda: '',
  });

  const [stepIndex, setStepIndex] = useState(0);
  const [stepMessage, setStepMessage] = useState<string | null>(null);

  const meetingLeaders = useMemo(
    () =>
      leaders.length > 0
        ? leaders
        : [
            {
              id: 'office',
              name: contact.booking_sender_name || `${scopeLabel} Secretariat`,
              title: 'Scheduling desk',
              email: contact.booking_email || null,
              group: 'secretariat',
            } satisfies MeetingLeaderOption,
          ],
    [contact.booking_email, contact.booking_sender_name, leaders, scopeLabel],
  );

  const steps = useMemo<WizardStep[]>(
    () => [
      {
        key: 'type',
        label: 'Request type',
        note: 'Choose a general inquiry or meeting booking.',
      },
      {
        key: 'details',
        label: 'Your details',
        note: 'Enter your contact information.',
      },
      {
        key: 'request',
        label: form.data.request_type === 'meeting' ? 'Meeting plan' : 'Your message',
        note:
          form.data.request_type === 'meeting'
            ? 'Pick the person, slot, mode, and agenda.'
            : 'Provide the context for your inquiry.',
      },
      {
        key: 'review',
        label: 'Review',
        note: 'Confirm the request before sending.',
      },
    ],
    [form.data.request_type],
  );

  const currentLeader = meetingLeaders.find((leader) => leader.id === form.data.meeting_with_key) ?? null;

  const validateStep = (index: number) => {
    if (index === 0) {
      return true;
    }

    if (index === 1) {
      if (form.data.name.trim() === '' || form.data.email.trim() === '') {
        setStepMessage('Add your name and email before continuing.');
        return false;
      }

      return true;
    }

    if (index === 2) {
      if (form.data.request_type === 'general') {
        if (form.data.message.trim() === '') {
          setStepMessage('Enter the message you want to send.');
          return false;
        }

        return true;
      }

      if (
        form.data.meeting_with_key.trim() === ''
        || form.data.meeting_mode.trim() === ''
        || form.data.preferred_date.trim() === ''
        || form.data.preferred_slot.trim() === ''
        || form.data.agenda.trim() === ''
      ) {
        setStepMessage('Choose the meeting contact, mode, preferred slot, and agenda before continuing.');
        return false;
      }
    }

    return true;
  };

  const goNext = () => {
    setStepMessage(null);

    if (!validateStep(stepIndex)) {
      return;
    }

    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  };

  const submit = () => {
    setStepMessage(null);

    if (!validateStep(2)) {
      setStepIndex(2);
      return;
    }

    form.transform((data) => ({
        ...data,
        subject: data.subject.trim() || null,
        phone: data.phone.trim() || null,
        organization: data.organization.trim() || null,
        message: data.message.trim() || null,
        meeting_with_key: data.request_type === 'meeting' ? data.meeting_with_key : null,
        meeting_mode: data.request_type === 'meeting' ? data.meeting_mode : null,
        preferred_date: data.request_type === 'meeting' ? data.preferred_date : null,
        preferred_slot: data.request_type === 'meeting' ? data.preferred_slot : null,
        alternate_date: data.request_type === 'meeting' ? data.alternate_date || null : null,
        alternate_slot: data.request_type === 'meeting' ? data.alternate_slot || null : null,
        duration_minutes: data.request_type === 'meeting' ? Number(data.duration_minutes || '30') : null,
        agenda: data.request_type === 'meeting' ? data.agenda.trim() : null,
      }));

    form.post(action, {
      preserveScroll: true,
      onSuccess: () => {
        form.reset();
        form.setData('request_type', 'meeting');
        form.setData('meeting_mode', 'in-person');
        form.setData('duration_minutes', '30');
        setStepIndex(0);
      },
    });
  };

  return (
    <section className="ui-section-layer p-4 sm:p-5 lg:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--accent-2))]">
            Contact and scheduling
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[rgb(var(--primary))] sm:text-[1.85rem]">
            Request support or book a meeting with {scopeLabel}
          </h2>
          <p className="mt-2 text-sm leading-7 text-[rgb(var(--muted))]">
            {scopeNote}
          </p>
        </div>

        <div className="ui-soft-panel px-4 py-3 text-sm text-[rgb(var(--muted))]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
            Routed by
          </p>
          <p className="mt-2 font-semibold text-[rgb(var(--primary))]">
            {contact.booking_sender_name || `${scopeLabel} scheduling desk`}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {steps.map((step, index) => {
          const active = index === stepIndex;
          const completed = index < stepIndex;

          return (
            <button
              key={step.key}
              type="button"
              onClick={() => {
                if (index <= stepIndex) {
                  setStepMessage(null);
                  setStepIndex(index);
                }
              }}
              className={[
                'rounded-[1.2rem] border px-4 py-3 text-left transition',
                active
                  ? 'border-[rgb(var(--primary))]/20 bg-[rgb(var(--primary))]/[0.08] text-[rgb(var(--primary))]'
                  : completed
                    ? 'border-[rgb(var(--border))] bg-[rgba(var(--surface),0.92)] text-[rgb(var(--primary))]'
                    : 'border-[rgb(var(--border))] bg-[rgba(var(--surface),0.74)] text-[rgb(var(--muted))]',
              ].join(' ')}
            >
              <div className="flex items-center gap-3">
                <span
                  className={[
                    'inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold',
                    active || completed
                      ? 'bg-[rgb(var(--primary))] text-white'
                      : 'bg-[rgb(var(--surface-2))] text-[rgb(var(--muted))]',
                  ].join(' ')}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="text-sm font-semibold">{step.label}</p>
                  <p className="mt-1 text-xs leading-5">{step.note}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {flashSuccess ? (
        <div className="mt-5 rounded-[1.1rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {flashSuccess}
        </div>
      ) : null}

      {stepMessage ? (
        <div className="mt-5 rounded-[1.1rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
          {stepMessage}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4">
        {stepIndex === 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={() => form.setData('request_type', 'meeting')}
              className={[
                'rounded-[1.5rem] border p-5 text-left transition',
                form.data.request_type === 'meeting'
                  ? 'border-[rgb(var(--primary))]/20 bg-[rgb(var(--primary))]/[0.08]'
                  : 'border-[rgb(var(--border))] bg-[rgba(var(--surface),0.86)] hover:bg-[rgb(var(--surface-2))]',
              ].join(' ')}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--accent-2))]">
                Meeting booking
              </p>
              <h3 className="mt-3 text-xl font-semibold text-[rgb(var(--primary))]">
                Book a meeting slot
              </h3>
              <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">
                Choose the FEMATA or association leader you want to meet, the date, time slot, and meeting mode.
              </p>
            </button>

            <button
              type="button"
              onClick={() => form.setData('request_type', 'general')}
              className={[
                'rounded-[1.5rem] border p-5 text-left transition',
                form.data.request_type === 'general'
                  ? 'border-[rgb(var(--primary))]/20 bg-[rgb(var(--primary))]/[0.08]'
                  : 'border-[rgb(var(--border))] bg-[rgba(var(--surface),0.86)] hover:bg-[rgb(var(--surface-2))]',
              ].join(' ')}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--accent-2))]">
                General inquiry
              </p>
              <h3 className="mt-3 text-xl font-semibold text-[rgb(var(--primary))]">
                Send a message
              </h3>
              <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">
                Use this route for partnerships, advert placement, membership questions, media requests, or document follow-up.
              </p>
            </button>
          </div>
        ) : null}

        {stepIndex === 1 ? (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[rgb(var(--primary))]">Full name</span>
              <input
                value={form.data.name}
                onChange={(event) => form.setData('name', event.target.value)}
                className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                placeholder="Your full name"
                autoComplete="name"
              />
              {form.errors.name ? <span className="text-xs font-medium text-red-600">{form.errors.name}</span> : null}
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[rgb(var(--primary))]">Email address</span>
              <input
                value={form.data.email}
                onChange={(event) => form.setData('email', event.target.value)}
                className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
              />
              {form.errors.email ? <span className="text-xs font-medium text-red-600">{form.errors.email}</span> : null}
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[rgb(var(--primary))]">Phone number</span>
              <input
                value={form.data.phone}
                onChange={(event) => form.setData('phone', event.target.value)}
                className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                placeholder="+255 ..."
                autoComplete="tel"
              />
              {form.errors.phone ? <span className="text-xs font-medium text-red-600">{form.errors.phone}</span> : null}
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[rgb(var(--primary))]">Organization</span>
              <input
                value={form.data.organization}
                onChange={(event) => form.setData('organization', event.target.value)}
                className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                placeholder="Company, institution, or association"
              />
              {form.errors.organization ? <span className="text-xs font-medium text-red-600">{form.errors.organization}</span> : null}
            </label>
          </div>
        ) : null}

        {stepIndex === 2 ? (
          form.data.request_type === 'meeting' ? (
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
              <div className="grid gap-4">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[rgb(var(--primary))]">Meeting subject</span>
                  <input
                    value={form.data.subject}
                    onChange={(event) => form.setData('subject', event.target.value)}
                    className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                    placeholder="Short subject for the meeting"
                  />
                  {form.errors.subject ? <span className="text-xs font-medium text-red-600">{form.errors.subject}</span> : null}
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[rgb(var(--primary))]">Meet with</span>
                    <select
                      value={form.data.meeting_with_key}
                      onChange={(event) => form.setData('meeting_with_key', event.target.value)}
                      className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                    >
                      <option value="">Choose a leader or office</option>
                      {meetingLeaders.map((leader) => (
                        <option key={leader.id} value={leader.id}>
                          {leaderLabel(leader)}
                        </option>
                      ))}
                    </select>
                    {form.errors.meeting_with_key ? <span className="text-xs font-medium text-red-600">{form.errors.meeting_with_key}</span> : null}
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[rgb(var(--primary))]">Meeting mode</span>
                    <select
                      value={form.data.meeting_mode}
                      onChange={(event) => form.setData('meeting_mode', event.target.value)}
                      className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                    >
                      {Object.entries(meetingOptions.modes).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                    {form.errors.meeting_mode ? <span className="text-xs font-medium text-red-600">{form.errors.meeting_mode}</span> : null}
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[rgb(var(--primary))]">Preferred date</span>
                    <input
                      type="date"
                      value={form.data.preferred_date}
                      onChange={(event) => form.setData('preferred_date', event.target.value)}
                      className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                    />
                    {form.errors.preferred_date ? <span className="text-xs font-medium text-red-600">{form.errors.preferred_date}</span> : null}
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[rgb(var(--primary))]">Preferred slot</span>
                    <select
                      value={form.data.preferred_slot}
                      onChange={(event) => form.setData('preferred_slot', event.target.value)}
                      className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                    >
                      <option value="">Choose a slot</option>
                      {meetingOptions.slots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                    {form.errors.preferred_slot ? <span className="text-xs font-medium text-red-600">{form.errors.preferred_slot}</span> : null}
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[rgb(var(--primary))]">Alternative date</span>
                    <input
                      type="date"
                      value={form.data.alternate_date}
                      onChange={(event) => form.setData('alternate_date', event.target.value)}
                      className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                    />
                    {form.errors.alternate_date ? <span className="text-xs font-medium text-red-600">{form.errors.alternate_date}</span> : null}
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[rgb(var(--primary))]">Alternative slot</span>
                    <select
                      value={form.data.alternate_slot}
                      onChange={(event) => form.setData('alternate_slot', event.target.value)}
                      className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                    >
                      <option value="">Choose an alternative slot</option>
                      {meetingOptions.slots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                    {form.errors.alternate_slot ? <span className="text-xs font-medium text-red-600">{form.errors.alternate_slot}</span> : null}
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)]">
                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[rgb(var(--primary))]">Duration</span>
                    <select
                      value={form.data.duration_minutes}
                      onChange={(event) => form.setData('duration_minutes', event.target.value)}
                      className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                    >
                      {['30', '45', '60', '90', '120'].map((value) => (
                        <option key={value} value={value}>
                          {durationLabel(value)}
                        </option>
                      ))}
                    </select>
                    {form.errors.duration_minutes ? <span className="text-xs font-medium text-red-600">{form.errors.duration_minutes}</span> : null}
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[rgb(var(--primary))]">Meeting agenda</span>
                    <textarea
                      value={form.data.agenda}
                      onChange={(event) => form.setData('agenda', event.target.value)}
                      rows={4}
                      className="field-shell px-4 py-3 text-sm leading-7 text-[rgb(var(--foreground))]"
                      placeholder="Tell the secretariat what you want to discuss."
                    />
                    {form.errors.agenda ? <span className="text-xs font-medium text-red-600">{form.errors.agenda}</span> : null}
                  </label>
                </div>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[rgb(var(--primary))]">Additional context</span>
                  <textarea
                    value={form.data.message}
                    onChange={(event) => form.setData('message', event.target.value)}
                    rows={3}
                    className="field-shell px-4 py-3 text-sm leading-7 text-[rgb(var(--foreground))]"
                    placeholder="Optional background notes, context, or specific requests."
                  />
                  {form.errors.message ? <span className="text-xs font-medium text-red-600">{form.errors.message}</span> : null}
                </label>
              </div>

              <div className="grid gap-4">
                <div className="ui-soft-panel p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                    Selected contact
                  </p>
                  <p className="mt-3 text-base font-semibold text-[rgb(var(--primary))]">
                    {currentLeader?.name || 'Choose a leader or office'}
                  </p>
                  {currentLeader?.title ? (
                    <p className="mt-2 text-sm text-[rgb(var(--muted))]">{currentLeader.title}</p>
                  ) : null}
                  {currentLeader?.group ? (
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-[rgb(var(--accent-2))]">
                      {meetingGroupLabel(currentLeader.group)}
                    </p>
                  ) : null}
                </div>

                <div className="ui-soft-panel p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                    Available slots
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {meetingOptions.slots.slice(0, 8).map((slot) => (
                      <span key={slot} className="ui-chip px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[rgb(var(--primary))]">
                        {slot}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-[rgb(var(--primary))]">Subject</span>
                <input
                  value={form.data.subject}
                  onChange={(event) => form.setData('subject', event.target.value)}
                  className="field-shell px-4 py-3 text-sm text-[rgb(var(--foreground))]"
                  placeholder="Short subject"
                />
                {form.errors.subject ? <span className="text-xs font-medium text-red-600">{form.errors.subject}</span> : null}
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-[rgb(var(--primary))]">Your message</span>
                <textarea
                  value={form.data.message}
                  onChange={(event) => form.setData('message', event.target.value)}
                  rows={6}
                  className="field-shell px-4 py-3 text-sm leading-7 text-[rgb(var(--foreground))]"
                  placeholder="Explain the support or response you need."
                />
                {form.errors.message ? <span className="text-xs font-medium text-red-600">{form.errors.message}</span> : null}
              </label>
            </div>
          )
        ) : null}

        {stepIndex === 3 ? (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="grid gap-4">
              <div className="ui-soft-panel p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                  Request summary
                </p>
                <div className="mt-4 grid gap-3 text-sm text-[rgb(var(--muted))] sm:grid-cols-2">
                  <div>
                    <p className="font-semibold text-[rgb(var(--primary))]">Requester</p>
                    <p className="mt-1">{form.data.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[rgb(var(--primary))]">Email</p>
                    <p className="mt-1">{form.data.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[rgb(var(--primary))]">Request type</p>
                    <p className="mt-1">{form.data.request_type === 'meeting' ? 'Meeting booking' : 'General inquiry'}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[rgb(var(--primary))]">Organization</p>
                    <p className="mt-1">{form.data.organization || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {form.data.request_type === 'meeting' ? (
                <div className="ui-soft-panel p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                    Meeting request
                  </p>
                  <div className="mt-4 grid gap-3 text-sm text-[rgb(var(--muted))] sm:grid-cols-2">
                    <div>
                      <p className="font-semibold text-[rgb(var(--primary))]">Meeting with</p>
                      <p className="mt-1">{currentLeader ? leaderLabel(currentLeader) : 'Not selected'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-[rgb(var(--primary))]">Mode</p>
                      <p className="mt-1">{meetingOptions.modes[form.data.meeting_mode] || 'Not selected'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-[rgb(var(--primary))]">Preferred date</p>
                      <p className="mt-1">{form.data.preferred_date || 'Not selected'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-[rgb(var(--primary))]">Preferred slot</p>
                      <p className="mt-1">{form.data.preferred_slot || 'Not selected'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-[rgb(var(--primary))]">Alternative date</p>
                      <p className="mt-1">{form.data.alternate_date || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-[rgb(var(--primary))]">Alternative slot</p>
                      <p className="mt-1">{form.data.alternate_slot || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="mt-4 rounded-[1rem] border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.9)] px-4 py-4 text-sm leading-7 text-[rgb(var(--muted))]">
                    <p className="font-semibold text-[rgb(var(--primary))]">Agenda</p>
                    <p className="mt-2">{form.data.agenda || 'No agenda provided.'}</p>
                  </div>
                </div>
              ) : (
                <div className="ui-soft-panel p-4 text-sm leading-7 text-[rgb(var(--muted))]">
                  <p className="font-semibold text-[rgb(var(--primary))]">Message</p>
                  <p className="mt-2">{form.data.message || 'No message provided.'}</p>
                </div>
              )}
            </div>

            <div className="ui-soft-panel p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                What happens next
              </p>
              <div className="mt-4 grid gap-3 text-sm leading-7 text-[rgb(var(--muted))]">
                <p>Your request is sent to the official scheduling email configured by the administrator.</p>
                <p>If the meeting details are adjusted, approved, or declined, the response goes directly to your email.</p>
                <p>Use the back button if you want to change any detail before sending.</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-[rgb(var(--muted))]">
          Step {stepIndex + 1} of {steps.length}
        </div>

        <div className="flex flex-wrap gap-3">
          {stepIndex > 0 ? (
            <button
              type="button"
              onClick={() => {
                setStepMessage(null);
                setStepIndex((current) => Math.max(current - 1, 0));
              }}
              className="btn-secondary"
            >
              Back
            </button>
          ) : null}

          {stepIndex < steps.length - 1 ? (
            <button type="button" onClick={goNext} className="btn-primary">
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={form.processing}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-70"
            >
              {form.processing ? 'Sending...' : submitLabel}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
