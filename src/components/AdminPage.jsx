import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * The one-van admin: upcoming jobs, past customers, quotes worth chasing,
 * and who is due a re-clean reminder. Read-only on purpose — the diary of
 * record is still you; this is the memory your inbox doesn't have.
 */
export default function AdminPage() {
  const [password, setPassword] = useState(
    () => sessionStorage.getItem('wcc-admin') || ''
  );
  const [entered, setEntered] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async (pw) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin', {
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

  const Section = ({ title, hint, children }) => (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 md:p-6">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      {hint && <p className="mt-0.5 text-sm text-gray-500">{hint}</p>}
      <div className="mt-3">{children}</div>
    </div>
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

  const BookingRow = ({ b }) => (
    <li>
      <details className="group py-1">
        <summary className="cursor-pointer list-none py-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-lg px-2 -mx-2 hover:bg-gray-50">
          <div>
            <p className="font-semibold text-gray-900">
              {b.slot_date} <span className="text-gray-500">{b.slot_time}</span>
              {b.kind === 'booking-paid' && (
                <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                  paid
                </span>
              )}
              <span className="ml-2 text-xs font-normal text-gray-400 group-open:hidden">
                tap for details
              </span>
            </p>
            <p className="text-sm text-gray-600">{b.name}</p>
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
          <Detail label="Payment">
            {b.kind === 'booking-paid' ? 'Paid via Klarna' : `${b.total} on the day — cash or card`}
          </Detail>
          <Detail label="Booked on">{b.booked_at}</Detail>
        </div>
      </details>
    </li>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20 px-4">
      <Helmet>
        <title>Admin | Wirral Carpet Cleaning</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Wirral Carpet Cleaning — Admin</h1>
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

        <Section title={`Upcoming jobs (${data.upcoming.length})`}>
          {data.upcoming.length === 0 ? (
            <Empty>Nothing booked in. New bookings appear here automatically.</Empty>
          ) : (
            <ul className="divide-y divide-gray-100">
              {data.upcoming.map((b) => <BookingRow key={b.id} b={b} />)}
            </ul>
          )}
        </Section>

        <Section
          title={`Due a re-clean reminder (${data.due.length})`}
          hint="Last cleaned over 9 months ago — a 'your carpets are due' text to these is the easiest work you'll ever win."
        >
          {data.due.length === 0 ? (
            <Empty>Nobody yet — this fills up as booking history builds.</Empty>
          ) : (
            <ul className="divide-y divide-gray-100">
              {data.due.map((c) => (
                <li key={c.phone} className="py-2.5 flex flex-wrap items-baseline justify-between gap-2 text-sm">
                  <span>
                    <span className="font-semibold text-gray-900">{c.name}</span>{' '}
                    <a href={`tel:${c.phone}`} className="font-semibold text-primary underline">{c.phone}</a>
                    <span className="text-gray-500"> · {c.postcode}</span>
                  </span>
                  <span className="text-gray-500">last clean {c.last_clean}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section
          title={`Quotes — last 30 days (${data.quotes.length})`}
          hint="Everyone who unlocked a price. Un-booked ones are a text away from being a job."
        >
          {data.quotes.length === 0 ? (
            <Empty>No quotes yet.</Empty>
          ) : (
            <ul className="divide-y divide-gray-100">
              {data.quotes.map((q) => (
                <li key={q.id}>
                  <details className="group">
                    <summary className="cursor-pointer list-none py-2.5 flex flex-wrap items-baseline justify-between gap-2 text-sm rounded-lg px-2 -mx-2 hover:bg-gray-50">
                      <span className="font-semibold text-gray-900">{q.name}</span>
                      <span className="flex items-center gap-2">
                        {q.booked ? (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">booked</span>
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
                      {q.postcode && <Detail label="Postcode">{q.postcode}</Detail>}
                      <Detail label="Quoted for">
                        {String(q.items).split(', ').map((line) => (
                          <span key={line} className="block">{line}</span>
                        ))}
                      </Detail>
                      <Detail label="Quoted price">{q.total}</Detail>
                      <Detail label="When">{q.created_at}</Detail>
                      <Detail label="Status">{q.booked ? 'Went on to book' : 'Not booked — worth a text'}</Detail>
                    </div>
                  </details>
                </li>
              ))}
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
                <li key={c.phone} className="py-2.5 flex flex-wrap items-baseline justify-between gap-2 text-sm">
                  <span>
                    <span className="font-semibold text-gray-900">{c.name}</span>{' '}
                    <a href={`tel:${c.phone}`} className="font-semibold text-primary underline">{c.phone}</a>
                    <span className="text-gray-500"> · {c.postcode}</span>
                  </span>
                  <span className="text-gray-500">
                    {c.bookings} clean{c.bookings === 1 ? '' : 's'} · last {c.last_clean}
                  </span>
                </li>
              ))}
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
    </div>
  );
}
