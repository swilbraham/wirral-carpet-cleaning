import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

/**
 * The work-experience placement form: /student-placement/<token>.
 *
 * Two halves, one per link. The school coordinator's link opens the school
 * half; the parent's link opens theirs, including the medical disclosures and
 * the first aid consent. Neither can read the other's answers, and neither
 * link is guessable — the token is the whole secret, as with the quote pages.
 *
 * Deliberately plain: this is a safeguarding document being completed on a
 * phone, probably in a hurry, probably by somebody who was sent the link and
 * has never seen the site.
 */

const Field = ({ label, name, hint, type = 'text', required, ...rest }) => (
  <label className="block">
    <span className="text-sm font-semibold text-gray-800">
      {label}
      {required && <span className="text-red-600"> *</span>}
    </span>
    {hint && <span className="mt-0.5 block text-xs text-gray-500">{hint}</span>}
    <input
      name={name}
      type={type}
      required={required}
      className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-base focus:border-primary focus:outline-none"
      {...rest}
    />
  </label>
);

const Area = ({ label, name, hint, rows = 3, required }) => (
  <label className="block">
    <span className="text-sm font-semibold text-gray-800">
      {label}
      {required && <span className="text-red-600"> *</span>}
    </span>
    {hint && <span className="mt-0.5 block text-xs text-gray-500">{hint}</span>}
    <textarea
      name={name}
      rows={rows}
      required={required}
      className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-base focus:border-primary focus:outline-none"
    />
  </label>
);

const YesNo = ({ label, name, hint, options = ['yes', 'no'], required }) => (
  <fieldset className="rounded-xl border border-gray-200 px-4 py-3">
    <legend className="px-1 text-sm font-semibold text-gray-800">
      {label}
      {required && <span className="text-red-600"> *</span>}
    </legend>
    {hint && <p className="mb-2 text-xs text-gray-500">{hint}</p>}
    <div className="flex flex-wrap gap-4">
      {options.map((option) => (
        <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
          <input type="radio" name={name} value={option} required={required} className="h-4 w-4" />
          {option === 'yes' ? 'Yes' : option === 'no' ? 'No' : 'Not applicable'}
        </label>
      ))}
    </div>
  </fieldset>
);

const Section = ({ n, title, children, note }) => (
  <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
    <h2 className="text-lg font-bold text-gray-900">
      <span className="text-primary">{n}.</span> {title}
    </h2>
    {note && <p className="mt-1 text-sm text-gray-600">{note}</p>}
    <div className="mt-4 space-y-4">{children}</div>
  </section>
);

export default function PlacementPage() {
  const { token } = useParams();
  const [info, setInfo] = useState(null);
  const [state, setState] = useState('loading');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/placement?token=${encodeURIComponent(token || '')}`)
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok) {
          setState('missing');
          return;
        }
        setInfo(json);
        setState(json.expired ? 'expired' : json.done ? 'done' : 'ready');
      })
      .catch(() => !cancelled && setState('error'));
    return () => {
      cancelled = true;
    };
  }, [token]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSending(true);
    const body = { token };
    for (const [key, value] of new FormData(e.target).entries()) {
      body[key] = typeof value === 'string' ? value : '';
    }
    try {
      const res = await fetch('/api/placement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || "That didn't send — please try again.");
        return;
      }
      setState('sent');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setError("That didn't send — check your signal and try again.");
    } finally {
      setSending(false);
    }
  };

  const shell = (children) => (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20 px-4">
      <Helmet>
        <title>Work experience placement form | Wirral Carpet Cleaning</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="mx-auto max-w-2xl space-y-5">{children}</div>
    </div>
  );

  if (state === 'loading') return shell(<p className="text-gray-500">Loading…</p>);

  if (state === 'missing' || state === 'error') {
    return shell(
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h1 className="text-xl font-bold text-gray-900">This link isn&apos;t valid</h1>
        <p className="mt-2 text-gray-600">
          It may have been typed incorrectly or replaced with a newer one. Ring
          us on{' '}
          <a href="tel:01519369664" className="font-semibold text-primary underline">
            0151 936 9664
          </a>{' '}
          and we&apos;ll send another.
        </p>
      </div>
    );
  }

  const isSchool = info?.role === 'school';
  const who = isSchool ? 'school placement coordinator' : 'parent or guardian';

  if (state === 'sent' || state === 'done') {
    return shell(
      <div className="rounded-2xl border border-green-200 bg-white p-6">
        <h1 className="text-xl font-bold text-gray-900">
          {state === 'sent' ? 'Thank you — that’s submitted' : 'This section is already complete'}
        </h1>
        <p className="mt-2 text-gray-600">
          The {who} section for {info?.studentName} has been received. If
          anything needs changing, ring us on{' '}
          <a href="tel:01519369664" className="font-semibold text-primary underline">
            0151 936 9664
          </a>{' '}
          — the form can&apos;t be edited once sent.
        </p>
      </div>
    );
  }

  if (state === 'expired') {
    return shell(
      <div className="rounded-2xl border border-amber-200 bg-white p-6">
        <h1 className="text-xl font-bold text-gray-900">This link has expired</h1>
        <p className="mt-2 text-gray-600">
          Links are time-limited for safety. Ring 0151 936 9664 and we&apos;ll
          send a fresh one.
        </p>
      </div>
    );
  }

  return shell(
    <>
      <div className="rounded-2xl bg-primary px-5 py-6 text-white sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
          Wirral Carpet Cleaning Limited · confidential
        </p>
        <h1 className="mt-1 text-2xl font-bold">Work experience placement form</h1>
        <p className="mt-2 text-white/90">
          For {info?.studentName}
          {info?.school ? ` · ${info.school}` : ''}
          {info?.startDate ? ` · starting ${info.startDate}` : ''}
        </p>
        <p className="mt-3 rounded-xl bg-white/10 px-4 py-3 text-sm">
          You&apos;re completing the <strong>{who}</strong> section. Your answers
          are encrypted when you send them and seen only by the placement
          supervisor.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-5">
        {isSchool ? (
          <>
            <Section n="1" title="School contact details">
              <Field label="Placement coordinator name" name="coordinatorName" required />
              <Field label="Coordinator telephone" name="coordinatorPhone" type="tel" required />
              <Field label="Coordinator email" name="coordinatorEmail" type="email" />
              <Field label="Named safeguarding contact" name="safeguardingContact" required />
              <Field label="Safeguarding contact telephone" name="safeguardingPhone" type="tel" required />
            </Section>

            <Section n="2" title="Placement dates and hours">
              <Field label="Placement end date" name="endDate" type="date" required />
              <Field
                label="Usual hours and days"
                name="placementHours"
                hint="For example: Tue–Thu, 9am to 3pm"
                required
              />
            </Section>

            <Section
              n="3"
              title="Supervision and safeguarding"
              note="Please include only what we need to keep the student safe — not unrelated confidential records."
            >
              <Area
                label="Supervision or welfare arrangements we must follow"
                name="supervisionArrangements"
                rows={4}
              />
              <Area label="Any placement restrictions or agreed support" name="placementRestrictions" />
              <Area
                label="How to report absence, incidents or concerns"
                name="reportingProcedure"
                hint="Who we ring, and on what number, if something happens."
                required
              />
              <YesNo
                label="The school confirms the placement information and emergency contacts above are correct"
                name="schoolConfirms"
                required
              />
            </Section>
          </>
        ) : (
          <>
            <Section n="1" title="Your details">
              <Field label="Your name" name="parentName" required />
              <Field label="Relationship to the student" name="relationship" required />
              <Field label="Telephone" name="parentPhone" type="tel" required />
              <Field label="Alternative telephone" name="parentPhoneAlt" type="tel" />
              <Field label="Email" name="parentEmail" type="email" />
            </Section>

            <Section n="2" title="Emergency contact">
              <Field label="Emergency contact name" name="emergencyName" hint="If different from you" />
              <Field label="Emergency telephone" name="emergencyPhone" type="tel" />
              <Area
                label="Collection or early departure arrangements"
                name="collectionArrangements"
                rows={2}
              />
            </Section>

            <Section
              n="3"
              title="Health and support information"
              note="Only what is needed to keep your child safe during the placement. This is encrypted and seen only by the placement supervisor."
            >
              <YesNo
                label="Is there anything relevant to declare?"
                name="healthNone"
                hint="If nothing applies, choose No and leave the boxes below empty."
                required
              />
              <Area
                label="Allergies, asthma or health considerations"
                name="allergies"
                hint="Particularly anything affected by cleaning products, dust or warm damp environments."
              />
              <Area
                label="Medication or emergency action we should know about"
                name="medication"
                hint="Including who holds it and who administers it."
              />
              <Area
                label="Disability, learning, communication or sensory support needed"
                name="supportNeeds"
              />
              <Area label="Any physical or task restrictions" name="taskRestrictions" />
            </Section>

            <Section n="4" title="Permissions">
              <YesNo
                label="I agree to the proposed placement and its supervised, assessed activities"
                name="agreePlacement"
                required
              />
              <YesNo
                label="I agree to travel between customer sites with the named supervisor"
                name="agreeTravel"
                options={['yes', 'no', 'na']}
                required
              />
              <YesNo
                label="Photographs of the student may be used promotionally"
                name="agreePhotography"
                hint="Separate written consent is still obtained before any specific use."
                required
              />
              <Area
                label="Any tasks you want specifically excluded"
                name="excludedTasks"
                rows={2}
              />
            </Section>

            <Section n="5" title="First aid and emergency medical consent">
              <p className="rounded-xl bg-gray-50 px-4 py-3 text-sm leading-relaxed text-gray-700">
                I consent to appropriately trained staff at Wirral Carpet Cleaning
                Limited providing reasonable first aid to my child if they are
                injured or become unwell during the placement, within that staff
                member&apos;s training and competence. In an emergency I
                understand the company may call 999 and seek urgent medical
                assistance without delay. The company will make reasonable
                efforts to contact me or the nominated emergency contact as soon
                as practicable. I confirm that relevant medical information and
                allergies affecting first aid have been disclosed above or to the
                school.
              </p>
              <YesNo label="I give this consent" name="firstAidConsent" required />
            </Section>
          </>
        )}

        <Section n={isSchool ? '4' : '6'} title="Declaration">
          <p className="text-sm text-gray-600">
            Typing your name below acts as your signature. The date and time are
            recorded with your answers.
          </p>
          <Field label="Your full name" name="declarationName" required />
          <Field label="Date" name="declarationDate" type="date" required />
          {!isSchool && (
            <Field
              label="Student&rsquo;s name (as acknowledgement)"
              name="studentName"
              hint="Your child confirms they have read the placement arrangements."
            />
          )}
        </Section>

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={sending}
          className="w-full rounded-xl bg-primary px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {sending ? 'Sending…' : 'Submit this section'}
        </button>

        <p className="pb-8 text-xs text-gray-500">
          Your answers are encrypted before they are stored and are used only to
          keep the student safe and to administer the placement. They are kept no
          longer than our safeguarding and insurance obligations require, and are
          never shared outside the company except where the law requires it. This
          form supplements, and does not replace, the school&apos;s own placement
          agreement, risk assessment and safeguarding procedures.
        </p>
      </form>
    </>
  );
}
