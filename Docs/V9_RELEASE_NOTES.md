# Nordic Ember V9 — Release Notes

V9 adds restaurant-side reservation operations on top of the V8 Railway + Resend + Telegram production architecture.

## Added

- Private `/admin` GUI
- Password-protected admin login
- Manual phone/walk-in reservation creation
- Search by booking reference, name, phone, or email
- Date and status filters
- Reservation editing
- Soft cancellation
- Guest check-in
- Completed and no-show statuses
- Permanent deletion with confirmation
- Internal admin notes
- Today's booking and guest totals
- Automatic SQLite schema migration
- Protected admin reservation API
- Admin configuration documentation

## Environment variables

- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
