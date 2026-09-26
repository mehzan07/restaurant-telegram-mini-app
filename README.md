# Nordic Ember — Restaurant Telegram Mini App

Nordic Ember is a full-stack restaurant application built as a practical example of developing a modern web application and integrating it with Telegram.

The application allows customers to explore a restaurant, browse the seasonal menu, view dishes, reserve a table, and receive reservation confirmation by email.

The project is also being developed as a Telegram Mini App so that customers can eventually open the restaurant application directly inside Telegram through `@NordicEmberBot`.

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

The long-term goal is to connect the deployed Nordic Ember application as a Telegram Mini App.

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

The Telegram bot is operational, but the full Mini App connection requires a publicly accessible HTTPS deployment.

During local development, the application uses:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:3001
```

These local addresses cannot be used as the final Telegram Mini App URL because they are accessible only from the local development computer.

The next major stage of the project is therefore deployment.

The planned flow is:

```text
GitHub Repository
       ↓
Hosting Platform
       ↓
Public HTTPS URL
       ↓
@NordicEmberBot
       ↓
Telegram Mini App
```

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

## Current Project Status

Nordic Ember currently works locally as a React + TypeScript frontend with a Node.js/Express backend.

The following components have been implemented and tested locally:

- Restaurant frontend
- Responsive user interface
- English and Swedish support
- Restaurant menu
- Reservation workflow
- Seating-area selection
- SQLite database
- Reservation storage
- Reservation confirmation email
- Telegram bot
- `/start` command
- `/help` command
- Telegram command menu

The Telegram bot can currently communicate with users, but the Nordic Ember web application is still running locally.

The next major task is to deploy the application to a hosting platform that supports Node.js and HTTPS.

After deployment, Nordic Ember will receive a public HTTPS URL. That URL can then be configured in Telegram so that the restaurant application can be opened and tested as a Telegram Mini App through `@NordicEmberBot`.