import express from 'express';
import { randomInt } from 'node:crypto';
import { db } from './database.js';

const app = express();
const PORT = 3001;

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
    message: 'Test Restaurang reservation API is running',
  });
});

// ---------------------------------------------------------
// Create reservation
// ---------------------------------------------------------

app.post('/api/reservations', (req, res) => {
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

    return res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      reservation,
    });
  } catch (error) {
    console.error('Reservation API error:', error);

    return res.status(500).json({
      error: 'Unable to create reservation',
    });
  }
});

// ---------------------------------------------------------
// Get all reservations
//
// DEVELOPMENT / TESTING ONLY.
//
// This endpoint exposes customer information.
// It must be protected or removed before production.
// ---------------------------------------------------------

app.get('/api/reservations', (_req, res) => {
  try {
    const reservations = db
      .prepare(`
        SELECT
          id,
          guests,
          date,
          time,
          seating_area AS seatingArea,
          full_name AS fullName,
          country_code AS countryCode,
          phone,
          email,
          special_requests AS specialRequests,
          created_at AS createdAt
        FROM reservations
        ORDER BY created_at DESC
      `)
      .all();

    return res.json({
      success: true,
      count: reservations.length,
      reservations,
    });
  } catch (error) {
    console.error('Unable to read reservations:', error);

    return res.status(500).json({
      error: 'Unable to read reservations',
    });
  }
});

// ---------------------------------------------------------
// Start server
// ---------------------------------------------------------

app.listen(PORT, () => {
  console.log(
    `Test Restaurang API running at http://localhost:${PORT}`
  );
});