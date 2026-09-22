# Restaurant Telegram Mini App --- Frontend Architecture

This document gives a short overview of the React/TypeScript frontend
under `src/`.

## Frontend Structure

``` text
src/
├── components/
│   ├── DishModal.tsx
│   ├── Header.tsx
│   ├── Navigation.tsx
│   ├── ProfileDrawer.tsx
│   ├── TastingMenuModal.tsx
│   └── Toast.tsx
├── data/
│   └── restaurantData.ts
├── views/
│   ├── AboutView.tsx
│   ├── BookTableView.tsx
│   ├── ContactView.tsx
│   ├── HomeView.tsx
│   └── MenuView.tsx
├── App.tsx
├── index.css
├── main.tsx
└── types.ts
```

## Main Files

-   `main.tsx` --- starts the React application.
-   `App.tsx` --- main application component that connects the
    application's views and UI.
-   `index.css` --- global styling.
-   `types.ts` --- shared TypeScript type definitions.

## Components

-   `Header.tsx` --- application/restaurant header.
-   `Navigation.tsx` --- navigation between the main sections.
-   `DishModal.tsx` --- modal for displaying dish details.
-   `TastingMenuModal.tsx` --- modal for tasting-menu information.
-   `ProfileDrawer.tsx` --- drawer-style profile/user interface.
-   `Toast.tsx` --- temporary status/notification messages.

Components are reusable UI building blocks used by one or more views.

## Views

-   `HomeView.tsx` --- restaurant home/landing view.
-   `MenuView.tsx` --- displays restaurant menu content.
-   `AboutView.tsx` --- restaurant information/about view.
-   `ContactView.tsx` --- restaurant contact information.
-   `BookTableView.tsx` --- reservation interface; collects booking
    information and communicates with the backend reservation API.

Views represent the main screens or sections seen by the customer.

## Frontend Data

`data/restaurantData.ts` contains restaurant-related data used by the
frontend, keeping static/content data separate from UI components.

## Frontend Flow

``` text
main.tsx
   ↓
App.tsx
   ↓
Views
   ↓
Reusable Components
   ↓
Customer interface
```

For reservations:

``` text
BookTableView.tsx
        ↓
POST /api/reservations
        ↓
Vite development proxy
        ↓
Express backend
```

The frontend is responsible for presentation and user interaction, while
trusted operations such as database storage, reservation-reference
generation and email sending remain in the backend.
