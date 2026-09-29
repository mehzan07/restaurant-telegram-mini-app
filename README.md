# Nordic Ember — Restaurant Telegram Mini App

Nordic Ember is a full-stack restaurant application built as a practical example of developing a modern web application and integrating it with Telegram.

The application allows customers to explore a restaurant, browse the seasonal menu, view dishes, reserve a table, and receive reservation confirmation by email.

Nordic Ember is deployed publicly on Railway and is configured as a working Telegram Mini App through `@NordicEmberBot`.

---

## Technology Overview

Nordic Ember uses several technologies that have different responsibilities.

### TypeScript

TypeScript is the main programming language used throughout the project.

It extends JavaScript with type checking and is used in both the frontend and backend.

Typical files include:

- `.ts` — TypeScript
- `.tsx` — TypeScript with React components

### React

React is the frontend UI library.

It creates the parts of Nordic Ember that customers see and interact with, including:

- Home
- Menu
- Dish information
- Book Table
- About
- Contact
- English/Swedish interface

React runs primarily in the user's web browser.

### Node.js

Node.js is the runtime environment used to execute the server-side JavaScript/TypeScript application.

It allows our backend code to run outside the browser.

In Nordic Ember, Node.js is responsible for running services such as:

- the restaurant API
- reservation processing
- database access
- confirmation email processing
- Telegram bot communication

When we run:

```powershell
npm run server
```

the Nordic Ember backend runs through Node.js.

### Express

Express is the web framework used by the Node.js backend.

It makes it easier to create HTTP/API endpoints that allow the React frontend to communicate with the server.

For example:

```text
React reservation form
        ↓
HTTP request
        ↓
Express API
        ↓
Reservation processing
        ↓
Database + Email
```

### Vite

Vite is used as the frontend development and build tool.

During development, Vite starts the React application on port `3000`.

The frontend can be started with:

```powershell
npm run dev
```

### SQLite

SQLite is currently used as the restaurant database.

Reservation information is stored locally in:

```text
data/restaurant.db
```

SQLite is convenient during development because it does not require a separate database server.

The database strategy may be changed when the application is prepared for production deployment.

### Telegram Bot API

Nordic Ember includes a Telegram bot:

```text
@NordicEmberBot
```

The Telegram integration is implemented in:

```text
server/telegram.ts
```

The backend communicates with the Telegram Bot API and currently supports commands including:

```text
/start
/help
```

The deployed Nordic Ember application is connected to Telegram as a working Mini App.

---

## Application Architecture

The project can be viewed as two main parts:

```text
                  NORDIC EMBER
                       │
          ┌────────────┴────────────┐
          │                         │
       FRONTEND                  BACKEND
          │                         │
        React                    Express
          │                         │
      TypeScript                TypeScript
          │                         │
       Browser                   Node.js
                                    │
                         ┌──────────┼──────────┐
                         │          │          │
                      SQLite      Email     Telegram
```

In simple terms:

- **TypeScript** = programming language
- **React** = frontend/user interface library
- **Vite** = frontend development and build tool
- **Node.js** = runtime that executes the backend
- **Express** = web/API framework running on Node.js
- **SQLite** = database
- **Telegram Bot API** = communication between Nordic Ember and Telegram

---

## Project Structure

A simplified project structure is:

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
│   └── images/
│
├── data/
│   └── restaurant.db
│
├── Docs/
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### `src/`

Contains the React frontend application.

### `server/`

Contains the Node.js/Express backend.

Important backend files include:

- `index.ts` — main API/server
- `database.ts` — SQLite database handling
- `email.ts` — reservation confirmation email
- `telegram.ts` — Telegram Bot API integration

### `public/`

Contains static assets such as restaurant and dish images.

### `data/`

Contains the development SQLite database.

### `Docs/`

Contains additional project and technical documentation.

---

## Environment Variables

Sensitive configuration is stored locally in:

```text
.env
```

This includes credentials such as:

- SMTP/email configuration
- Telegram bot token
- Resend API key and production sender configuration

The real `.env` file must never be committed to GitHub.

The repository instead contains:

```text
.env.example
```

This file documents the required environment variables without exposing real passwords, tokens, or other secrets.

---

## Current Features

The application currently includes:

- Responsive restaurant interface
- English and Swedish language support
- Seasonal restaurant menu
- Dish images and information
- Table reservation workflow
- Multiple seating areas
- Reservation validation
- SQLite reservation storage
- Reservation confirmation email
- Telegram bot integration
- `/start` Telegram command
- `/help` Telegram command
- Telegram command menu

---

## Telegram Mini App Status

Nordic Ember is deployed publicly on Railway over HTTPS and is configured as a working Telegram Mini App.

Telegram bot:

```text
@NordicEmberBot
```

Direct Mini App link:

```text
https://t.me/NordicEmberBot/restaurant
```

The same Railway-hosted production application can be used in a normal web browser or inside Telegram. The Telegram mobile reservation flow and customer confirmation email delivery have been tested successfully.

---

## Development

### Install Dependencies

After cloning the repository, install the required npm packages:

```powershell
npm install
```

### Start the Frontend

Start the React/Vite frontend:

```powershell
npm run dev
```

The frontend development server runs on:

```text
http://localhost:3000
```

The `package.json` script used for this is:

```text
vite --port=3000 --host=0.0.0.0
```

### Start the Backend

Open a second terminal and start the Node.js/Express backend:

```powershell
npm run server
```

The backend API runs on:

```text
http://localhost:3001
```

The `package.json` script used for the backend is:

```text
tsx server/index.ts
```

During local development, both processes should normally be running:

```text
Terminal 1
npm run dev
      ↓
React + Vite frontend
http://localhost:3000


Terminal 2
npm run server
      ↓
Node.js + Express backend
http://localhost:3001
```

When the backend starts successfully, output similar to the following is displayed:

```text
SQLite database ready: ...\data\restaurant.db
Nordic Ember Telegram bot started.
Nordic Ember API running at http://localhost:3001
```

### Build for Production

Create the production frontend build with:

```powershell
npm run build
```

Vite creates the optimized production frontend files.

### Preview the Production Build

Preview the production frontend locally with:

```powershell
npm run preview
```

### TypeScript Check

Run TypeScript checking without generating output:

```powershell
npm run lint
```

The current `lint` script executes:

```text
tsc --noEmit
```

so this command currently performs TypeScript type checking rather than ESLint-based linting.

---

## Local Development Flow

When developing Nordic Ember locally, the application works approximately like this:

```text
Customer
   ↓
React frontend
localhost:3000
   ↓
HTTP/API request
   ↓
Express backend
localhost:3001
   ↓
Node.js
   │
   ├── SQLite database
   │
   ├── Reservation processing
   │
   ├── Confirmation email
   │
   └── Telegram bot
```

This separation is important:

- React handles the customer interface.
- Vite serves the frontend during development.
- Express provides the API.
- Node.js runs the backend.
- SQLite stores reservation data.
- Nodemailer handles reservation confirmation email.
- Telegram integration connects the backend to the Nordic Ember bot.

---

## Security

Never commit sensitive information such as:

- `.env`
- Telegram bot tokens
- SMTP passwords
- API keys
- production credentials

The `.env` file is used locally for the real credentials and must remain excluded from Git.

Use `.env.example` to document the required environment variables without storing real credentials.

If a Telegram bot token is accidentally exposed, revoke it through BotFather and generate a new token.

---

## Current Project Status — V8

Nordic Ember V8 is a complete working demonstration application.

The project now includes:

- React + TypeScript restaurant frontend
- Node.js + Express backend
- English and Swedish support
- Restaurant menu and reservation workflow
- SQLite reservation storage
- Local confirmation email through Nodemailer/SMTP
- Railway production deployment
- Persistent production storage
- Production confirmation email through Resend
- Verified restaurant email domain `restaurant.softsolutionsahand.com`
- Production sender `booking@restaurant.softsolutionsahand.com`
- Telegram bot `@NordicEmberBot`
- Working Telegram Mini App
- Telegram menu configuration and direct Mini App link
- Successful mobile Telegram reservation testing
- Successful customer confirmation email testing
- Production deployment documentation

### Production Services

- **Hosting:** Railway
- **Production email:** Resend
- **DNS:** Miss Hosting
- **Source control:** GitHub
- **Telegram configuration:** BotFather
- **Stable Git tag:** `v1.8.0`

### Live Application

Web application:

```text
https://restaurant-telegram-mini-app-production.up.railway.app
```

Telegram Mini App:

```text
https://t.me/NordicEmberBot/restaurant
```

### Production Email Architecture

Local development continues to use Nodemailer/SMTP for email testing. Production uses the Resend API with the verified restaurant domain.

```text
Local development → Nodemailer / SMTP → Customer email
Production → Railway → Resend → Customer email
```

The complete Railway, Resend, Miss Hosting, and Telegram deployment configuration is documented in the `Docs/` directory.

Nordic Ember V8 demonstrates the complete path from local full-stack development to a publicly deployed restaurant web application with production email delivery and Telegram Mini App integration.
