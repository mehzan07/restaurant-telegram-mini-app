# Nordic Ember Customer Handover and Customization Manual

## 1. Purpose

This manual is for the developer or technical person who delivers the restaurant application to a customer.

It explains what normally needs to be changed for a new restaurant and where those changes are made in the current source code.

## 2. Before Delivery

Replace all test/Nordic Ember information with the customer's real information.

Check:

- Restaurant name
- Logo and branding
- Restaurant description
- Address
- Phone number
- Email address
- Website/domain
- Telegram bot
- Menu
- Dishes
- Prices
- Images
- Seating areas
- Reservation rules
- Admin password
- Admin session secret
- Email/SMTP settings
- Production database
- Deployment environment

Perform a complete production reservation test before handover.

## 3. Changing the Restaurant Name

Search the complete project for:

`Nordic Ember`

Also search for old test names such as:

`Test Restaurang`

Check all occurrences in:

- Header
- Home page
- About page
- Contact page
- Footer, if present
- Browser/page metadata
- Telegram text
- Email templates
- Admin interface
- README/documentation

Do not change only one occurrence and assume the whole application has been rebranded.

## 4. Restaurant and Menu Data

The first file to inspect is:

`src/data/restaurantData.ts`

This is the main location for restaurant menu data, including items such as:

- Dish names
- Descriptions
- Prices
- Categories
- Images
- English/Swedish text, if bilingual content is enabled

## 5. How to Add a New Dish

Open:

`src/data/restaurantData.ts`

Copy an existing dish object as a template and create a new entry.

Set:

- A unique ID
- English name
- Swedish name if Swedish is supported
- Description
- Category
- Price
- Image
- Any other fields required by the project

Do not reuse an existing dish ID.

Before changing the structure of a dish, inspect:

`src/types.ts`

The `Dish` type defines the expected properties.

If the new dish interacts with menu or detail views, also check:

- `src/views/MenuView.tsx`
- `src/components/DishModal.tsx`

## 6. Removing a Dish

Remove the dish from:

`src/data/restaurantData.ts`

Before removing it, search the project for its ID. This makes sure another component does not depend on that specific ID.

## 7. Changing Menu Categories

Inspect:

`src/data/restaurantData.ts`

and, when the category structure or filtering changes:

`src/views/MenuView.tsx`

For example, a restaurant can change categories from Starters/Main Courses/Desserts to Small Plates/Fish/Meat/Desserts.

After changing categories, test the menu filters and dish display.

## 8. Home Page

Main file:

`src/views/HomeView.tsx`

Use it for changes to:

- Welcome text
- Hero content
- Restaurant introduction
- Featured content
- Calls to action
- Featured dishes

If a featured dish is selected by ID, make sure the ID still exists in `restaurantData.ts`.

## 9. Menu Page

Main file:

`src/views/MenuView.tsx`

The actual dish data should normally remain in:

`src/data/restaurantData.ts`

Keep data and presentation separate whenever possible.

## 10. About Page

Main file:

`src/views/AboutView.tsx`

Change the restaurant's:

- History
- Concept
- Chef information
- Philosophy
- Location information
- Other restaurant-specific text

## 11. Contact Page

Main file:

`src/views/ContactView.tsx`

Change:

- Address
- Email
- Telephone number
- Website
- Social/contact links
- Telegram Concierge link

The current Telegram link is:

`https://t.me/NordicEmberBot`

For a new customer, replace it with the customer's real Telegram bot link.

## 12. Telegram Bot

The Telegram integration is handled by:

`server/telegram.ts`

For a new customer:

1. Create or obtain the customer's Telegram bot with BotFather.
2. Configure the bot username.
3. Store the bot token securely as an environment variable.
4. Update the customer-facing Telegram link.
5. Test `/start`.
6. Test `/help`.
7. Test the Mini App link.
8. Never put the bot token in frontend source code.

## 13. Reservation Form

Main frontend file:

`src/views/BookTableView.tsx`

Use it for changes to:

- Reservation fields
- Guest selection
- Date selection
- Time selection
- Seating options
- Special requests
- Confirmation flow
- Guest-facing messages

Server-side reservation validation is in:

`server/index.ts`

If a reservation rule changes, review both frontend and server validation.

## 14. Reservation Database and API

The reservation API and database logic are handled by:

`server/index.ts`

Before delivery:

- Use a separate production database for the customer.
- Do not leave another customer's reservations in the database.
- Test creating a reservation.
- Test that it appears in Admin.
- Test editing it.
- Test status changes.
- Test deletion if enabled.

## 15. Admin Dashboard

Main frontend file:

`src/views/AdminView.tsx`

Current functionality includes:

- Admin login
- Today/This week/This month/Total statistics
- Search
- Filters
- Reservation editing
- Status changes
- Reservation deletion
- Restaurant navigation

The dashboard statistics use all reservations and are not changed by the current search/filter selection.

## 16. Admin Password

The server reads the admin password from the environment variable:

`ADMIN_PASSWORD`

For every new customer, configure a new strong password in the production environment.

Never commit the real password to GitHub.

## 17. Admin Session Secret

The server also supports:

`ADMIN_SESSION_SECRET`

Use a unique production secret for each customer installation. Do not reuse production secrets between customers.

## 18. Email and SMTP

Reservation confirmation emails are handled by the server. Review:

`server/index.ts`

and the environment variables used by the deployment platform.

SMTP credentials must be stored as environment variables, not in GitHub.

Before handover test:

1. Create a reservation.
2. Confirm the server accepts it.
3. Confirm it appears in Admin.
4. Confirm the email is sent.
5. Confirm it arrives at the intended address.
6. Confirm contact/reply information is correct.

## 19. Header and Admin Link

Main file:

`src/components/Header.tsx`

Use it for:

- Restaurant branding
- Admin link
- Language switcher
- Profile button
- Header navigation

The current application has an **Admin** button that opens `/admin`.

## 20. Main Application and Routing

Main file:

`App.tsx`

Current routes include:

- `/`
- `/menu`
- `/book-table`
- `/about`
- `/contact`
- `/admin`

The `/admin` route renders `AdminView`.

If a new top-level page is added, review routing in `App.tsx`.

## 21. Restaurant Colors and Fonts

Search the project for the existing design values, for example:

`#fbf9f7`

`#091510`

`#725b38`

The main components are under:

`src/components/`

and page layouts are under:

`src/views/`

For a new customer, search for old brand colors and update them consistently.

## 22. Images

When replacing images:

1. Find where the existing image is referenced.
2. Add the customer's image using the project's existing image strategy.
3. Update the reference in the relevant data/component.
4. Test mobile and desktop layouts.
5. Test the production build.

Only use images that the customer has permission to use.

## 23. Language

If English and Swedish are enabled, update both language versions when changing restaurant content.

Test the language switcher after content changes.

Do not leave old test-language text in production.

## 24. Guest Profile

The profile UI is handled by:

`src/components/ProfileDrawer.tsx`

Booking state is currently managed by:

`App.tsx`

When changing reservation display or profile behavior, inspect both files.

## 25. Data vs Application Logic

Prefer changing data rather than application logic for normal customer customization.

### Usually change data for

- Restaurant name
- Dish names
- Descriptions
- Prices
- Categories
- Images
- Contact details
- Restaurant text

### Change application logic only when

- A different reservation workflow is required
- New fields are required
- New business rules are required
- A new feature is required
- Different admin functionality is required

## 26. Recommended Customer Delivery Procedure

1. Copy the tested project/version.
2. Create a new production database.
3. Create new production environment variables.
4. Set a new admin password.
5. Set a unique admin session secret.
6. Configure SMTP/email.
7. Configure the customer's Telegram bot.
8. Change restaurant name and branding.
9. Replace restaurant content.
10. Replace menu and dishes.
11. Replace images.
12. Replace contact information.
13. Check reservation rules.
14. Build the application.
15. Test all public pages.
16. Test the reservation process.
17. Test email delivery.
18. Test Admin login and reservation management.
19. Test Telegram.
20. Test the production domain.
21. Remove all test reservations/data.
22. Update README/documentation.
23. Give the customer the Restaurant User Manual.
24. Transfer sensitive credentials securely.

## 27. Production Test Checklist

### Guest test

- Open the production URL.
- Open Home.
- Open Menu.
- Open a dish.
- Open Book Table.
- Create a test reservation.
- Verify confirmation.
- Open Profile.
- Verify reservation information.
- Test Contact.
- Test Telegram Concierge.

### Admin test

- Open `/admin`.
- Log in.
- Verify Today.
- Verify This week.
- Verify This month.
- Verify Total.
- Search for the test reservation.
- Edit the reservation.
- Change status to Arrived.
- Change status to Completed.
- Test Cancelled.
- Test Did not arrive.
- Test deletion if appropriate.
- Return to Restaurant.
- Open Admin again.

## 28. Files Most Often Changed for a New Restaurant

| Purpose | Main file/location |
|---|---|
| Restaurant/menu data | `src/data/restaurantData.ts` |
| Data types | `src/types.ts` |
| Home page | `src/views/HomeView.tsx` |
| Menu | `src/views/MenuView.tsx` |
| Booking page | `src/views/BookTableView.tsx` |
| About | `src/views/AboutView.tsx` |
| Contact | `src/views/ContactView.tsx` |
| Header | `src/components/Header.tsx` |
| Guest profile | `src/components/ProfileDrawer.tsx` |
| Main routing/state | `App.tsx` |
| Admin dashboard | `src/views/AdminView.tsx` |
| Server/API/database/email | `server/index.ts` |
| Telegram integration | `server/telegram.ts` |
| Environment configuration | `.env` / deployment environment |
| Documentation | `README.md` |

## 29. Important Rule for Future Versions

Keep a clean base/template version and separate customer-specific configuration.

Recommended structure:

- Base/template version
- Customer-specific version
- Production configuration
- Customer documentation

Keep secrets outside Git.

## 30. Handover Package

A professional customer delivery should contain:

1. Production application
2. Restaurant User Manual
3. Admin operating instructions
4. Customer-specific configuration information
5. Domain information
6. Telegram bot information
7. Email configuration information
8. Backup/recovery information
9. README/documentation
10. Developer maintenance notes

Sensitive secrets such as SMTP passwords, Telegram bot tokens and server credentials should be transferred securely and should not be placed in public documentation.
