# Nordic Ember V9 — Restaurant Admin Manual

## Purpose

The private `/admin` interface lets restaurant staff manage reservations without editing SQLite manually.

## Production setup

Add these Railway Variables before using the admin page:

- `ADMIN_PASSWORD` — a strong unique password for restaurant staff.
- `ADMIN_SESSION_SECRET` — a different long random secret used to sign admin sessions.

Do not commit either value to GitHub.

## Open the admin interface

Open the production application followed by `/admin`, then sign in with the configured admin password.

## Main workflows

### Phone or walk-in reservation

Choose **+ New reservation**, enter guest/contact details, date, time, guest count and seating area, then save. Email is optional for staff-created reservations. If an email address is supplied, Nordic Ember attempts to send the normal reservation confirmation.

### Find a reservation

Search by booking reference, guest name, phone number, or email. Staff can also filter by date and status.

### Change a reservation

Choose **Edit**, change the required fields, and save. This updates the existing database record rather than creating a second booking.

### Customer cancellation

Change the status to **cancelled**. This is preferred over permanent deletion because the restaurant retains the booking history.

### Guest arrival

Choose **Check in**. The status changes to **arrived** and the arrival time is recorded.

### Finish or mark no-show

Use **completed** after service, or **no-show** when the guest does not arrive.

### Permanent deletion

Use **Delete** only when a record truly must be removed. The interface asks for confirmation because this action cannot be undone.

## Reservation statuses

- `confirmed` — active booking
- `arrived` — guest checked in
- `completed` — visit completed
- `cancelled` — booking cancelled but retained in history
- `no-show` — guest did not arrive

## Database migration

V9 keeps the existing V8 `reservations` table and automatically adds missing columns on application startup:

- `status`
- `source`
- `updated_at`
- `admin_notes`
- `arrived_at`

Existing reservations remain intact and default to `confirmed` / `online`.

## Security

The old public reservation-list endpoint has been removed. Reservation management endpoints now require an authenticated admin session. Admin tokens expire after eight hours and are stored in browser session storage.
