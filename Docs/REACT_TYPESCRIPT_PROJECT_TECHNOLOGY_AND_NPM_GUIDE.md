# React + TypeScript Project Technology and npm Guide

**Project:** Nordic Ember / Restaurant Telegram Mini App

This short guide explains the main frontend and backend technologies
used in the project, how they work together, and the npm commands used
during development and deployment.

## 1. Project Architecture

The project is a full-stack web application. The frontend presents the
restaurant interface and reservation form, while the backend validates
and stores reservations and sends confirmation email.

``` text
React + TypeScript Frontend
        ↓
Vite Development / Build Tool
        ↓
Express Backend API
        ↓
SQLite Database
        ↓
Nodemailer + Gmail SMTP
```

## 2. Frontend Technologies

### React

React is the frontend user-interface library. It is used to build the
restaurant pages, reservation form, confirmation modal, buttons,
navigation, and other interactive components.

Files such as `src/views/BookTableView.tsx` contain React components.

### TypeScript

TypeScript is JavaScript with additional type checking. It helps detect
many programming mistakes before the application runs and makes larger
projects easier to understand and maintain.

Files ending in `.ts` and `.tsx` are TypeScript files. `.tsx` is
commonly used when a file also contains React JSX markup.

### Vite

Vite is the frontend development server and production build tool.

During development it starts the React application quickly and normally
updates the browser when source files change. For deployment, Vite
creates an optimized production build.

In this project the development frontend runs at:

``` text
http://localhost:3000
```

### CSS / UI Styling

The frontend uses CSS utility classes and project styling to control
layout, spacing, typography, responsive behavior, buttons, forms, modal
windows, and the overall restaurant design.

## 3. Backend Technologies

### Node.js

Node.js is the JavaScript runtime that allows JavaScript and
TypeScript-based server applications and development tools to run
outside the browser.

npm is normally installed together with Node.js.

### Express

Express is the web framework used for the backend API.

It receives HTTP requests from the React frontend, validates reservation
information, calls the database and email functions, and returns a
response to the frontend.

Examples in this project include:

``` text
GET  /api/health
POST /api/reservations
GET  /api/reservations
```

### tsx

`tsx` is a development tool that can execute TypeScript files directly
with Node.js.

Our npm server script uses it to run:

``` text
server/index.ts
```

without first manually compiling that file.

### SQLite and better-sqlite3

SQLite is the local relational database used to persist reservations.

It stores the data in a database file rather than requiring a separate
database server. The project uses the `better-sqlite3` package to
communicate with SQLite from the backend.

### Nodemailer

Nodemailer is the Node.js email library used by:

``` text
server/email.ts
```

It connects to the configured SMTP server and sends reservation
confirmation emails after a reservation has been stored.

### dotenv and .env

`dotenv` loads configuration values from the local `.env` file into
`process.env`.

The project uses this for SMTP host, port, username, app password, and
sender information.

The real `.env` file contains secrets and must **not** be committed to
Git.

`.env.example` documents the required variable names without containing
real credentials.

## 4. What is npm?

**npm** means **Node Package Manager**.

It is used to:

-   install project packages
-   manage dependencies
-   run scripts defined in `package.json`

The `package.json` file is one of the most important files in a
Node/React project. It describes dependencies and defines named commands
such as `dev`, `server`, and `build`.

Conceptually:

``` json
"scripts": {
  "dev": "vite --port=3000 --host=0.0.0.0",
  "server": "tsx server/index.ts",
  "build": "vite build"
}
```

npm reads these script definitions when we use `npm run ...`.

## 5. Important npm Commands Used in This Project

### npm install

``` powershell
npm install
```

Reads `package.json` and installs the project dependencies into the
`node_modules` folder.

### Install Nodemailer

``` powershell
npm install nodemailer
npm install -D @types/nodemailer
```

The first command installs Nodemailer. The second installs its
TypeScript type definitions as a development dependency.

### npm run dev

``` powershell
npm run dev
```

Starts the Vite frontend development server.

In this project:

``` text
http://localhost:3000
```

The flow is:

``` text
npm run dev
     ↓
Vite
     ↓
React + TypeScript Frontend
     ↓
localhost:3000
```

### npm run server

``` powershell
npm run server
```

Starts the Express/TypeScript backend through `tsx`.

In this project:

``` text
http://localhost:3001
```

The flow is:

``` text
npm run server
       ↓
tsx
       ↓
server/index.ts
       ↓
Express Backend API
       ↓
localhost:3001
```

### npm run build

``` powershell
npm run build
```

Creates an optimized production frontend build.

The flow is:

``` text
React / TypeScript source
        ↓
npm run build
        ↓
Vite
        ↓
dist/
```

Unlike `npm run dev`, this command does not start the development
website. It prepares the frontend files for deployment.

### npm run

``` powershell
npm run
```

Lists the npm scripts available in the current `package.json`.

## 6. Development Workflow

During local development we normally use two terminals because the
frontend and backend are separate processes.

``` text
Terminal 1
npm run server
      ↓
Express Backend API
http://localhost:3001


Terminal 2
npm run dev
      ↓
Vite + React Frontend
http://localhost:3000
```

The browser loads the React frontend from port `3000`, and the frontend
sends reservation requests to the backend on port `3001`.

## 7. Production Build

Before deployment, we use:

``` powershell
npm run build
```

Vite processes the React and TypeScript frontend and creates optimized
static production files.

This is different from `npm run dev`:

-   `npm run dev` is for programming and local testing.
-   `npm run build` prepares the frontend for production deployment.

## 8. Simple Summary

-   **React** --- builds the user interface.
-   **TypeScript** --- adds type checking and structure to JavaScript
    code.
-   **Vite** --- runs the frontend during development and builds it for
    production.
-   **Node.js** --- runs JavaScript/TypeScript tooling and backend code
    outside the browser.
-   **Express** --- provides the backend API.
-   **SQLite** --- stores reservations.
-   **better-sqlite3** --- connects the backend to SQLite.
-   **Nodemailer** --- sends confirmation email through SMTP.
-   **dotenv** --- loads private configuration from `.env`.
-   **npm** --- installs packages and runs project scripts.

This architecture gives the project a clear separation between the user
interface, server-side business logic, persistent storage, and external
email service.
