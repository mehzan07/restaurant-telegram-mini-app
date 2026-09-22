import nodemailer from 'nodemailer';

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
  });

  await transporter.sendMail({
    from: SMTP_FROM,
    to: reservation.email,
    subject: `Test Restaurang - Reservation ${reservation.id}`,

    text: `
Hello ${reservation.fullName},

Thank you for your reservation at Test Restaurang.

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
Test Restaurang
    `.trim(),
  });

  console.log(
    `Reservation confirmation email sent to ${reservation.email}`
  );

  return {
    sent: true,
  };
}