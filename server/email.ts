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

export async function sendReservationConfirmation(
  reservation: ReservationEmailData
) {
  // -------------------------------------------------------
  // Railway / Production: use Resend
  // -------------------------------------------------------

  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey) {
    const resend = new Resend(resendApiKey);

    const fromAddress =
      process.env.RESEND_FROM ||
      'Nordic Ember <booking@restaurant.softsolutionsahand.com>';

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: reservation.email,
      subject: `Nordic Ember - Reservation ${reservation.id}`,

      text: `
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
      `.trim(),
    });

    if (error) {
      console.error('Resend email error:', error);

      return {
        sent: false,
        reason: 'RESEND_ERROR',
      };
    }

    console.log(
      `Reservation confirmation email sent with Resend to ${reservation.email}`
    );

    console.log('Resend email ID:', data?.id);

    return {
      sent: true,
    };
  }

  // -------------------------------------------------------
  // Local development: use SMTP
  // -------------------------------------------------------

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
      'Email not sent: neither Resend nor SMTP is configured.'
    );

    return {
      sent: false,
      reason: 'EMAIL_NOT_CONFIGURED',
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

    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
  });

  await transporter.sendMail({
    from: SMTP_FROM,
    to: reservation.email,
    subject: `Nordic Ember - Reservation ${reservation.id}`,

    text: `
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
    `.trim(),
  });

  console.log(
    `Reservation confirmation email sent with SMTP to ${reservation.email}`
  );

  return {
    sent: true,
  };
}