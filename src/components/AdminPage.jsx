import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ITEM_GROUPS, calculatePrice, describeLines } from '../lib/pricing';

/**
 * The one-van CRM: a stat strip that answers "anything need me?", an
 * Overview of what to act on today, and tabs for the full lists. All data
 * arrives in one fetch; tabs are pure display. Read-only except the two
 * deliberate actions: discount codes, and silently marking a quote booked.
 */
const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'jobs', label: 'Jobs' },
  { id: 'quotes', label: 'Quotes' },
  { id: 'customers', label: 'Customers' },
  { id: 'codes', label: 'Codes' },
  { id: 'placement', label: 'Placement' },
];

/** Field names as a person would say them, for the placement answers. */
const PLACEMENT_LABELS = {
  coordinatorName: 'Coordinator', coordinatorPhone: 'Coordinator phone',
  coordinatorEmail: 'Coordinator email', safeguardingContact: 'Safeguarding contact',
  safeguardingPhone: 'Safeguarding phone', placementHours: 'Hours and days',
  endDate: 'End date', supervisionArrangements: 'Supervision arrangements',
  placementRestrictions: 'Restrictions', reportingProcedure: 'Reporting procedure',
  schoolConfirms: 'School confirms details', parentName: 'Parent / guardian',
  relationship: 'Relationship', parentPhone: 'Phone', parentPhoneAlt: 'Alternative phone',
  parentEmail: 'Email', emergencyName: 'Emergency contact', emergencyPhone: 'Emergency phone',
  collectionArrangements: 'Collection arrangements', healthNone: 'Anything to declare',
  allergies: 'Allergies / health', medication: 'Medication', supportNeeds: 'Support needed',
  taskRestrictions: 'Task restrictions', agreePlacement: 'Agrees to placement',
  agreeTravel: 'Agrees to travel', agreePhotography: 'Photography consent',
  firstAidConsent: 'First aid consent', excludedTasks: 'Excluded tasks',
  declarationName: 'Signed (typed name)', declarationDate: 'Dated',
  studentName: 'Student acknowledgement', submittedAt: 'Submitted',
  submittedFrom: 'From IP', userAgent: 'Device',
};

const labelFor = (key) => PLACEMENT_LABELS[key] || key;

export default function AdminPage() {
  const [password, setPassword] = useState(
    () => sessionStorage.getItem('wcc-admin') || ''
  );
  const [entered, setEntered] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('overview');
  // Where a cross-tab jump is pointing: the row is opened and scrolled to.
  const [focus, setFocus] = useState(null);
  const [newCode, setNewCode] = useState('');
  const [newPct, setNewPct] = useState('10');
  const [codeMsg, setCodeMsg] = useState('');
  const [quoteBasket, setQuoteBasket] = useState({});
  const [quoteMsg, setQuoteMsg] = useState('');
  const [placementMsg, setPlacementMsg] = useState('');
  const [openPlacement, setOpenPlacement] = useState(null);
  const [search, setSearch] = useState('');
  const [quoteDays, setQuoteDays] = useState(30);

  const load = async (pw, days = quoteDays) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin?days=${days}`, {
        headers: { 'x-admin-password': pw },
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Something went wrong.');
        setData(null);
        sessionStorage.removeItem('wcc-admin');
        setPassword('');
        return;
      }
      sessionStorage.setItem('wcc-admin', pw);
      setPassword(pw);
      setData(json);
    } catch {
      setError("Couldn't reach the server — try again.");
    } finally {
      setLoading(false);
    }
  };

  const adminPost = async (body) => {
    setCodeMsg('');
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        setCodeMsg(json.error || 'Something went wrong.');
        return false;
      }
      setNewCode('');
      await load(password); // refresh everything
      return json;
    } catch {
      setCodeMsg("Couldn't reach the server — try again.");
      return false;
    }
  };

  useEffect(() => {
    if (password) load(password);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
        <Helmet>
          <title>Admin | Wirral Carpet Cleaning</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="max-w-sm mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h1 className="text-xl font-bold text-gray-900">Admin</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (entered.trim()) load(entered.trim());
            }}
            className="mt-4 space-y-3"
          >
            <input
              type="password"
              value={entered}
              onChange={(e) => setEntered(e.target.value)}
              placeholder="Password"
              autoFocus
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary hover:bg-primary-dark disabled:bg-gray-300 px-6 py-3 font-semibold text-white transition-colors"
            >
              {loading ? 'Checking…' : 'Sign in'}
            </button>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </form>
        </div>
      </div>
    );
  }

  const toChase = data.quotes.filter((q) => !q.booked && !q.chased_at);
  const codes = data.codes || [];

  const Section = ({ title, hint, children, action }) => (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 md:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {action}
      </div>
      {hint && <p className="mt-0.5 text-sm text-gray-500">{hint}</p>}
      <div className="mt-3">{children}</div>
    </div>
  );

  const ViewAll = ({ to, children }) => (
    <button
      onClick={() => setTab(to)}
      className="text-sm font-semibold text-primary underline shrink-0"
    >
      {children}
    </button>
  );

  const Empty = ({ children }) => (
    <p className="text-sm text-gray-400">{children}</p>
  );

  const Detail = ({ label, children }) => (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900 text-right">{children}</span>
    </div>
  );

  /** Jump to another tab and open the record being pointed at. */
  const go = (toTab, id) => {
    setTab(toTab);
    setFocus({ tab: toTab, id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * The three lists are the same table keyed by phone, so that is the join:
   * digits only, because the same person is "07712 345678" on one row and
   * "+447712345678" on another.
   */
  const digits = (value) => String(value || '').replace(/\D/g, '').slice(-10);

  const bookingsByPhone = new Map();
  for (const booking of [...(data.upcoming || []), ...(data.past || [])]) {
    const key = digits(booking.phone);
    if (!key) continue;
    bookingsByPhone.set(key, [...(bookingsByPhone.get(key) || []), booking]);
  }

  const quotesByPhone = new Map();
  for (const quote of data.quotes || []) {
    const key = digits(quote.phone);
    if (!key) continue;
    quotesByPhone.set(key, [...(quotesByPhone.get(key) || []), quote]);
  }

  /** A small underlined button that reads as a link, because it behaves as one. */
  const Jump = ({ to, id, children }) => (
    <button
      type="button"
      onClick={() => go(to, id)}
      className="text-left font-semibold text-primary underline"
    >
      {children}
    </button>
  );

  const BookingRow = ({ b }) => {
    const theirQuotes = quotesByPhone.get(digits(b.phone)) || [];
    const fromQuote = theirQuotes[0];
    return (
    <li>
      <details
        className="group py-1"
        open={focus?.tab === 'jobs' && focus.id === b.id}
      >
        <summary className="cursor-pointer list-none py-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-lg px-2 -mx-2 hover:bg-gray-50">
          <div>
            <p className="font-semibold text-gray-900">
              {b.slot_date} <span className="text-gray-500">{b.slot_time}</span>
              {b.kind === 'booking-paid' && (
                <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                  paid
                </span>
              )}
            </p>
            <p className="text-sm text-gray-600">{b.name} · {b.postcode}</p>
          </div>
          <span className="font-bold text-primary">{b.total}</span>
        </summary>
        <div className="mb-2 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 divide-y divide-gray-100">
          <Detail label="Customer">{b.name}</Detail>
          <Detail label="Phone">
            <a href={`tel:${b.phone}`} className="font-semibold text-primary underline">{b.phone}</a>
          </Detail>
          <Detail label="Address">{b.address}, {b.postcode}</Detail>
          <Detail label="Slot">{b.slot_date} · {b.slot_time === 'AM' ? 'Morning 8–12' : 'Afternoon 12–5'}</Detail>
          <Detail label="Items">
            {String(b.items).split(', ').map((line) => (
              <span key={line} className="block">{line}</span>
            ))}
          </Detail>
          {fromQuote && (
            <Detail label="Quoted">
              <Jump to="quotes" id={fromQuote.id}>
                {fromQuote.total} on {fromQuote.created_at} — open the quote →
              </Jump>
            </Detail>
          )}
          <Detail label="Customer history">
            <Jump to="customers" id={digits(b.phone)}>
              Every job for this number →
            </Jump>
          </Detail>
          <Detail label="Payment">
            {b.kind === 'booking-paid' ? 'Paid via Klarna' : `${b.total} on the day — cash or card`}
          </Detail>
          <Detail label="Booked on">{b.booked_at}</Detail>
        </div>
      </details>
    </li>
    );
  };

  const QuoteRow = ({ q }) => {
    const theirBookings = bookingsByPhone.get(digits(q.phone)) || [];
    // The job this quote turned into: their first booking taken after it.
    const becameJob = theirBookings[0];
    return (
    <li>
      <details
        className="group"
        open={focus?.tab === 'quotes' && focus.id === q.id}
      >
        <summary className="cursor-pointer list-none py-2.5 flex flex-wrap items-baseline justify-between gap-2 text-sm rounded-lg px-2 -mx-2 hover:bg-gray-50">
          <span className="font-semibold text-gray-900">{q.name}</span>
          <span className="flex items-center gap-2">
            {q.booked ? (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                {q.manual_booked ? 'booked ☎' : 'booked'}
              </span>
            ) : q.chased_at ? (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">10% sent</span>
            ) : (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">chase</span>
            )}
            <span className="font-semibold text-gray-700">{q.total}</span>
            <span className="text-gray-400">{q.created_at}</span>
          </span>
        </summary>
        <div className="mb-2 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 divide-y divide-gray-100">
          <Detail label="Phone">
            <a href={`tel:${q.phone}`} className="font-semibold text-primary underline">{q.phone}</a>
          </Detail>
          {q.address && <Detail label="Address">{q.address}</Detail>}
          {q.postcode && <Detail label="Postcode">{q.postcode}</Detail>}
          <Detail label="Quoted for">
            {String(q.items).split(', ').map((line) => (
              <span key={line} className="block">{line}</span>
            ))}
          </Detail>
          <Detail label="Quoted price">{q.total}</Detail>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const total = e.target.elements.total.value;
              if (total.trim()) await adminPost({ action: 'set-total', id: q.id, total });
            }}
            className="py-2 flex items-center gap-2"
          >
            <span className="text-sm text-gray-500">Amend price</span>
            <span className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">£</span>
              <input
                name="total"
                type="text"
                inputMode="decimal"
                defaultValue={String(q.total).replace(/[£,]/g, '')}
                className="w-24 rounded-xl border border-gray-200 pl-7 pr-2 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </span>
            <button
              type="submit"
              className="rounded-xl bg-primary hover:bg-primary-dark px-4 py-2 text-sm font-semibold text-white transition-colors"
            >
              Update
            </button>
          </form>
          <p className="pb-1 text-xs text-gray-400">
            Changes the quote only — nothing is sent. A later 10% chase text uses the new price.
          </p>
          {q.quote_sent_at && (
            <Detail label="Quote texted">{q.quote_sent_at}</Detail>
          )}
          <details className="py-2">
            <summary className="cursor-pointer text-sm font-semibold text-primary">
              Edit their details
            </summary>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const f = e.target;
                const result = await adminPost({
                  action: 'update-quote',
                  id: q.id,
                  name: f.elements.ename.value,
                  phone: f.elements.ephone.value,
                  postcode: f.elements.epostcode.value,
                  address: f.elements.eaddress.value,
                });
                if (result) setQuoteMsg(`Details updated for ${f.elements.ename.value}.`);
              }}
              className="mt-2 grid gap-2 sm:grid-cols-2"
            >
              <input
                name="ename"
                type="text"
                required
                defaultValue={q.name}
                placeholder="Name"
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
              <input
                name="ephone"
                type="tel"
                defaultValue={q.phone}
                placeholder="Mobile 07…"
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
              <input
                name="eaddress"
                type="text"
                defaultValue={q.address || ''}
                placeholder="Address"
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
              <input
                name="epostcode"
                type="text"
                defaultValue={q.postcode || ''}
                placeholder="Postcode"
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm uppercase focus:border-primary focus:outline-none"
              />
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="rounded-xl bg-primary hover:bg-primary-dark px-4 py-2 text-sm font-semibold text-white transition-colors"
                >
                  Save details
                </button>
                <span className="ml-2 text-xs text-gray-400">
                  Nothing is sent — texts from now on use the new details.
                </span>
              </div>
            </form>
          </details>
          {q.phone && (
            <div className="pt-2">
              <button
                onClick={async () => {
                  const result = await adminPost({ action: 'send-quote', id: q.id });
                  if (result) setQuoteMsg(`Quote texted to ${q.name}.`);
                }}
                className="rounded-xl border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
              >
                {q.quote_sent_at ? 'Text the quote again' : 'Text them this quote'}
              </button>
              <p className="mt-1 text-xs text-gray-400">
                Sends the items, price and a link to their own quote page. Amend
                the price first and the text uses the new figure.
              </p>
            </div>
          )}
          <Detail label="When">{q.created_at}</Detail>
          {becameJob && (
            <Detail label="Became">
              <Jump to="jobs" id={becameJob.id}>
                {becameJob.slot_date} · {becameJob.total} — open the job →
              </Jump>
            </Detail>
          )}
          {!becameJob && q.booked && (
            <Detail label="Became">
              Marked booked by hand — no job found on this number.
            </Detail>
          )}
          <Detail label="Status">
            {q.manual_booked
              ? 'Marked booked by you (phoned in)'
              : q.booked
                ? 'Went on to book online'
                : q.chased_at
                  ? `10% offer texted ${q.chased_at}`
                  : 'Not booked — 10% offer goes out 6h after the quote'}
          </Detail>
          {!q.booked && q.phone && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const pct = e.target.elements.dpct.value;
                const result = await adminPost({ action: 'send-discount', id: q.id, pct });
                if (result) setQuoteMsg(`${pct}% offer texted to ${q.name}.`);
              }}
              className="py-2"
            >
              <div className="flex items-center gap-2">
                <select
                  name="dpct"
                  defaultValue="10"
                  className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                >
                  {[5, 10, 15, 20, 25, 30].map((p) => (
                    <option key={p} value={p}>{p}% off</option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-600 hover:bg-amber-700 px-4 py-2 text-sm font-semibold text-white transition-colors"
                >
                  {q.chased_at ? 'Text another discount offer' : 'Text discount offer now'}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Sends the offer text straight away{q.chased_at ? '' : ' instead of waiting for the 6-hour chase'} —
                and stops the automatic chase from texting them again.
              </p>
            </form>
          )}
          {!q.booked && (
            <div className="pt-2">
              <button
                onClick={() => adminPost({ action: 'mark-booked', id: q.id, booked: true })}
                className="rounded-xl bg-green-600 hover:bg-green-700 px-4 py-2 text-sm font-semibold text-white transition-colors"
              >
                Mark as booked — sends nothing
              </button>
              <p className="mt-1 text-xs text-gray-400">
                For quotes that turned into a phone booking. Stops the 10% chase text; no message goes to anyone.
              </p>
            </div>
          )}
          {q.manual_booked && (
            <div className="pt-2">
              <button
                onClick={() => adminPost({ action: 'mark-booked', id: q.id, booked: false })}
                className="text-xs font-semibold text-gray-500 underline"
              >
                Un-mark (back to chaseable)
              </button>
            </div>
          )}
        </div>
      </details>
    </li>
    );
  };

  /** One customer, with their jobs and quotes a click away. */
  const CustomerRow = ({ c, trailing }) => {
    const key = digits(c.phone);
    const theirJobs = bookingsByPhone.get(key) || [];
    const theirQuotes = quotesByPhone.get(key) || [];
    const focused = focus?.tab === 'customers' && focus.id === key;
    return (
      <li
        className={`py-2.5 text-sm ${focused ? 'rounded-lg bg-amber-50 px-2 -mx-2' : ''}`}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span>
            <span className="font-semibold text-gray-900">{c.name}</span>{' '}
            <a href={`tel:${c.phone}`} className="font-semibold text-primary underline">
              {c.phone}
            </a>
            <span className="text-gray-500"> · {c.postcode}</span>
          </span>
          <span className="text-gray-500">{trailing}</span>
        </div>
        {(theirJobs.length > 0 || theirQuotes.length > 0) && (
          <p className="mt-1 flex flex-wrap gap-x-4 text-xs">
            {theirJobs.length > 0 && (
              <Jump to="jobs" id={theirJobs[0].id}>
                {theirJobs.length} job{theirJobs.length === 1 ? '' : 's'} →
              </Jump>
            )}
            {theirQuotes.length > 0 && (
              <Jump to="quotes" id={theirQuotes[0].id}>
                {theirQuotes.length} quote{theirQuotes.length === 1 ? '' : 's'} →
              </Jump>
            )}
          </p>
        )}
      </li>
    );
  };

  const DueRow = ({ c }) => (
    <CustomerRow c={c} trailing={`last clean ${c.last_clean}`} />
  );

  /**
   * One box over every list. The office's question is almost always "where is
   * this person", and the answer was previously four tabs and a scroll —
   * which is how somebody concludes a record is missing when it is simply
   * older than the quote window.
   */
  const needle = search.trim().toLowerCase();
  const digitsOf = (value) => String(value || '').replace(/\D/g, '');
  const matches = (row) => {
    if (!needle) return false;
    const hay = [row.name, row.phone, row.postcode, row.address, row.items]
      .map((v) => String(v || '').toLowerCase())
      .join(' ');
    if (hay.includes(needle)) return true;
    const asDigits = needle.replace(/\D/g, '');
    return asDigits.length >= 4 && digitsOf(row.phone).includes(asDigits);
  };

  const found = {
    jobs: [...(data.upcoming || []), ...(data.past || [])].filter(matches),
    quotes: (data.quotes || []).filter(matches),
    customers: (data.customers || []).filter(matches),
  };
  const foundCount = found.jobs.length + found.quotes.length + found.customers.length;

  const stats = [
    { label: 'Upcoming jobs', value: data.upcoming.length, to: 'jobs', tone: 'text-primary' },
    { label: 'Quotes to chase', value: toChase.length, to: 'quotes', tone: toChase.length > 0 ? 'text-amber-600' : 'text-gray-900' },
    { label: 'Due a reminder', value: data.due.length, to: 'customers', tone: data.due.length > 0 ? 'text-amber-600' : 'text-gray-900' },
    { label: 'Customers', value: data.customers.length, to: 'customers', tone: 'text-gray-900' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20 px-4">
      <Helmet>
        <title>Admin | Wirral Carpet Cleaning</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-bold text-gray-900">WCC Admin</h1>
          <button
            onClick={() => {
              sessionStorage.removeItem('wcc-admin');
              setData(null);
              setPassword('');
            }}
            className="text-sm font-semibold text-gray-500 underline"
          >
            Sign out
          </button>
        </div>

        {/* Search — above everything, because "where is this person" is the
            question the office actually arrives with. */}
        <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search a name, address, postcode or part of a number…"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:border-primary focus:outline-none"
          />
          {needle && (
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-gray-500">
              <span>
                {foundCount} match{foundCount === 1 ? '' : 'es'} · quotes cover
                the last {data.quoteDays || 30} days
              </span>
              <span className="flex gap-3">
                {(data.quoteDays || 30) < 365 && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuoteDays(365);
                      load(password, 365);
                    }}
                    className="font-semibold text-primary underline"
                  >
                    Search the last year
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="font-semibold text-gray-500 underline"
                >
                  Clear
                </button>
              </span>
            </div>
          )}
        </div>

        {/* Stat strip — each one jumps to its tab */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((s) => (
            <button
              key={s.label}
              onClick={() => setTab(s.to)}
              className="rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-colors hover:border-primary/40"
            >
              <p className={`text-2xl font-bold tabular-nums ${s.tone}`}>{s.value}</p>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{s.label}</p>
            </button>
          ))}
        </div>

        {needle && (
          <div className="space-y-5">
            {foundCount === 0 ? (
              <Section title="No matches">
                <Empty>
                  Nothing on that. If they definitely got a price, the quote may
                  predate the window above — or it never saved, which happens if
                  the same connection submitted more than eight times in an hour.
                </Empty>
              </Section>
            ) : (
              <>
                {found.jobs.length > 0 && (
                  <Section title={`Jobs (${found.jobs.length})`}>
                    <ul className="divide-y divide-gray-100">
                      {found.jobs.map((b) => <BookingRow key={b.id} b={b} />)}
                    </ul>
                  </Section>
                )}
                {found.quotes.length > 0 && (
                  <Section title={`Quotes (${found.quotes.length})`}>
                    <ul className="divide-y divide-gray-100">
                      {found.quotes.map((q) => <QuoteRow key={q.id} q={q} />)}
                    </ul>
                  </Section>
                )}
                {found.customers.length > 0 && (
                  <Section title={`Customers (${found.customers.length})`}>
                    <ul className="divide-y divide-gray-100">
                      {found.customers.map((c) => (
                        <CustomerRow
                          key={c.phone}
                          c={c}
                          trailing={`${c.bookings} clean${c.bookings === 1 ? '' : 's'} · last ${c.last_clean}`}
                        />
                      ))}
                    </ul>
                  </Section>
                )}
              </>
            )}
          </div>
        )}

        {/* Tab bar */}
        <div className={`flex gap-1 overflow-x-auto rounded-2xl border border-gray-200 bg-white p-1 shadow-sm ${needle ? 'hidden' : ''}`}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                tab === t.id ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {!needle && tab === 'overview' && (
          <div className="space-y-5">
            <Section
              title="Next up"
              action={<ViewAll to="jobs">All jobs →</ViewAll>}
            >
              {data.upcoming.length === 0 ? (
                <Empty>Nothing booked in.</Empty>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {data.upcoming.slice(0, 3).map((b) => <BookingRow key={b.id} b={b} />)}
                </ul>
              )}
            </Section>

            <Section
              title={`Quotes to chase (${toChase.length})`}
              hint="Priced up, left a mobile, didn't book — the 10% text goes automatically at 6 hours, but a human call beats it."
              action={<ViewAll to="quotes">All quotes →</ViewAll>}
            >
              {toChase.length === 0 ? (
                <Empty>Nobody waiting — every recent quote booked or was chased.</Empty>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {toChase.slice(0, 5).map((q) => <QuoteRow key={q.id} q={q} />)}
                </ul>
              )}
            </Section>

            <Section
              title={`Due a re-clean reminder (${data.due.length})`}
              hint="Last cleaned 9+ months ago — the easiest work you'll ever win."
              action={<ViewAll to="customers">All customers →</ViewAll>}
            >
              {data.due.length === 0 ? (
                <Empty>Nobody yet — fills up as booking history builds.</Empty>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {data.due.slice(0, 5).map((c) => <DueRow key={c.phone} c={c} />)}
                </ul>
              )}
            </Section>
          </div>
        )}

        {!needle && tab === 'jobs' && (
          <div className="space-y-5">
            <Section title={`Upcoming jobs (${data.upcoming.length})`}>
              {data.upcoming.length === 0 ? (
                <Empty>Nothing booked in. New bookings appear here automatically.</Empty>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {data.upcoming.map((b) => <BookingRow key={b.id} b={b} />)}
                </ul>
              )}
            </Section>
            <Section title={`Past jobs (${data.past.length})`}>
              {data.past.length === 0 ? (
                <Empty>History builds from here.</Empty>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {data.past.map((b) => <BookingRow key={b.id} b={b} />)}
                </ul>
              )}
            </Section>
          </div>
        )}

        {!needle && tab === 'quotes' && (
          <Section
            title={`Quotes — last ${data.quoteDays || 30} days (${data.quotes.length})`}
            action={
              (data.quoteDays || 30) < 365 ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuoteDays(365);
                    load(password, 365);
                  }}
                  className="text-sm font-semibold text-primary underline"
                >
                  Show the last year
                </button>
              ) : null
            }
            hint="Everyone who unlocked a price. Tap a row for details and the mark-as-booked button."
          >
            <details className="mb-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <summary className="cursor-pointer text-sm font-semibold text-primary">
                + Add a quote by hand
              </summary>
              <p className="mt-1 text-xs text-gray-500">
                Pick the items like the customer would, tweak the price if you
                want, and tick the box to text them the quote with a link to
                their own quote page. With a mobile, the 10% chase still goes
                out 6 hours later unless they book or you mark it booked.
              </p>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const f = e.target;
                  const priced = calculatePrice(quoteBasket);
                  const override = f.elements.qtotal.value.trim();
                  const result = await adminPost({
                    action: 'add-quote',
                    name: f.elements.qname.value,
                    phone: f.elements.qphone.value,
                    postcode: f.elements.qpostcode.value,
                    address: f.elements.qaddress.value,
                    items: describeLines(priced.lines).join(', '),
                    total: override || String(priced.total),
                    sendText: f.elements.qsend.checked,
                  });
                  if (result) {
                    f.reset();
                    setQuoteBasket({});
                    setQuoteMsg(
                      result.warning ||
                        (result.texted
                          ? 'Quote saved and texted to them.'
                          : 'Quote saved.')
                    );
                  }
                }}
                className="mt-3 space-y-3"
              >
                <div className="grid gap-2 sm:grid-cols-3">
                  <input
                    name="qname"
                    type="text"
                    required
                    placeholder="Name"
                    className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                  <input
                    name="qphone"
                    type="tel"
                    placeholder="Mobile 07…"
                    className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                  <input
                    name="qpostcode"
                    type="text"
                    placeholder="Postcode (optional)"
                    className="rounded-xl border border-gray-200 px-3 py-2 text-sm uppercase focus:border-primary focus:outline-none"
                  />
                  <input
                    name="qaddress"
                    type="text"
                    placeholder="Address (optional)"
                    className="sm:col-span-3 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>

                {ITEM_GROUPS.map((group) => (
                  <div key={group.title}>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {group.title}
                    </p>
                    <ul className="mt-1 divide-y divide-gray-100 rounded-xl border border-gray-100 bg-white">
                      {group.items.map((item) => {
                        const qty = quoteBasket[item.id] || 0;
                        const set = (next) =>
                          setQuoteBasket((prev) => ({
                            ...prev,
                            [item.id]: Math.min(item.max, Math.max(0, next)),
                          }));
                        return (
                          <li
                            key={item.id}
                            className="flex items-center justify-between gap-2 px-3 py-1.5 text-sm"
                          >
                            <span className={qty > 0 ? 'font-semibold text-gray-900' : 'text-gray-600'}>
                              {item.name}
                              <span className="ml-1 text-xs text-gray-400">£{item.price}</span>
                            </span>
                            <span className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => set(qty - 1)}
                                disabled={qty === 0}
                                className="h-7 w-7 rounded-full border border-gray-200 font-bold text-gray-600 disabled:opacity-30"
                              >
                                −
                              </button>
                              <span className="w-5 text-center font-semibold tabular-nums">{qty}</span>
                              <button
                                type="button"
                                onClick={() => set(qty + 1)}
                                disabled={qty >= item.max}
                                className="h-7 w-7 rounded-full border border-gray-200 font-bold text-gray-600 disabled:opacity-30"
                              >
                                +
                              </button>
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}

                {(() => {
                  const priced = calculatePrice(quoteBasket);
                  return (
                    <div className="rounded-xl bg-white border border-gray-100 px-4 py-3 text-sm">
                      <div className="flex items-baseline justify-between">
                        <span className="font-semibold text-gray-700">Calculated price</span>
                        <span className="text-xl font-bold text-primary">£{priced.total}</span>
                      </div>
                      {priced.bundleApplied && (
                        <p className="text-xs text-green-700">3-areas-for-£99 deal applied.</p>
                      )}
                      {priced.minApplied && (
                        <p className="text-xs text-gray-500">£90 minimum visit applied.</p>
                      )}
                    </div>
                  );
                })()}

                <div className="flex flex-wrap items-center gap-2">
                  <span className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">£</span>
                    <input
                      name="qtotal"
                      type="text"
                      inputMode="decimal"
                      placeholder="Own price (optional)"
                      className="w-40 rounded-xl border border-gray-200 pl-7 pr-2 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                  </span>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input name="qsend" type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
                    Text them the quote with a link
                  </label>
                  <button
                    type="submit"
                    className="ml-auto rounded-xl bg-primary hover:bg-primary-dark px-5 py-2 text-sm font-semibold text-white transition-colors"
                  >
                    Save quote
                  </button>
                </div>
              </form>
              {codeMsg && <p className="mt-2 text-sm text-red-600">{codeMsg}</p>}
            </details>
            {quoteMsg && (
              <p className="mb-3 rounded-xl bg-green-50 border border-green-100 px-4 py-2 text-sm font-semibold text-green-800">
                {quoteMsg}
              </p>
            )}
            {data.quotes.length === 0 ? (
              <Empty>No quotes yet.</Empty>
            ) : (
              <ul className="divide-y divide-gray-100">
                {data.quotes.map((q) => <QuoteRow key={q.id} q={q} />)}
              </ul>
            )}
          </Section>
        )}

        {!needle && tab === 'customers' && (
          <div className="space-y-5">
            <Section
              title={`Due a re-clean reminder (${data.due.length})`}
              hint="Last cleaned over 9 months ago."
            >
              {data.due.length === 0 ? (
                <Empty>Nobody yet — this fills up as booking history builds.</Empty>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {data.due.map((c) => <DueRow key={c.phone} c={c} />)}
                </ul>
              )}
            </Section>
            <Section
              title={`Customers (${data.customers.length})`}
              hint="Everyone who has booked, most recent first."
            >
              {data.customers.length === 0 ? (
                <Empty>No customers recorded yet.</Empty>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {data.customers.map((c) => (
                    <CustomerRow
                      key={c.phone}
                      c={c}
                      trailing={`${c.bookings} clean${c.bookings === 1 ? '' : 's'} · last ${c.last_clean}`}
                    />
                  ))}
                </ul>
              )}
            </Section>
          </div>
        )}

        {!needle && tab === 'placement' && (
          <div className="space-y-5">
            {data.formKeyReady === false && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                <strong>WCC_FORM_KEY isn&apos;t set in Vercel.</strong> Until it
                is, the form refuses submissions rather than storing a child&apos;s
                medical details unencrypted.
              </div>
            )}

            <Section
              title="Start a placement"
              hint="Creates two private links: one for the school coordinator, one for the parent or guardian. Send each to the right person — the link is the password, so don't post them anywhere public."
            >
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const f = e.target;
                  const result = await adminPost({
                    action: 'add-placement',
                    studentName: f.elements.studentName.value,
                    school: f.elements.school.value,
                    startDate: f.elements.startDate.value,
                  });
                  if (result) {
                    setPlacementMsg('Placement created — the two links are below.');
                    f.reset();
                  }
                }}
                className="grid gap-2 sm:grid-cols-3"
              >
                <input
                  name="studentName"
                  required
                  placeholder="Student name"
                  className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
                <input
                  name="school"
                  placeholder="School"
                  className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
                <input
                  name="startDate"
                  type="date"
                  className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-primary hover:bg-primary-dark px-4 py-2 text-sm font-semibold text-white transition-colors sm:col-span-3"
                >
                  Create the links
                </button>
              </form>
              {placementMsg && (
                <p className="mt-2 text-sm font-semibold text-green-700">{placementMsg}</p>
              )}
            </Section>

            <Section title={`Placements (${(data.placements || []).length})`}>
              {(data.placements || []).length === 0 ? (
                <Empty>None yet.</Empty>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {data.placements.map((pl) => {
                    const base = `${window.location.origin}/student-placement/`;
                    const detail = openPlacement?.id === pl.id ? openPlacement : null;
                    return (
                      <li key={pl.id} className="py-3">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <span className="font-semibold text-gray-900">
                            {pl.student_name}
                            {pl.school ? <span className="font-normal text-gray-500"> · {pl.school}</span> : null}
                          </span>
                          <span className="flex items-center gap-2 text-xs">
                            <span className={`rounded-full px-2 py-0.5 font-semibold ${pl.school_done ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-800'}`}>
                              school {pl.school_done ? '✓' : 'waiting'}
                            </span>
                            <span className={`rounded-full px-2 py-0.5 font-semibold ${pl.parent_done ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-800'}`}>
                              parent {pl.parent_done ? '✓' : 'waiting'}
                            </span>
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          {pl.start_date ? `Starts ${pl.start_date} · ` : ''}links expire {pl.expires_at}
                        </p>

                        {(!pl.school_done || !pl.parent_done) && (
                          <div className="mt-2 space-y-1 text-xs">
                            {!pl.school_done && (
                              <p className="break-all text-gray-600">
                                <span className="font-semibold">School link:</span>{' '}
                                {base}{pl.school_token}
                              </p>
                            )}
                            {!pl.parent_done && (
                              <p className="break-all text-gray-600">
                                <span className="font-semibold">Parent link:</span>{' '}
                                {base}{pl.parent_token}
                              </p>
                            )}
                          </div>
                        )}

                        <div className="mt-2 flex flex-wrap gap-4 text-xs">
                          {(pl.school_done || pl.parent_done) && (
                            <button
                              type="button"
                              onClick={async () => {
                                if (detail) {
                                  setOpenPlacement(null);
                                  return;
                                }
                                const result = await adminPost({ action: 'placement', id: pl.id });
                                if (result) setOpenPlacement(result);
                              }}
                              className="font-semibold text-primary underline"
                            >
                              {detail ? 'Hide the answers' : 'View the answers'}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={async () => {
                              if (!window.confirm(`Delete ${pl.student_name}'s placement and everything in it? This cannot be undone.`)) return;
                              const result = await adminPost({ action: 'delete-placement', id: pl.id });
                              if (result) {
                                setOpenPlacement(null);
                                setPlacementMsg('Placement deleted.');
                              }
                            }}
                            className="font-semibold text-gray-500 underline"
                          >
                            Delete
                          </button>
                        </div>

                        {detail && (
                          <div className="mt-3 space-y-3 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                            {['schoolSection', 'parentSection'].map((key) =>
                              detail[key] ? (
                                <div key={key}>
                                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    {key === 'schoolSection' ? 'School section' : 'Parent / guardian section'}
                                  </p>
                                  <dl className="mt-1 divide-y divide-gray-100">
                                    {Object.entries(detail[key])
                                      .filter(([, v]) => String(v || '').trim() !== '')
                                      .map(([k, v]) => (
                                        <div key={k} className="flex flex-wrap gap-x-3 py-1 text-sm">
                                          <dt className="w-56 shrink-0 text-gray-500">{labelFor(k)}</dt>
                                          <dd className="text-gray-800">{String(v)}</dd>
                                        </div>
                                      ))}
                                  </dl>
                                </div>
                              ) : null
                            )}
                            <p className="text-xs text-gray-400">
                              Delete this placement once the school&apos;s own
                              retention period is up — there is no reason to keep
                              a child&apos;s medical details longer than needed.
                            </p>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </Section>
          </div>
        )}

        {!needle && tab === 'codes' && (
          <Section
            title={`Discount codes (${codes.length})`}
            hint="Anyone can enter these at booking. Deleting a code stops it working immediately — bookings already made keep their price."
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                adminPost({ action: 'add-code', code: newCode, pct: newPct });
              }}
              className="flex flex-wrap items-center gap-2"
            >
              <input
                type="text"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                placeholder="NEWCODE10"
                className="w-36 rounded-xl border border-gray-200 px-3 py-2 text-sm uppercase focus:border-primary focus:outline-none"
              />
              <select
                value={newPct}
                onChange={(e) => setNewPct(e.target.value)}
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                {[5, 10, 15, 20, 25, 30, 40, 50].map((p) => (
                  <option key={p} value={p}>{p}% off</option>
                ))}
              </select>
              <button
                type="submit"
                disabled={newCode.trim().length < 3}
                className="rounded-xl bg-primary hover:bg-primary-dark disabled:bg-gray-300 px-4 py-2 text-sm font-semibold text-white transition-colors"
              >
                Add code
              </button>
              {codeMsg && <span className="text-sm text-red-600">{codeMsg}</span>}
            </form>
            {codes.length > 0 && (
              <ul className="mt-3 divide-y divide-gray-100">
                {codes.map((c) => (
                  <li key={c.code} className="py-2.5 flex items-baseline justify-between gap-2 text-sm">
                    <span>
                      <span className="font-mono font-bold text-gray-900">{c.code}</span>
                      <span className="ml-2 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                        {c.pct}% off
                      </span>
                      <span className="ml-2 text-gray-400">added {c.created_at}</span>
                    </span>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete ${c.code}? It stops working immediately.`)) {
                          adminPost({ action: 'delete-code', code: c.code });
                        }
                      }}
                      className="text-xs font-semibold text-red-600 underline"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        )}
      </div>
    </div>
  );
}
