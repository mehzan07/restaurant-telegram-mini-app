import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomInt } from 'node:crypto';
import { db } from './database.js';
import { sendReservationConfirmation } from './email.js';
import 'dotenv/config';
import './telegram';

const app = express();
const PORT = Number(process.env.PORT) || 3001;
app.use(express.json());

// ---------------------------------------------------------
// Reservation configuration
// ---------------------------------------------------------

const ALLOWED_TIMES = [
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '20:00',
  '20:45',
];

const ALLOWED_SEATING_AREAS = [
  'Main Dining Room',
  'Main Dining Room (Matsal)',
  'Matsal',
  'Window Table',
  'Fönsterbord',
  'Bar Counter',
  'Bardisk',
   "Chef's Counter",
   'Lounge & Wine Bar',
];

const ALLOWED_COUNTRY_CODES = [
  '+46',
  '+47',
  '+45',
  '+358',
  '+44',
  '+1',
  '+49',
];

// ---------------------------------------------------------
// Health check
// ---------------------------------------------------------

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Nordic Ember reservation API is running',
  });
});

// ---------------------------------------------------------
// Create reservation
// ---------------------------------------------------------

app.post('/api/reservations', async (req, res) => {
  try {
    const {
      guests,
      date,
      time,
      seatingArea,
      fullName,
      countryCode,
      phone,
      email,
      specialRequests,
    } = req.body ?? {};

    // -------------------------------------------------------
    // Full name validation
    // -------------------------------------------------------

    if (
      typeof fullName !== 'string' ||
      fullName.trim().length < 2 ||
      fullName.trim().length > 100
    ) {
      return res.status(400).json({
        error: 'Full name must contain between 2 and 100 characters',
      });
    }

    // -------------------------------------------------------
    // Email validation
    // -------------------------------------------------------

    if (typeof email !== 'string') {
      return res.status(400).json({
        error: 'A valid email address is required',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      normalizedEmail.length > 254 ||
      !emailPattern.test(normalizedEmail)
    ) {
      return res.status(400).json({
        error: 'A valid email address is required',
      });
    }

    // -------------------------------------------------------
    // Phone validation
    // -------------------------------------------------------

    if (typeof phone !== 'string') {
      return res.status(400).json({
        error: 'A valid phone number is required',
      });
    }

    const normalizedPhone = phone.trim();

    if (
      normalizedPhone.length < 6 ||
      normalizedPhone.length > 30 ||
      !/^[0-9 ()+\-]+$/.test(normalizedPhone)
    ) {
      return res.status(400).json({
        error: 'A valid phone number is required',
      });
    }

    // -------------------------------------------------------
    // Country code validation
    // -------------------------------------------------------

    const normalizedCountryCode =
      typeof countryCode === 'string'
        ? countryCode.trim()
        : '+46';

    if (!ALLOWED_COUNTRY_CODES.includes(normalizedCountryCode)) {
      return res.status(400).json({
        error: 'Invalid country code',
      });
    }

    // -------------------------------------------------------
    // Guest count validation
    // Online reservations support 1-8 guests.
    // -------------------------------------------------------

    const numericGuests =
      typeof guests === 'number'
        ? guests
        : Number(guests);

    if (
      !Number.isInteger(numericGuests) ||
      numericGuests < 1 ||
      numericGuests > 8
    ) {
      return res.status(400).json({
        error: 'Online reservations are available for 1 to 8 guests',
      });
    }

    // -------------------------------------------------------
    // Date validation
    // Database date format must be YYYY-MM-DD.
    // -------------------------------------------------------

    if (
      typeof date !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date)
    ) {
      return res.status(400).json({
        error: 'Reservation date must use YYYY-MM-DD format',
      });
    }

    const reservationDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(reservationDate.getTime())) {
      return res.status(400).json({
        error: 'Invalid reservation date',
      });
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (reservationDate < today) {
      return res.status(400).json({
        error: 'Reservation date cannot be in the past',
      });
    }

    // -------------------------------------------------------
    // Time validation
    // -------------------------------------------------------

    if (
      typeof time !== 'string' ||
      !ALLOWED_TIMES.includes(time)
    ) {
      return res.status(400).json({
        error: 'Invalid reservation time',
      });
    }

    // -------------------------------------------------------
    // Seating area validation
    // -------------------------------------------------------

    if (
      typeof seatingArea !== 'string' ||
      !ALLOWED_SEATING_AREAS.includes(seatingArea)
    ) {
      return res.status(400).json({
        error: 'Invalid seating area',
      });
    }

    // -------------------------------------------------------
    // Special requests validation
    // -------------------------------------------------------

    if (
      specialRequests !== undefined &&
      typeof specialRequests !== 'string'
    ) {
      return res.status(400).json({
        error: 'Special requests must be text',
      });
    }

    const normalizedSpecialRequests =
      typeof specialRequests === 'string'
        ? specialRequests.trim()
        : '';

    if (normalizedSpecialRequests.length > 1000) {
      return res.status(400).json({
        error: 'Special requests cannot exceed 1000 characters',
      });
    }

    // -------------------------------------------------------
    // Generate reservation reference on the backend
    // -------------------------------------------------------

    const reservationReference =
      `TR-${Date.now().toString(36).toUpperCase()}-${randomInt(
        1000,
        10000
      )}`;

    const reservation = {
      id: reservationReference,
      guests: numericGuests,
      date,
      time,
      seatingArea,
      fullName: fullName.trim(),
      countryCode: normalizedCountryCode,
      phone: normalizedPhone,
      email: normalizedEmail,
      specialRequests: normalizedSpecialRequests,
      createdAt: new Date().toISOString(),
    };

    // -------------------------------------------------------
    // Save reservation in SQLite
    // -------------------------------------------------------

    const insertReservation = db.prepare(`
      INSERT INTO reservations (
        id,
        guests,
        date,
        time,
        seating_area,
        full_name,
        country_code,
        phone,
        email,
        special_requests,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertReservation.run(
      reservation.id,
      String(reservation.guests),
      reservation.date,
      reservation.time,
      reservation.seatingArea,
      reservation.fullName,
      reservation.countryCode,
      reservation.phone,
      reservation.email,
      reservation.specialRequests,
      reservation.createdAt
    );

    console.log('Reservation saved:', reservation);

// -------------------------------------------------------
// Send confirmation email
// -------------------------------------------------------

let emailSent = false;

try {
  const emailResult = await sendReservationConfirmation(reservation);
  emailSent = emailResult.sent;
} catch (emailError) {
  console.error(
    'Reservation was saved, but confirmation email failed:',
    emailError
  );
}

// -------------------------------------------------------
// Return successful reservation response
// -------------------------------------------------------

return res.status(201).json({
  success: true,
  message: emailSent
    ? 'Reservation created and confirmation email sent'
    : 'Reservation created, but confirmation email was not sent',
  reservation,
  emailSent,
});

  } catch (error) {
    console.error('Reservation API error:', error);

    return res.status(500).json({
      error: 'Unable to create reservation',
    });
  }
});

// ---------------------------------------------------------
// V9 Restaurant Admin API
// ---------------------------------------------------------

import { createHash, timingSafeEqual } from 'node:crypto';

const ADMIN_SESSION_HOURS = 8;
const adminPassword = process.env.ADMIN_PASSWORD ?? '';
const adminSecret = process.env.ADMIN_SESSION_SECRET || adminPassword;

const safeEqual = (a: string, b: string) => {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  return aa.length === bb.length && timingSafeEqual(aa, bb);
};

const makeAdminToken = (expiresAt: number) => {
  const payload = String(expiresAt);
  const signature = createHash('sha256').update(`${payload}:${adminSecret}`).digest('hex');
  return `${payload}.${signature}`;
};

const verifyAdminToken = (token: string) => {
  if (!adminPassword || !adminSecret) return false;
  const [expires, signature] = token.split('.');
  const expiresAt = Number(expires);
  if (!expires || !signature || !Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;
  return safeEqual(makeAdminToken(expiresAt), token);
};

const requireAdmin: express.RequestHandler = (req, res, next) => {
  const auth = req.header('authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!verifyAdminToken(token)) return res.status(401).json({ error: 'Admin authentication required' });
  next();
};

app.post('/api/admin/login', (req, res) => {
  if (!adminPassword) {
    return res.status(503).json({ error: 'ADMIN_PASSWORD is not configured on the server' });
  }
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!safeEqual(password, adminPassword)) return res.status(401).json({ error: 'Invalid password' });
  const expiresAt = Date.now() + ADMIN_SESSION_HOURS * 60 * 60 * 1000;
  return res.json({ success: true, token: makeAdminToken(expiresAt), expiresAt });
});

const reservationSelect = `
  SELECT id, CAST(guests AS INTEGER) AS guests, date, time,
    seating_area AS seatingArea, full_name AS fullName,
    country_code AS countryCode, phone, email,
    special_requests AS specialRequests, created_at AS createdAt,
    COALESCE(status, 'confirmed') AS status,
    COALESCE(source, 'online') AS source,
    updated_at AS updatedAt,
    COALESCE(admin_notes, '') AS adminNotes,
    arrived_at AS arrivedAt
  FROM reservations`;


app.get('/api/admin/reservations', requireAdmin, (req, res) => {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const status = typeof req.query.status === 'string' ? req.query.status.trim() : '';
    const date = typeof req.query.date === 'string' ? req.query.date.trim() : '';

    const where: string[] = [];
    const params: unknown[] = [];

    if (q) {
      const like = `%${q.toLowerCase()}%`;
      const phoneDigits = q.replace(/\D/g, '');

      if (phoneDigits.length >= 6) {
        let internationalPhone = phoneDigits;

        // Swedish local format:
        // 0730318625 -> 46730318625
        if (phoneDigits.startsWith('0')) {
          internationalPhone = `46${phoneDigits.substring(1)}`;
        }

        // Database stores:
        // country_code = +46
        // phone        = 730318625
        //
        // The SQL expression below creates:
        // 46730318625
        const fullPhoneSql = `
          REPLACE(
            REPLACE(
              REPLACE(
                REPLACE(
                  REPLACE(
                    COALESCE(country_code, '') || COALESCE(phone, ''),
                    '+', ''
                  ),
                  ' ', ''
                ),
                '-', ''
              ),
              '(', ''
            ),
            ')', ''
          )
        `;

        where.push(`(
          LOWER(id) LIKE ?
          OR LOWER(full_name) LIKE ?
          OR LOWER(email) LIKE ?
          OR ${fullPhoneSql} LIKE ?
        )`);

        params.push(
          like,
          like,
          like,
          `%${internationalPhone}%`
        );
      } else {
        where.push(`(
          LOWER(id) LIKE ?
          OR LOWER(full_name) LIKE ?
          OR LOWER(phone) LIKE ?
          OR LOWER(email) LIKE ?
        )`);

        params.push(like, like, like, like);
      }
    }

    if (status && status !== 'all') {
      where.push('status = ?');
      params.push(status);
    }

    if (date) {
      where.push('date = ?');
      params.push(date);
    }

    const sql = `${reservationSelect} ${
      where.length ? `WHERE ${where.join(' AND ')}` : ''
    } ORDER BY date ASC, time ASC, created_at DESC`;

    const reservations = db.prepare(sql).all(...params);

    return res.json({
      success: true,
      reservations
    });
  } catch (error) {
    console.error('Admin reservation search failed:', error);
    return res.status(500).json({
      error: 'Unable to read reservations'
    });
  }
});



app.post('/api/admin/reservations', requireAdmin, async (req, res) => {
  try {
    const b = req.body ?? {};
    const guests = Number(b.guests);
    if (!Number.isInteger(guests) || guests < 1 || guests > 30) return res.status(400).json({ error: 'Guests must be between 1 and 30' });
    if (typeof b.fullName !== 'string' || b.fullName.trim().length < 2) return res.status(400).json({ error: 'Guest name is required' });
    if (typeof b.phone !== 'string' || b.phone.trim().length < 6) return res.status(400).json({ error: 'Phone number is required' });
    if (typeof b.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(b.date)) return res.status(400).json({ error: 'Valid date is required' });
    if (typeof b.time !== 'string' || !/^\d{2}:\d{2}$/.test(b.time)) return res.status(400).json({ error: 'Valid time is required' });
    const id = `TR-${Date.now().toString(36).toUpperCase()}-${randomInt(1000, 10000)}`;
    const now = new Date().toISOString();
    const email = typeof b.email === 'string' ? b.email.trim().toLowerCase() : '';
    const reservation = {
      id, guests, date: b.date, time: b.time,
      seatingArea: String(b.seatingArea || 'Main Dining Room (Matsal)'),
      fullName: b.fullName.trim(), countryCode: String(b.countryCode || '+46'),
      phone: b.phone.trim(), email,
      specialRequests: typeof b.specialRequests === 'string' ? b.specialRequests.trim() : '',
      createdAt: now,
    };
    db.prepare(`INSERT INTO reservations
      (id, guests, date, time, seating_area, full_name, country_code, phone, email, special_requests, created_at, status, source, updated_at, admin_notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', 'phone', ?, ?)`)
      .run(id, String(guests), reservation.date, reservation.time, reservation.seatingArea, reservation.fullName,
        reservation.countryCode, reservation.phone, reservation.email, reservation.specialRequests, now, now,
        typeof b.adminNotes === 'string' ? b.adminNotes.trim() : '');
    let emailSent = false;
    if (email) {
      try { emailSent = (await sendReservationConfirmation(reservation)).sent; } catch (e) { console.error('Admin booking email failed:', e); }
    }
    return res.status(201).json({ success: true, reservation: { ...reservation, status: 'confirmed', source: 'phone' }, emailSent });
  } catch (error) {
    console.error('Admin create failed:', error);
    return res.status(500).json({ error: 'Unable to create reservation' });
  }
});

app.put('/api/admin/reservations/:id', requireAdmin, (req, res) => {
  try {
    const b = req.body ?? {};
    const guests = Number(b.guests);
    if (!Number.isInteger(guests) || guests < 1 || guests > 30) return res.status(400).json({ error: 'Guests must be between 1 and 30' });
    const result = db.prepare(`UPDATE reservations SET
      guests=?, date=?, time=?, seating_area=?, full_name=?, country_code=?, phone=?, email=?,
      special_requests=?, admin_notes=?, updated_at=? WHERE id=?`)
      .run(String(guests), String(b.date), String(b.time), String(b.seatingArea), String(b.fullName).trim(),
        String(b.countryCode || '+46'), String(b.phone).trim(), String(b.email || '').trim().toLowerCase(),
        String(b.specialRequests || '').trim(), String(b.adminNotes || '').trim(), new Date().toISOString(), req.params.id);
    if (!result.changes) return res.status(404).json({ error: 'Reservation not found' });
    return res.json({ success: true });
  } catch (error) { console.error('Admin update failed:', error); return res.status(500).json({ error: 'Unable to update reservation' }); }
});

app.patch('/api/admin/reservations/:id/status', requireAdmin, (req, res) => {
  const allowed = ['confirmed', 'arrived', 'completed', 'cancelled', 'no-show'];
  const status = String(req.body?.status || '');
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid reservation status' });
  const now = new Date().toISOString();
  const result = db.prepare(`UPDATE reservations SET status=?, updated_at=?, arrived_at=CASE WHEN ?='arrived' THEN ? ELSE arrived_at END WHERE id=?`)
    .run(status, now, status, now, req.params.id);
  if (!result.changes) return res.status(404).json({ error: 'Reservation not found' });
  return res.json({ success: true });
});

app.delete('/api/admin/reservations/:id', requireAdmin, (req, res) => {
  const result = db.prepare('DELETE FROM reservations WHERE id = ?').run(req.params.id);
  if (!result.changes) return res.status(404).json({ error: 'Reservation not found' });
  return res.json({ success: true });
});

// ---------------------------------------------------------
// Serve the React/Vite production frontend
// ---------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

app.use(express.static(distPath));

// React SPA fallback.
// API routes above are handled first; all other GET requests
// return the React application.
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// ---------------------------------------------------------
// Start server
// ---------------------------------------------------------

app.listen(PORT, () => {
  console.log(
    `Nordic Ember API running at http://localhost:${PORT}`
  );
});