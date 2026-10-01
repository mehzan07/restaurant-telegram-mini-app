import React, { useEffect, useMemo, useState } from 'react';

type Status =
  | 'confirmed'
  | 'arrived'
  | 'completed'
  | 'cancelled'
  | 'no-show';

type Reservation = {
  id: string;
  guests: number;
  date: string;
  time: string;
  seatingArea: string;
  fullName: string;
  countryCode: string;
  phone: string;
  email: string;
  specialRequests: string;
  createdAt: string;
  status: Status;
  source: string;
  updatedAt?: string | null;
  adminNotes?: string;
  arrivedAt?: string | null;
};

type FormState = Omit<
  Reservation,
  'id' | 'createdAt' | 'status' | 'source' | 'updatedAt' | 'arrivedAt'
>;

const emptyForm = (): FormState => ({
  guests: 2,
  date: new Date().toISOString().slice(0, 10),
  time: '18:30',
  seatingArea: 'Main Dining Room (Matsal)',
  fullName: '',
  countryCode: '+46',
  phone: '',
  email: '',
  specialRequests: '',
  adminNotes: ''
});

const areas = [
  'Main Dining Room (Matsal)',
  'Window Table',
  'Bar Counter',
  "Chef's Counter",
  'Lounge & Wine Bar'
];

const statuses: Status[] = [
  'confirmed',
  'arrived',
  'completed',
  'cancelled',
  'no-show'
];

const statusLabel = (status: Status) => {
  if (status === 'no-show') {
    return 'Did not arrive';
  }

  return status;
};

export const AdminView: React.FC = () => {
  const [token, setToken] = useState(
    () => sessionStorage.getItem('nordic-admin-token') || ''
  );

  const [password, setPassword] = useState('');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [allReservations, setAllReservations] = useState<Reservation[]>([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [form, setForm] = useState<FormState>(emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const api = async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => ({}));

    if (response.status === 401 && url !== '/api/admin/login') {
      sessionStorage.removeItem('nordic-admin-token');
      setToken('');
      throw new Error('Session expired. Please sign in again.');
    }

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  };

  const load = async () => {
    if (!token) return;

    setBusy(true);

    try {
      const params = new URLSearchParams();

      if (query.trim()) {
        params.set('q', query.trim());
      }

      if (statusFilter !== 'all') {
        params.set('status', statusFilter);
      }

      if (dateFilter) {
        params.set('date', dateFilter);
      }

      // Load the filtered list shown below the dashboard.
      const filteredData = await api(
        `/api/admin/reservations?${params}`
      );

      setReservations(filteredData.reservations || []);

      // Load all reservations separately for the dashboard statistics.
      // No search, status or date filters are applied here.
      const allData = await api('/api/admin/reservations');

      setAllReservations(allData.reservations || []);
    } catch (e) {
      setMessage(
        e instanceof Error ? e.message : 'Unable to load reservations'
      );
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    void load();
  }, [token, statusFilter, dateFilter]);

  const today = new Date().toISOString().slice(0, 10);

  // Dashboard statistics always use ALL reservations.
  // Filters below do not affect these numbers.

  const todayCount = useMemo(
    () =>
      allReservations.filter(
        r => r.date === today && r.status !== 'cancelled'
      ).length,
    [allReservations, today]
  );

  const weekCount = useMemo(() => {
    const current = new Date(`${today}T00:00:00`);
    const day = current.getDay();

    // Monday = first day of the week
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const start = new Date(current);
    start.setDate(current.getDate() + diffToMonday);

    const end = new Date(start);
    end.setDate(start.getDate() + 7);

    return allReservations.filter(r => {
      if (r.status === 'cancelled') return false;

      const reservationDate = new Date(`${r.date}T00:00:00`);

      return reservationDate >= start && reservationDate < end;
    }).length;
  }, [allReservations, today]);

  const monthCount = useMemo(() => {
    const monthPrefix = today.slice(0, 7);

    return allReservations.filter(
      r =>
        r.date.startsWith(monthPrefix) &&
        r.status !== 'cancelled'
    ).length;
  }, [allReservations, today]);

  const totalCount = useMemo(
    () =>
      allReservations.filter(
        r => r.status !== 'cancelled'
      ).length,
    [allReservations]
  );

  const login = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage('');
    setBusy(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      sessionStorage.setItem('nordic-admin-token', data.token);
      setToken(data.token);
      setPassword('');
    } catch (e) {
      setMessage(
        e instanceof Error ? e.message : 'Login failed'
      );
    } finally {
      setBusy(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    setBusy(true);
    setMessage('');

    try {
      if (editingId) {
        await api(
          `/api/admin/reservations/${encodeURIComponent(editingId)}`,
          {
            method: 'PUT',
            body: JSON.stringify(form)
          }
        );

        setMessage(`Reservation ${editingId} updated.`);
      } else {
        const data = await api('/api/admin/reservations', {
          method: 'POST',
          body: JSON.stringify(form)
        });

        setMessage(
          `Reservation ${data.reservation.id} created${
            data.emailSent ? ' and email sent' : ''
          }.`
        );
      }

      setEditingId(null);
      setForm(emptyForm());
      setShowForm(false);

      await load();
    } catch (e) {
      setMessage(
        e instanceof Error ? e.message : 'Unable to save'
      );
    } finally {
      setBusy(false);
    }
  };

  const edit = (r: Reservation) => {
    setEditingId(r.id);

    setForm({
      guests: r.guests,
      date: r.date,
      time: r.time,
      seatingArea: r.seatingArea,
      fullName: r.fullName,
      countryCode: r.countryCode,
      phone: r.phone,
      email: r.email,
      specialRequests: r.specialRequests,
      adminNotes: r.adminNotes || ''
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const changeStatus = async (
    id: string,
    status: Status
  ) => {
    if (
      status === 'cancelled' &&
      !confirm(`Cancel reservation ${id}?`)
    ) {
      return;
    }

    try {
      await api(
        `/api/admin/reservations/${encodeURIComponent(id)}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status })
        }
      );

      setMessage(`${id}: ${statusLabel(status)}`);

      await load();
    } catch (e) {
      setMessage(
        e instanceof Error
          ? e.message
          : 'Unable to change status'
      );
    }
  };

  const remove = async (id: string) => {
    if (
      !confirm(
        `Permanently delete ${id}? Use Cancel for normal customer cancellations. This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await api(
        `/api/admin/reservations/${encodeURIComponent(id)}`,
        {
          method: 'DELETE'
        }
      );

      setMessage(`${id} permanently deleted.`);

      await load();
    } catch (e) {
      setMessage(
        e instanceof Error
          ? e.message
          : 'Unable to delete'
      );
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#091510] flex items-center justify-center p-5">
        <form
          onSubmit={login}
          className="w-full max-w-md bg-[#fbf9f7] rounded-3xl p-7 shadow-2xl"
        >
          <div className="text-xs uppercase tracking-[.25em] text-[#725b38] mb-2">
            Nordic Ember
          </div>

          <h1 className="font-serif text-3xl mb-2">
            Restaurant Admin
          </h1>

          <p className="text-sm text-[#434845] mb-6">
            Private reservation management for restaurant staff.
          </p>

          <label className="text-sm font-semibold">
            Admin password
          </label>

          <input
            autoFocus
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-[#c3c8c3] p-3 bg-white"
          />

          <button
            disabled={busy}
            className="mt-4 w-full rounded-xl bg-[#091510] text-white p-3 font-semibold"
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>

          {message && (
            <p className="mt-4 text-sm text-red-700">
              {message}
            </p>
          )}

          <a
            href="/"
            className="block mt-6 text-center text-sm underline"
          >
            Back to restaurant
          </a>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f3f1] text-[#1b1c1b]">
      <header className="bg-[#091510] text-white px-4 py-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[.22em] text-[#e0c298]">
              Nordic Ember
            </div>

            <h1 className="font-serif text-xl">
              Reservation Admin
            </h1>
          </div>

          <div className="flex gap-2">
            <a
              href="/"
              className="px-3 py-2 text-sm border border-white/30 rounded-lg"
            >
              Restaurant
            </a>

            <button
              onClick={() => {
                sessionStorage.removeItem(
                  'nordic-admin-token'
                );
                setToken('');
              }}
              className="px-3 py-2 text-sm bg-white text-[#091510] rounded-lg"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6">
        {message && (
          <div className="mb-4 rounded-xl bg-white border border-[#c3c8c3] p-3 text-sm">
            {message}
          </div>
        )}

        {/* Reservation overview */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <div className="bg-white rounded-2xl p-4">
            <div className="text-xs text-[#737874]">
              Today
            </div>

            <div className="text-2xl font-semibold">
              {todayCount}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4">
            <div className="text-xs text-[#737874]">
              This week
            </div>

            <div className="text-2xl font-semibold">
              {weekCount}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4">
            <div className="text-xs text-[#737874]">
              This month
            </div>

            <div className="text-2xl font-semibold">
              {monthCount}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4">
            <div className="text-xs text-[#737874]">
              Total
            </div>

            <div className="text-2xl font-semibold">
              {totalCount}
            </div>
          </div>
        </section>

        {/* New reservation */}
        <section className="mb-5">
          <button
            onClick={() => {
              setEditingId(null);
              setForm(emptyForm());
              setShowForm(v => !v);
            }}
            className="bg-[#725b38] text-white rounded-2xl p-4 text-left w-full md:w-auto"
          >
            <div className="text-xs opacity-80">
              Phone / walk-in
            </div>

            <div className="text-lg font-semibold">
              + New reservation
            </div>
          </button>
        </section>

        {showForm && (
          <form
            onSubmit={submit}
            className="bg-white rounded-2xl p-4 md:p-6 mb-5 border border-[#c3c8c3]/60"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-serif text-2xl">
                {editingId
                  ? `Edit ${editingId}`
                  : 'Create reservation'}
              </h2>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-sm underline"
              >
                Close
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              <Field label="Guest name">
                <input
                  required
                  value={form.fullName}
                  onChange={e =>
                    setForm({
                      ...form,
                      fullName: e.target.value
                    })
                  }
                />
              </Field>

              <Field label="Phone">
                <div className="flex">
                  <input
                    className="!w-20"
                    value={form.countryCode}
                    onChange={e =>
                      setForm({
                        ...form,
                        countryCode: e.target.value
                      })
                    }
                  />

                  <input
                    required
                    value={form.phone}
                    onChange={e =>
                      setForm({
                        ...form,
                        phone: e.target.value
                      })
                    }
                  />
                </div>
              </Field>

              <Field label="Email (optional)">
                <input
                  type="email"
                  value={form.email}
                  onChange={e =>
                    setForm({
                      ...form,
                      email: e.target.value
                    })
                  }
                />
              </Field>

              <Field label="Date">
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={e =>
                    setForm({
                      ...form,
                      date: e.target.value
                    })
                  }
                />
              </Field>

              <Field label="Time">
                <input
                  required
                  type="time"
                  value={form.time}
                  onChange={e =>
                    setForm({
                      ...form,
                      time: e.target.value
                    })
                  }
                />
              </Field>

              <Field label="Guests">
                <input
                  required
                  type="number"
                  min="1"
                  max="30"
                  value={form.guests}
                  onChange={e =>
                    setForm({
                      ...form,
                      guests: Number(e.target.value)
                    })
                  }
                />
              </Field>

              <Field label="Seating">
                <select
                  value={form.seatingArea}
                  onChange={e =>
                    setForm({
                      ...form,
                      seatingArea: e.target.value
                    })
                  }
                >
                  {areas.map(a => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </Field>

              <Field label="Special requests">
                <input
                  value={form.specialRequests}
                  onChange={e =>
                    setForm({
                      ...form,
                      specialRequests: e.target.value
                    })
                  }
                />
              </Field>

              <Field label="Internal admin notes">
                <input
                  value={form.adminNotes || ''}
                  onChange={e =>
                    setForm({
                      ...form,
                      adminNotes: e.target.value
                    })
                  }
                />
              </Field>
            </div>

            <button
              disabled={busy}
              className="mt-4 bg-[#091510] text-white rounded-xl px-5 py-3 font-semibold"
            >
              {busy
                ? 'Saving…'
                : editingId
                ? 'Save changes'
                : 'Create reservation'}
            </button>
          </form>
        )}

        <section className="bg-white rounded-2xl p-4 mb-5">
          <div className="grid md:grid-cols-[1fr_auto_auto_auto] gap-3">
            <input
              placeholder="Search name, booking reference, phone or email"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') void load();
              }}
              className="rounded-xl border border-[#c3c8c3] p-3"
            />

            <select
              value={statusFilter}
              onChange={e =>
                setStatusFilter(e.target.value)
              }
              className="rounded-xl border border-[#c3c8c3] p-3"
            >
              <option value="all">All statuses</option>

              {statuses.map(s => (
                <option key={s} value={s}>
                  {statusLabel(s)}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={dateFilter}
              onChange={e =>
                setDateFilter(e.target.value)
              }
              className="rounded-xl border border-[#c3c8c3] p-3"
            />

            <button
              onClick={() => void load()}
              className="rounded-xl bg-[#091510] text-white px-5"
            >
              Search
            </button>
          </div>

          <div className="mt-2 flex gap-3 text-sm">
            <button
              className="underline"
              onClick={() => {
                setDateFilter(today);
              }}
            >
              Today
            </button>

            <button
              className="underline"
              onClick={() => {
                setQuery('');
                setDateFilter('');
                setStatusFilter('all');

                setTimeout(
                  () => void load(),
                  0
                );
              }}
            >
              Clear filters
            </button>
          </div>
        </section>

        <section className="space-y-3">
          {busy && <p>Loading…</p>}

          {!busy && reservations.length === 0 && (
            <div className="bg-white rounded-2xl p-8 text-center">
              No reservations found.
            </div>
          )}

          {reservations.map(r => (
            <article
              key={r.id}
              className={`bg-white rounded-2xl p-4 border ${
                r.status === 'cancelled'
                  ? 'opacity-60 border-red-200'
                  : 'border-[#c3c8c3]/50'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif text-xl">
                      {r.fullName}
                    </h3>

                    <Badge>
                      {statusLabel(r.status)}
                    </Badge>

                    <Badge>{r.source}</Badge>
                  </div>

                  <div className="font-mono text-xs text-[#725b38] mt-1">
                    {r.id}
                  </div>

                  <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-1 text-sm">
                    <span>
                      <b>{r.date}</b> · {r.time}
                    </span>

                    <span>
                      {r.guests} guest
                      {r.guests === 1 ? '' : 's'}
                    </span>

                    <span>{r.seatingArea}</span>

                    <span>
                      {r.countryCode} {r.phone}
                    </span>

                    <span className="break-all">
                      {r.email || 'No email'}
                    </span>

                    {r.specialRequests && (
                      <span className="sm:col-span-2">
                        Request: {r.specialRequests}
                      </span>
                    )}

                    {r.adminNotes && (
                      <span className="sm:col-span-2">
                        Admin: {r.adminNotes}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 md:justify-end">
                  <button
                    onClick={() => edit(r)}
                    className="px-3 py-2 rounded-lg border"
                  >
                    Edit
                  </button>

                  {r.status !== 'arrived' && (
                    <button
                      onClick={() =>
                        void changeStatus(
                          r.id,
                          'arrived'
                        )
                      }
                      className="px-3 py-2 rounded-lg bg-[#d8e6dc]"
                    >
                      Check in
                    </button>
                  )}

                  <select
                    value={r.status}
                    onChange={e =>
                      void changeStatus(
                        r.id,
                        e.target.value as Status
                      )
                    }
                    className="px-2 py-2 rounded-lg border"
                  >
                    {statuses.map(s => (
                      <option key={s} value={s}>
                        {statusLabel(s)}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => void remove(r.id)}
                    className="px-3 py-2 rounded-lg text-red-700 border border-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

const Field: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => (
  <label className="text-sm font-semibold flex flex-col gap-1 [&_input]:font-normal [&_input]:rounded-xl [&_input]:border [&_input]:border-[#c3c8c3] [&_input]:p-3 [&_select]:font-normal [&_select]:rounded-xl [&_select]:border [&_select]:border-[#c3c8c3] [&_select]:p-3">
    {label}
    {children}
  </label>
);

const Badge: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <span className="text-[10px] uppercase tracking-wide rounded-full bg-[#f5f3f1] border px-2 py-1">
    {children}
  </span>
);