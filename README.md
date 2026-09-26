You can use the following content.
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

---

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

---

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

the Nordic Ember backend runs through Node.js.
Express
Express is the web framework used by the Node.js backend.
It makes it easier to create HTTP/API endpoints that allow the React frontend to communicate with the server.
For example:
React reservation form
        ↓
HTTP request
        ↓
Express API
        ↓
Reservation processing
        ↓
Database + Email

SQLite
SQLite is currently used as the restaurant database.
Reservation information is stored locally in:
data/restaurant.db

SQLite is convenient during development because it does not require a separate database server.
The database strategy may be changed when the application is prepared for production deployment.
Telegram Bot API
Nordic Ember includes a Telegram bot:
@NordicEmberBot

The Telegram integration is implemented in:
server/telegram.ts

The backend communicates with the Telegram Bot API and currently supports commands including:
/start
/help

The long-term goal is to connect the deployed Nordic Ember application as a Telegram Mini App.
Application Architecture
The project can be viewed as two main parts:
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

In simple terms:
- TypeScript = programming language
- React = frontend/user interface
- Node.js = runtime that executes the backend
- Express = web/API framework running on Node.js
- SQLite = database
- Telegram Bot API = communication between Nordic Ember and Telegram
Project Structure
A simplified project structure is:
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

src/
Contains the React frontend application.
server/
Contains the Node.js/Express backend.
Important backend files include:
- index.ts — main API/server
- database.ts — SQLite database handling
- email.ts — reservation confirmation email
- telegram.ts — Telegram Bot API integration
public/
Contains static assets such as restaurant and dish images.
data/
Contains the development SQLite database.
Docs/
Contains additional project and technical documentation.
Environment Variables
Sensitive configuration is stored in:
.env

This includes credentials such as:
- SMTP/email configuration
- Telegram bot token
The real .env file must never be committed to GitHub.
The repository instead contains:
.env.example

which documents the required environment variables without exposing real passwords or tokens.
Current Features
The application currently includes:
- Responsive restaurant interface
- English and Swedish language support
- Seasonal restaurant menu
- Dish images and information
- Table reservation workflow
- Multiple seating areas
- Reservation validation
- SQLite reservation storage
- Email confirmation
- Telegram bot integration
- /start Telegram command
- /help Telegram command
- Telegram command menu
Telegram Mini App Status
The Telegram bot is operational, but the full Mini App connection requires a publicly accessible HTTPS deployment.
Current development addresses such as:
http://localhost:3000
http://localhost:3001

cannot be used as the final Telegram Mini App URL.
The next major stage of the project is therefore deployment.
After deployment:
GitHub Repository
       ↓
Hosting Platform
       ↓
Public HTTPS URL
       ↓
@NordicEmberBot
       ↓
Telegram Mini App

Development
Install dependencies:
npm install

Start the backend:
npm run server

Start the frontend using the development command defined in package.json.
Security
Never commit:
- .env
- Telegram bot tokens
- SMTP passwords
- API keys
- other production credentials
If a Telegram bot token is accidentally exposed, revoke it through BotFather and create a new token.
Current Project Status
Nordic Ember currently works locally as a React + TypeScript frontend with a Node.js/Express backend.
The reservation database, confirmation email system, and Telegram bot have been tested locally.
The next major task is to deploy the application to a hosting platform that supports Node.js and HTTPS. After deployment, the public URL will be connected to @NordicEmberBot and tested as a Telegram Mini App.

One small point: before committing this README, I would check your `package.json` so we can put the **exact frontend command** in the Development section instead of saying “using the development command defined in `package.json`.”

You can run:

```powershell
Get-Content package.json
