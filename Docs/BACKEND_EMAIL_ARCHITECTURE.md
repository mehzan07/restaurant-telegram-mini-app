# Restaurant Telegram Mini App --- Backend, Email, and Package Architecture

This document explains the main technologies and backend architecture
used in the **Restaurant Telegram Mini App**, with special focus on
Nodemailer, SMTP email, environment variables, React, TypeScript,
Express, Vite, and SQLite.

It is intended both as project documentation and as a learning reference
for developers who are new to React and TypeScript.

## 1. What Is Nodemailer?

**Nodemailer** is a Node.js library used for sending email from
server-side JavaScript or TypeScript applications.

Our React frontend cannot safely contain Gmail passwords or SMTP
credentials. Email therefore needs to be sent by the **backend**.

In this project, Nodemailer sends a reservation confirmation email after
the backend successfully stores a reservation.

``` text
Customer makes reservation
        ↓
React frontend
        ↓
Express backend
        ↓
Validate reservation
        ↓
Save to SQLite
        ↓
Nodemailer
        ↓
Gmail SMTP server
        ↓
Customer receives confirmation email
```

## 2. Why Do We Need Nodemailer?

The frontend collects information such as name, phone, email, number of
guests, date, time, seating area, and special requests.

The backend performs trusted operations: validating the reservation,
generating the reservation reference, saving the reservation, and
sending the confirmation email.

We should **never put a Gmail app password or other SMTP credentials in
React frontend code**, because frontend code is delivered to the user's
browser.

``` text
Browser
   ↓
Backend
   ↓
Nodemailer
   ↓
Gmail
```

The credentials remain on the server.

## 3. Installing Nodemailer

From the project directory:

``` powershell
C:\Utvecklingprogram\AI\restaurant-telegram-mini-app
```

install Nodemailer:

``` powershell
npm install nodemailer
```

Because the project uses TypeScript, also install its TypeScript
definitions:

``` powershell
npm install -D @types/nodemailer
```

Verify the installation with:

``` powershell
npm list nodemailer
```

The installed package is under `node_modules/nodemailer/`. Normally,
files inside `node_modules` should not be edited.

## 4. The Email Service

Email functionality is separated into:

``` text
server/
└── email.ts
```

It imports Nodemailer:

``` typescript
import nodemailer from 'nodemailer';
```

It reads SMTP configuration from:

``` typescript
process.env.SMTP_HOST
process.env.SMTP_PORT
process.env.SMTP_USER
process.env.SMTP_PASS
process.env.SMTP_FROM
```

A transporter is configured approximately like this:

``` typescript
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: Number(SMTP_PORT) === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});
```

The transporter is the configured connection between the backend and the
email server.

An email can then be sent with `transporter.sendMail(...)`, using the
restaurant sender address and the customer's reservation email as the
recipient.

## 5. SMTP and Gmail

SMTP means **Simple Mail Transfer Protocol**. It is a standard protocol
used for sending email.

``` text
email.ts
   ↓
Nodemailer
   ↓
smtp.gmail.com
   ↓
Gmail
   ↓
Internet
   ↓
Customer mailbox
```

For our development test, Gmail is the restaurant sender and Yahoo can
be used as the customer recipient.

## 6. The `.env` File

Sensitive information is not hard-coded in `email.ts`. Real local
configuration is stored in the project-root `.env` file:

``` dotenv
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=YOUR_REAL_GMAIL_ADDRESS
SMTP_PASS=YOUR_GMAIL_APP_PASSWORD
SMTP_FROM="Nordic Ember <YOUR_REAL_GMAIL_ADDRESS>"
```

Never place the real Gmail app password in documentation or commit it to
GitHub.

## 7. What Does `dotenv` Do?

In `server/index.ts`:

``` typescript
import 'dotenv/config';
```

`dotenv` reads `.env` and makes its variables available through
`process.env`.

``` text
.env
 │
 ↓
dotenv
 │
 ↓
process.env
 │
 ├── SMTP_HOST
 ├── SMTP_PORT
 ├── SMTP_USER
 ├── SMTP_PASS
 └── SMTP_FROM
          ↓
       email.ts
          ↓
      Nodemailer
```

A safe diagnostic is:

``` powershell
node -r dotenv/config -e "console.log({
  SMTP_HOST: !!process.env.SMTP_HOST,
  SMTP_PORT: !!process.env.SMTP_PORT,
  SMTP_USER: !!process.env.SMTP_USER,
  SMTP_PASS: !!process.env.SMTP_PASS,
  SMTP_FROM: !!process.env.SMTP_FROM
})"
```

A correct result has `true` for all five variables.

## 8. `.env` vs `.env.example`

`.env.example` is a safe template with placeholder values that can be
committed to GitHub. `.env` contains the real local credentials and must
not be committed.

``` text
restaurant-telegram-mini-app/
├── .env                 ← real credentials, local only
├── .env.example         ← example configuration
├── .gitignore
├── package.json
├── server/
└── src/
```

The `.gitignore` should protect the real file:

``` gitignore
.env
.env.*
!.env.example
```

## 9. Why Our `.env` Initially Failed

Initially, the real `.env` was under `server/.env`, while Node was
started from the project root. With our current dotenv setup, `.env` was
expected in the project working directory.

After moving it to:

``` text
restaurant-telegram-mini-app/.env
```

our diagnostic returned `true` for all five SMTP variables.

## 10. Other Important Packages and Technologies

### React

React builds the browser user interface. The application is mainly under
`src/`, including `App.tsx`, `main.tsx`, components, views, and data.
`BookTableView.tsx` handles the reservation UI.

### Vite

Vite is the frontend development/build tool. Start it with:

``` powershell
npm run dev
```

During development the frontend runs at `http://localhost:3000`. Vite
also provides the development proxy that forwards `/api/...` requests to
Express.

### Express

Express is the backend web framework used in `server/index.ts`. It
provides API endpoints such as:

``` text
GET  /api/health
POST /api/reservations
GET  /api/reservations
```

The backend runs at `http://localhost:3001` and is started with:

``` powershell
npm run server
```

### better-sqlite3

`better-sqlite3` communicates with SQLite. Database logic is in
`server/database.ts`, and reservations are stored in
`data/restaurant.db`.

``` text
server/index.ts
      ↓
database.ts
      ↓
better-sqlite3
      ↓
restaurant.db
```

### dotenv

`dotenv` loads local configuration and secrets from `.env` into
`process.env`, preventing credentials from being hard-coded in source
files.

### tsx

`tsx` lets us execute the TypeScript backend directly during
development. `npm run server` runs `tsx server/index.ts`. This is a
Node.js/TypeScript backend, so it does not use `python app.py`.

### TypeScript Type Packages

Packages beginning with `@types/` generally provide TypeScript
definitions for JavaScript libraries. For example, `@types/nodemailer`
helps TypeScript understand Nodemailer's API.

### Tailwind CSS

The frontend uses Tailwind-related tooling for styling and its modern
responsive/mobile-oriented UI.

## 11. Complete Development Architecture

``` text
                   CUSTOMER
                       │
                       ↓
              Browser / Telegram
                       │
                       ↓
                 React frontend
                  localhost:3000
                       │
                       │ POST
                       ↓
                  Vite proxy
                       │
                       ↓
               Express backend
                  localhost:3001
                       │
             ┌─────────┴─────────┐
             │                   │
             ↓                   ↓
        database.ts           email.ts
             │                   │
             ↓                   ↓
      better-sqlite3         Nodemailer
             │                   │
             ↓                   ↓
       restaurant.db         Gmail SMTP
                                 │
                                 ↓
                          Customer email
```

Configuration is separate:

``` text
.env
 │
 ↓
dotenv
 │
 ↓
process.env
 │
 ↓
email.ts
```

React handles the UI, Vite handles frontend development/building and
proxying, Express handles the API, SQLite handles storage, Nodemailer
handles outgoing email, dotenv handles local configuration/secrets, and
tsx runs the TypeScript backend during development.

## 12. Reservation Workflow

``` text
1. Customer completes reservation form
                 ↓
2. React sends POST /api/reservations
                 ↓
3. Express receives reservation
                 ↓
4. Backend validates the data
                 ↓
5. Backend generates reservation ID
                 ↓
6. Reservation inserted into SQLite
                 ↓
7. email.ts receives reservation information
                 ↓
8. Nodemailer connects to Gmail SMTP
                 ↓
9. Confirmation email sent to customer
                 ↓
10. API returns successful response
                 ↓
11. React displays reservation confirmation
```

An important design decision is that **email sending should not
determine whether a valid reservation exists**. Once a valid reservation
has been stored in SQLite, an SMTP failure should be logged and handled
separately rather than losing the customer's reservation.

## 13. Development Commands

Backend terminal:

``` powershell
npm run server
```

Frontend terminal:

``` powershell
npm run dev
```

Typical local addresses:

``` text
Frontend: http://localhost:3000
Backend:  http://localhost:3001
Health:   http://localhost:3000/api/health
```

## 14. Security Notes

-   Never commit `.env`.
-   Never put Gmail app passwords or other secrets in React frontend
    code.
-   Never paste real credentials into documentation.
-   Keep `.env.example` populated only with placeholders.
-   Perform important validation on the backend even when the frontend
    also validates.
-   Treat email delivery separately from successfully storing the
    reservation.

## 15. Summary

This project demonstrates a full-stack TypeScript/React architecture:

``` text
React
  ↓
Express API
  ↓
Server-side validation
  ↓
SQLite
  ↓
Nodemailer
  ↓
Gmail SMTP
  ↓
Customer
```

Understanding these separate responsibilities makes the project easier
to maintain, test, debug, secure, and extend later with Telegram
integration, administration, deployment, and production email
configuration.
