import nodemailer from 'nodemailer';
import { Resend } from 'resend';

type ReservationEmailData = {
  id: string;
  guests: number;
  date: string;
  time: string;
  seatingArea: string;
  fullName: string;
  email: string;
  specialRequests: string;
};

// ---------------------------------------------------------
// Build reservation email text
// ---------------------------------------------------------

function buildReservationEmail(reservation: ReservationEmailData) {
  return `
Hello ${reservation.fullName},

Thank you for your reservation at Nordic Ember.

Booking reference: ${reservation.id}
Date: ${reservation.date}
Time: ${reservation.time}
Guests: ${reservation.guests}
Seating area: ${reservation.seatingArea}

${
  reservation.specialRequests
    ? `Special requests: ${reservation.specialRequests}`
    : ''
}

Please keep your booking reference if you need to contact the restaurant about your reservation.

Best regards,
Nordic Ember
  `.trim();
}

// ---------------------------------------------------------
// Send using Resend
// Used on Railway when RESEND_API_KEY is configured
// ---------------------------------------------------------

async function sendWithResend(
  reservation: ReservationEmailData,
  apiKey: string
) {
  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from: 'Nordic Ember <onboarding@resend.dev>',
    to: reservation.email,
    subject: `Nordic Ember - Reservation ${reservation.id}`,
    text: buildReservationEmail(reservation),
  });

  if (error) {
    throw new Error(
      `Resend email failed: ${error.message}`
    );
  }

  console.log(
    `Reservation confirmation email sent with Resend to ${reservation.email}`
  );

  return {
    sent: true,
    provider: 'resend',
    id: data?.id,
  };
}

// ---------------------------------------------------------
// Send using SMTP / Nodemailer
// Used locally when RESEND_API_KEY is not configured
// ---------------------------------------------------------

async function sendWithSmtp(
  reservation: ReservationEmailData
) {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_FROM,
  } = process.env;

  if (
    !SMTP_HOST ||
    !SMTP_PORT ||
    !SMTP_USER ||
    !SMTP_PASS ||
    !SMTP_FROM
  ) {
    console.log(
      'Email not sent: SMTP environment variables are not configured.'
    );

    return {
      sent: false,
      provider: 'smtp',
      reason: 'SMTP_NOT_CONFIGURED',
    };
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,

    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },

    // Prevent SMTP problems from freezing the reservation flow.
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
  });

  await transporter.sendMail({
    from: SMTP_FROM,
    to: reservation.email,
    subject: `Nordic Ember - Reservation ${reservation.id}`,
    text: buildReservationEmail(reservation),
  });

  console.log(
    `Reservation confirmation email sent with SMTP to ${reservation.email}`
  );

  return {
    sent: true,
    provider: 'smtp',
  };
}

// ---------------------------------------------------------
// Main email function
//
// Railway:
//   RESEND_API_KEY exists -> Resend
//
// Local development:
//   No RESEND_API_KEY -> SMTP / Gmail
// ---------------------------------------------------------

export async function sendReservationConfirmation(
  reservation: ReservationEmailData
) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey) {
    console.log(
      'Email provider: Resend'
    );

    return sendWithResend(
      reservation,
      resendApiKey
    );
  }

  console.log(
    'Email provider: SMTP'
  );

  return sendWithSmtp(reservation);
}