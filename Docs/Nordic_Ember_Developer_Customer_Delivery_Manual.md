# Nordic Ember — Developer Customer Delivery Manual

## 1. Purpose

This is the internal manual for the developer who prepares and hands over a Nordic Ember restaurant application to a customer.

It is separate from the customer User Manual and Admin Manual.

The delivery goal is:

```text
Tested Nordic Ember template
        ↓
Customer-specific customization
        ↓
Production services
        ↓
Railway deployment
        ↓
Domain + email + Telegram
        ↓
Full production test
        ↓
Customer handover
```

The customer should not need to edit source code or run developer scripts for normal operation.

---

## 2. Developer Work vs Customer Work

### Developer work

The developer prepares and deploys the application:

- change restaurant-specific content;
- configure reservation rules;
- configure production database storage;
- configure email;
- configure Telegram;
- configure administrator credentials;
- deploy the application;
- connect the customer's domain;
- test the complete system;
- remove test data;
- prepare the handover documentation.

### Customer/Admin work

After handover, the restaurant administrator normally uses the Admin interface to:

- view reservations;
- create reservations;
- edit reservations;
- change reservation status;
- delete reservations when appropriate;
- choose which customer UI languages are visible.

---

## 3. Recommended Production Architecture

The current Nordic Ember application is a full-stack Node.js application with React, Express, SQLite, reservation APIs, email and Telegram integration.

Recommended production architecture:

```text
GitHub
   ↓
Railway
   ├── React frontend
   ├── Node.js / Express backend
   ├── environment variables / secrets
   └── persistent SQLite storage
          ↓
       Resend
          ↓
   Customer confirmation email

Customer domain
   ↓
Customer DNS provider
   ↓
Railway custom domain
   ↓
Nordic Ember

Telegram
   ↓
Customer Bot
   ↓
Nordic Ember Mini App
   ↓
Railway application
```

Railway currently supports GitHub-based deployment, persistent volumes, environment variables/secrets, and public/custom domains. A linked GitHub branch can automatically trigger deployments. citeturn641400search4turn641400search2turn641400search9

---

## 4. Which Web Hotel / Hosting Should Be Used?

### Standard choice: Railway

Use **Railway** as the standard hosting platform for the current Nordic Ember architecture.

The application needs:

- a running Node.js/Express process;
- backend API endpoints;
- environment variables;
- Telegram integration;
- production email integration;
- persistent storage for SQLite.

Railway supports persistent services, GitHub repositories, variables and volumes. citeturn641400search4turn641400search5turn641400search2

### Do not use a PHP-only or static-only web hotel

A traditional shared hosting package is not automatically suitable.

Before choosing another provider, verify that it supports:

```text
Node.js
Express/backend process
Environment variables
HTTPS
Custom domain
Persistent storage
Required npm packages
Correct start command
```

### Alternative: Render

Render can deploy Node.js web services from Git repositories and supports Node.js start commands. Its default filesystem is ephemeral, so persistent application data requires a persistent disk or another datastore. citeturn641400search0turn641400search1

For the current Nordic Ember template, keep Railway as the normal deployment target unless the architecture is intentionally changed.

---

## 5. Customer Information to Collect Before Customization

Collect:

### Restaurant

- final restaurant name;
- logo;
- approved colours/branding;
- restaurant description;
- About information.

### Contact

- address;
- telephone;
- email;
- website/domain;
- social links.

### Menu

- categories;
- dish names;
- descriptions;
- prices;
- images;
- featured dishes.

### Reservations

- guest limits;
- available times;
- seating areas;
- date rules;
- special requests;
- other booking rules.

### Services

- domain/DNS access;
- Railway ownership/access;
- Resend information;
- Telegram bot information.

Never collect or transfer production secrets through public documentation.

---

## 6. Start From a Tested Template

Before changing the project:

```powershell
npm run lint
npm run build
git status
```

Start the customer installation from a known, tested version.

Keep the template separate from customer production data.

---

## 7. Create a Separate Customer Repository

Normally create a separate GitHub repository for each restaurant.

Example:

```text
restaurant-telegram-mini-app-customername
```

Normally give each customer separate:

- GitHub repository;
- Railway service/project;
- production database;
- Telegram bot;
- email configuration;
- admin password;
- admin session secret.

---

## 8. What Must Be Changed

Search the complete project for old test/customer data.

Typical search terms:

```text
Nordic Ember
Test Restaurang
Test Restaurant
old restaurant name
old address
old phone
old email
old domain
old Telegram username
old menu
old images
```

After changing them, search again.

---

## 9. Restaurant Branding

Inspect:

```text
src/
src/components/
src/views/
src/data/
index.html
metadata.json
```

Update:

- restaurant name;
- logo;
- colours;
- fonts if required;
- Home text;
- About text;
- Contact details;
- footer/metadata;
- Telegram text;
- email templates;
- Admin branding.

---

## 10. Menu and Restaurant Data

Main file:

```text
src/data/restaurantData.ts
```

Update:

- dishes;
- descriptions;
- prices;
- categories;
- images;
- featured content.

Before changing data structures, inspect:

```text
src/types.ts
```

Test menu filters, search, dish details, images and mobile display.

---

## 11. Pages to Check

### Home

```text
src/views/HomeView.tsx
```

### Menu

```text
src/views/MenuView.tsx
```

### About

```text
src/views/AboutView.tsx
```

### Contact

```text
src/views/ContactView.tsx
```

Update customer-specific content in all of these areas.

---

## 12. Reservation Configuration

Frontend:

```text
src/views/BookTableView.tsx
```

Backend:

```text
server/index.ts
```

Review together:

- guest limits;
- available times;
- seating areas;
- date rules;
- required fields;
- phone rules;
- country codes;
- special-request limits.

Frontend and backend validation must agree.

---

## 13. Database and Persistent Storage

Nordic Ember uses SQLite.

Never use an existing developer or another customer's database for a new customer.

The production SQLite database must be stored on persistent Railway storage. Railway volumes are designed to persist data across deploys and restarts. citeturn641400search2

Test the persistence:

```text
Create reservation
        ↓
Restart/redeploy application
        ↓
Open Admin
        ↓
Reservation still exists
```

Do not hand over the system until this test passes.

---

## 14. Admin Account

Configure unique production values for:

```text
ADMIN_PASSWORD
ADMIN_SESSION_SECRET
```

Do not put these values in GitHub, frontend code, README files or blog articles.

Transfer the administrator password securely to the customer.

---

## 15. Configurable Languages

Supported customer UI languages:

```text
English
Swedish
Farsi
Turkish
```

Default:

```text
☑ English
☑ Swedish
☐ Farsi
☐ Turkish
```

The restaurant administrator can change the visible languages from the Admin interface without editing code or running a Python script.

The script:

```text
nordic_ember_configurable_languages.py
```

is a one-time developer/install script. It is not part of the normal customer workflow.

The language feature controls UI language visibility. It does not automatically translate restaurant-specific content.

---

## 16. GitHub Preparation

Before pushing the customer version:

```powershell
npm run lint
npm run build
git status
```

Check that:

- `.env` is not committed;
- Telegram tokens are not committed;
- Resend API keys are not committed;
- admin passwords are not committed;
- other production secrets are not committed.

Use `.env.example` for documentation of required variables without real secret values.

---

## 17. Deploy to Railway

### Step 1 — Create project

In Railway:

1. create a new project;
2. deploy from GitHub;
3. select the customer's repository;
4. select the production branch, normally `main`;
5. start the deployment.

Railway supports GitHub repositories as service sources and can automatically deploy new commits from the linked branch. citeturn641400search4

### Step 2 — Check the build

Review deployment logs and confirm:

```text
Dependencies installed
Build completed
Application started
No fatal runtime errors
```

### Step 3 — Add production variables

Open the Railway service Variables section.

Typical variables include:

```text
ADMIN_PASSWORD
ADMIN_SESSION_SECRET
RESEND_API_KEY
RESEND_FROM
TELEGRAM_BOT_TOKEN
```

Use the exact variable names required by the current `.env.example` and source code.

Railway provides variables for application configuration and secrets. citeturn641400search5

---

## 18. Configure Railway Persistent Storage

Create a Railway Volume and connect it to the application service.

Set the mount path so the production SQLite database is written inside the mounted volume.

Then test database persistence after restart/redeployment.

Railway documents that volumes persist data across deploys and restarts. citeturn641400search2

---

## 19. Generate a Public Railway Domain

In the Railway service networking settings, generate a public domain.

Railway provides `*.up.railway.app` domains and supports custom domains with automatic SSL provisioning. citeturn641400search9

Example:

```text
https://customer-application-production.up.railway.app
```

The exact hostname differs for each customer.

---

## 20. Connect the Customer's Domain

Preferred flow:

```text
Customer domain
      ↓
Customer DNS provider
      ↓
Railway custom domain
      ↓
Nordic Ember
```

In Railway:

1. add the customer domain;
2. copy the exact DNS values Railway provides;
3. open the customer's DNS provider;
4. add the exact records;
5. wait for DNS propagation;
6. verify the domain;
7. test HTTPS.

Never invent DNS records.

---

## 21. If the Customer Uses Miss Hosting

Use the customer's Miss Hosting DNS management.

Typical path:

```text
Miss Hosting
→ Domains
→ Zone Editor
→ Customer domain
→ Manage
```

Add the exact record(s) provided by Railway or Resend.

Do not delete unrelated website, mail or application records.

---

## 22. If the Customer Has No Domain

A Railway-generated HTTPS domain can be used for testing.

For a final branded launch, the customer should normally own a domain.

Recommended arrangement:

```text
Customer owns domain
        ↓
Developer configures DNS
        ↓
Railway hosts application
```

---

## 23. Configure Resend

Use Resend for production reservation email.

Configure:

```text
RESEND_API_KEY
RESEND_FROM
```

The sender should use the verified customer domain.

Example:

```text
Restaurant Name <booking@restaurant.customer-domain.com>
```

Never put the Resend API key in GitHub or frontend code.

---

## 24. Verify Email Domain

In Resend:

1. add the customer's sending domain/subdomain;
2. copy the exact DNS records shown by Resend;
3. add them to the customer's DNS provider;
4. wait for verification;
5. confirm the domain is verified;
6. configure `RESEND_FROM` in Railway.

Do not invent or manually alter provider-generated DNS values.

---

## 25. Test Reservation Email

Perform a production reservation and verify the email.

Check:

- sender;
- restaurant name;
- booking reference;
- customer name;
- date;
- time;
- guest count;
- seating area;
- special requests.

---

## 26. Create and Configure the Customer Telegram Bot

Using BotFather, configure:

- bot name;
- username;
- description;
- About text;
- profile image;
- commands;
- Mini App/Web App;
- menu button;
- Main Mini App when appropriate.

Store the bot token only as a production secret/environment variable.

---

## 27. Connect Telegram to Production

The production flow must be:

```text
Telegram
   ↓
Customer Bot
   ↓
Open Restaurant
   ↓
Customer Mini App
   ↓
Railway HTTPS application
```

Never point the production bot to:

```text
http://localhost:3000
http://localhost:3001
```

and do not leave it pointing to a developer deployment.

---

## 28. Production Test Checklist

### Browser

- Home
- Menu
- Dish details
- Book Table
- About
- Contact
- Profile
- Language selector
- Reservation confirmation

### Admin

- login;
- Today;
- This week;
- This month;
- Total;
- search;
- date filter;
- status filter;
- create reservation;
- edit reservation;
- change status;
- delete when appropriate;
- language settings.

### Email

Make a reservation and verify the confirmation email.

### Telegram

Test:

- bot;
- Start;
- commands;
- Mini App;
- navigation;
- language selector;
- reservation;
- email confirmation.

---

## 29. Language Production Test

Start with:

```text
☑ English
☑ Swedish
☐ Farsi
☐ Turkish
```

Save and verify the customer selector shows English and Swedish.

Then test another configuration, for example:

```text
☑ English
☐ Swedish
☑ Farsi
☐ Turkish
```

Save and reload the customer app.

Verify only English and Farsi are shown.

Finally restore the customer's intended configuration.

Also verify that the setting survives a restart/redeployment.

---

## 30. Remove Test Data

Only after all tests are complete:

- remove test reservations;
- remove old test names;
- remove old test emails and telephone numbers;
- remove old Telegram links;
- remove temporary content;
- verify the production database contains only customer data.

---

## 31. Final Source Code and Security Check

Run:

```powershell
npm run lint
npm run build
git status
```

Search the project again for old test/customer values.

Confirm that the repository does not contain:

```text
.env
Telegram bot token
Resend API key
admin password
admin session secret
SMTP password
other production secrets
```

---

## 32. Customer Handover Package

Normally give the customer:

```text
Nordic_Ember_Customer_User_Manual.md
Nordic_Ember_Restaurant_Admin_Manual.md
```

Optionally also provide PDF versions.

Do not normally give normal restaurant staff:

```text
developer patch scripts
backup .bak files
private secrets
internal debugging notes
source-code installation instructions
```

---

## 33. Information to Hand Over

Depending on the ownership arrangement, provide:

- production website URL;
- custom domain;
- Telegram bot username;
- Admin URL;
- administrator credentials;
- operating instructions;
- support contact.

Transfer sensitive credentials securely.

---

## 34. What the Customer Can Change Without a Developer

After handover, the administrator can normally:

```text
Manage reservations
        +
Manage reservation status
        +
Create/edit reservations
        +
Choose visible customer UI languages
```

Normal operation should not require editing TypeScript or running the Python language-installation script.

---

## 35. What Requires Developer Work

Developer involvement is normally required for:

- new features;
- new database fields/structures;
- new reservation logic;
- new integrations;
- payment systems;
- major UI redesigns;
- Telegram architecture changes;
- hosting architecture changes.

---

## 36. Final Handover Checklist

### Customer customization

- [ ] Restaurant name
- [ ] Logo
- [ ] Branding
- [ ] Home text
- [ ] About text
- [ ] Contact information
- [ ] Menu
- [ ] Prices
- [ ] Images
- [ ] Reservation rules
- [ ] Telegram information
- [ ] Language configuration

### Production

- [ ] GitHub repository
- [ ] Railway service
- [ ] Production variables
- [ ] Persistent SQLite volume
- [ ] Public HTTPS domain
- [ ] Customer custom domain
- [ ] Resend domain
- [ ] Production sender
- [ ] Telegram bot
- [ ] Telegram Mini App

### Testing

- [ ] Browser test
- [ ] Mobile test
- [ ] Admin test
- [ ] Reservation test
- [ ] Database persistence test
- [ ] Email test
- [ ] Telegram test
- [ ] Language configuration test
- [ ] Restart/redeployment test

### Before delivery

- [ ] Test reservations removed
- [ ] Old test data removed
- [ ] No secrets in Git
- [ ] Documentation prepared
- [ ] Credentials transferred securely
- [ ] Final production URL confirmed

---

## 37. Standard Delivery Workflow

```text
1. Start from tested Nordic Ember template
        ↓
2. Create customer GitHub repository
        ↓
3. Replace restaurant identity/content
        ↓
4. Configure menu and reservation rules
        ↓
5. Create customer-specific secrets
        ↓
6. Deploy to Railway
        ↓
7. Configure persistent SQLite storage
        ↓
8. Configure customer domain
        ↓
9. Configure Resend + DNS
        ↓
10. Create/configure Telegram bot
        ↓
11. Connect Mini App
        ↓
12. Test browser
        ↓
13. Test Admin
        ↓
14. Test email
        ↓
15. Test Telegram
        ↓
16. Test language configuration
        ↓
17. Test database persistence
        ↓
18. Remove test data
        ↓
19. Run lint + build
        ↓
20. Prepare customer documentation
        ↓
21. Transfer credentials securely
        ↓
22. Customer acceptance
```

---

## 38. Final Delivery Gate

Do not consider the installation complete merely because the website opens.

The customer installation is ready when:

```text
Application works
        +
Admin works
        +
Reservation works
        +
Database persists
        +
Domain works
        +
Email works
        +
Telegram works
        +
Language settings work
        +
Test data removed
        +
Documentation delivered
        +
Credentials transferred securely
```

This is the internal developer delivery gate for Nordic Ember.
