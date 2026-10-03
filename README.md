# Nordic Ember — Restaurant Telegram Mini App

Nordic Ember is a full-stack restaurant application built as a practical example of developing a modern web application and integrating it with Telegram as a Mini App.

Customers can browse the restaurant, explore the menu, view dishes, make table reservations, view reservation information, contact the restaurant, and use the application from a normal browser or from Telegram.

## Current Version Status

The project currently includes the V9 administration functionality and the V10 configurable customer UI language feature.

### V9 — Restaurant Admin Reservation Management

The Admin Dashboard includes:

- secure administrator login;
- Today, This week, This month and Total reservation statistics;
- reservation search and filtering;
- reservation creation by staff;
- reservation editing;
- reservation status management;
- reservation deletion;
- return navigation between the restaurant application and Admin Dashboard.

Supported reservation statuses are:

- Confirmed
- Arrived
- Completed
- Cancelled
- Did not arrive

### V10 — Configurable Customer UI Languages

The administrator can now control which customer-facing interface languages are visible without changing source code and without running a script again.

Supported UI languages:

- English (`EN`)
- Swedish (`SV`)
- Farsi (`FA`)
- Turkish (`TR`)

Default configuration:

```text
English   ✓
Swedish   ✓
Farsi     ✗
Turkish   ✗
```

The setting is stored in the SQLite database, so it is retained after the application is restarted.

The customer language selector only shows the languages currently enabled by the administrator.

At least one language must always remain enabled.

The restaurant's menu and other restaurant content remain separate from this setting; the feature controls the customer interface language selector.

## Technology Overview

### Frontend

- React
- TypeScript
- Vite

### Backend

- Node.js
- Express
- TypeScript

### Database

- SQLite
- persistent application settings and reservation storage

### Telegram

- Telegram Bot API
- Telegram bot: `@NordicEmberBot`
- `/start`
- `/help`
- Telegram Mini App integration

### Production services

- GitHub — source control
- Railway — production hosting
- Resend — production reservation email delivery
- Miss Hosting — DNS management for `softsolutionsahand.com`

## Architecture

```text
Customer
   ↓
Browser or Telegram
   ↓
Nordic Ember Mini App
   ↓
React / TypeScript frontend
   ↓
Express / Node.js backend
   ├── Reservation API
   ├── Admin API
   ├── Language configuration API
   ├── SQLite database
   └── Resend email delivery
```

Telegram is the customer entry point when the application is opened through `@NordicEmberBot`.

## Project Structure

```text
restaurant-telegram-mini-app/
│
├── src/
│   ├── components/
│   ├── data/
│   └── views/
│
├── server/
│   ├── index.ts
│   ├── database.ts
│   ├── email.ts
│   └── telegram.ts
│
├── public/
├── data/
├── Docs/
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Important Files

| Purpose | Main file |
|---|---|
| Main application state/routing | `App.tsx` |
| Restaurant and menu data | `src/data/restaurantData.ts` |
| Shared types | `src/types.ts` |
| Header and language selector | `src/components/Header.tsx` |
| Reservation page | `src/views/BookTableView.tsx` |
| Admin dashboard | `src/views/AdminView.tsx` |
| Backend/API/database integration | `server/index.ts` |
| SQLite handling | `server/database.ts` |
| Reservation email | `server/email.ts` |
| Telegram integration | `server/telegram.ts` |

## Configurable Language Feature

The one-time developer installation of the feature added persistent language settings to the application.

The implementation uses the following endpoints:

```text
GET  /api/config/languages
GET  /api/admin/languages
PUT  /api/admin/languages
```

The public endpoint supplies the customer-facing language selector configuration.

The Admin endpoints require administrator authentication.

The language configuration is stored in the SQLite `app_settings` table under the `visible_languages` key.

### Administrator workflow

1. Open the Admin Dashboard.
2. Open the language configuration area.
3. Enable or disable languages.
4. Keep at least one language enabled.
5. Click **Save language settings**.
6. Open or refresh the restaurant application.
7. Confirm that the customer language selector shows only the selected languages.

No source-code change is required for normal restaurant administration.

## Development

Install dependencies:

```powershell
npm install
```

Run the frontend development environment using the project command:

```powershell
npm run dev
```

Run the backend when using the separate server workflow:

```powershell
npm run server
```

### Validation before commit

Run:

```powershell
npm run lint
npm run build
```

The current V10 implementation has passed both checks locally.

## Database

SQLite is used for reservation data and persistent application settings.

The development database is located at:

```text
data/restaurant.db
```

Production database storage must use persistent storage on the hosting platform so reservations and settings survive redeployments.

Do not copy development/customer reservation data into another customer's production installation.

## Environment Variables and Secrets

Sensitive values belong in environment variables and must never be committed to GitHub.

Examples include:

- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `RESEND_API_KEY`
- Telegram bot token
- SMTP credentials used for local development, where applicable

The real `.env` file must remain private.

The repository should use `.env.example` to document required variables without exposing secrets.

## Production Deployment

The intended production flow is:

```text
Local development
      ↓
Tests
      ↓
Git commit
      ↓
Push to GitHub main
      ↓
Railway deployment
      ↓
Public HTTPS application
      ↓
Telegram Mini App
```

For production email:

```text
Railway
   ↓
Resend API
   ↓
Nordic Ember confirmation email
```

The configured restaurant sender is documented in the deployment manual and must not be confused with development SMTP settings.

## Telegram

The current bot is:

```text
@NordicEmberBot
```

The production Mini App is connected through Telegram configuration in BotFather.

The Telegram project configuration and production URL are documented separately in:

`Nordic_Ember_Complete_Deployment_Railway_Resend_Telegram_Manual.md`

## Security

Never commit:

- `.env`
- Telegram bot tokens
- Resend API keys
- SMTP passwords
- Admin passwords
- Admin session secrets
- other production credentials

The Admin Dashboard protects reservation-management endpoints with administrator authentication.

The Telegram bot token must remain server-side.

## Documentation

The project documentation should be kept together with the source code where practical.

Recommended documents are:

- `README.md` — technical project overview
- `Nordic_Ember_Restaurant_Admin_Manual.md` — restaurant administrator instructions
- `Nordic_Ember_Customer_User_Manual.md` — customer instructions
- `Nordic_Ember_Customer_Handover_and_Customization_Manual.md` — developer/customer handover and customization
- `Nordic_Ember_Complete_Deployment_Railway_Resend_Telegram_Manual.md` — deployment and production infrastructure
- `Nordic_Ember_Blog_Article_Updated.md` — current public tutorial/article content

## Current Verification Status

The current V10 language implementation has been verified locally with:

```text
npm run lint   → passed
npm run build  → passed
Runtime test  → passed
```

The next project step is the final production deployment test after the documentation and Git commit are complete.

## One-Time Language Installation Script

The project may contain:

```text
nordic_ember_configurable_languages.py
```

This script was used once to install the language configuration into the source files.

It is not part of the normal restaurant administration workflow.

After installation, the administrator changes languages through the Admin Dashboard only.

The script may be retained as a development/migration reference, but it should not be run again on the already modified project unless a developer is intentionally recreating the feature in another copy of the application.
