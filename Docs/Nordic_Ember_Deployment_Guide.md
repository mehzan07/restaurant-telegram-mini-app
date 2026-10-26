# Nordic Ember — Deployment Guide

## 1. Purpose

This guide explains how to build, test, configure, and deploy the Nordic Ember Restaurant Telegram Mini App for a customer.

The application uses a React/TypeScript frontend and a Node.js/Express backend. It may also use a database, email service, and Telegram bot.

**The customer is not required to use Railway.** The application can be deployed to a suitable cloud platform, the customer's own server, or a managed hosting provider, provided the environment supports the application's technical requirements.

## 2. Prepare the project locally

1. Install Node.js and npm on the development computer.
2. Open the project folder in Visual Studio Code.
3. Open a terminal in the project directory.
4. Install the project dependencies:

   ```bash
   npm install
   ```

5. Inspect `package.json` to identify the available commands:

   ```bash
   npm run
   ```

6. Start the frontend and backend using the scripts documented by the project. For example, the project may provide `npm run dev` for the frontend and `npm run server` for the backend. Confirm the actual script names before running them.
7. Open the local application in a browser and test its main functions.

Do not assume example commands are available in every version of the project. Use the scripts defined in the actual `package.json` files.

## 3. Build the frontend

Run the build command from the frontend project directory:

```bash
npm run build
```

For a Vite-based frontend, the output is normally written to `dist/`.

On Windows PowerShell, inspect the generated files with:

```powershell
Get-ChildItem .\dist -Recurse
```

Typical output includes generated HTML, JavaScript, CSS, and other frontend assets.

- `node_modules/` — installed dependencies, normally recreated using the package files.
- `dist/` — compiled frontend files, if the project uses Vite's default output directory.
- Backend source — the Node.js/Express application and its server-side logic.
- Database files or database configuration — required to store reservations and other application data.
- Environment configuration — settings and credentials required by the application.

The `dist` folder is not necessarily the complete application. The backend, database, email integration, and Telegram integration must also be configured and deployed as required.

## 4. Prepare the application for a new customer

Create a separate customer configuration and deployment. Do not reuse another restaurant's private credentials or reservation data.

Confirm and configure:

- Restaurant name, logo, colours, and contact information.
- Menu, prices, opening hours, and reservation rules.
- Restaurant time zone and supported languages.
- Customer's domain and HTTPS configuration.
- Database connection and persistent storage.
- Email provider, sender address, and credentials.
- Telegram bot token and Mini App URL.
- Administrator accounts and access permissions.

Keep passwords, API keys, bot tokens, and other secrets in the hosting environment's secure configuration. Do not commit secrets to GitHub or include them in frontend JavaScript.

Where possible, keep customer-specific settings separate from the core application code so future updates are easier to maintain.

## 5. Choose the customer's hosting environment

Choose hosting according to the customer's existing infrastructure, budget, technical requirements, and support arrangements.

### Option A — Customer's own cloud

Examples include AWS, Microsoft Azure, Google Cloud, or another cloud provider.

1. Create or select the customer's cloud project.
2. Choose a suitable service for hosting the frontend and another for the Node.js backend, or use a supported combined deployment.
3. Configure the runtime version, start command, networking, and required environment variables.
4. Select a database service or configure the application's existing database.
5. Configure persistent storage if the application relies on local files or SQLite.
6. Connect the customer's domain and configure HTTPS.
7. Configure logs, monitoring, backups, and access permissions.
8. Deploy the tested application and verify all integrations.

The exact steps depend on the selected cloud services.

### Option B — Customer's own server or VPS

A suitable Linux server can host the application if it meets the project's requirements.

1. Obtain authorised access to the customer's server.
2. Install and configure the required Node.js runtime and system packages.
3. Transfer or clone the application from the approved source repository.
4. Install dependencies and build the frontend.
5. Configure a web server, such as Nginx, to serve the frontend and route backend requests correctly.
6. Run the backend as a managed service so it can restart after a server reboot.
7. Configure the database and ensure its data is stored persistently.
8. Configure the domain, firewall, and HTTPS certificate.
9. Set up secure backups, logging, updates, and monitoring.
10. Test the complete application from an external browser and from Telegram.

Do not expose internal backend ports, database files, or secret configuration files publicly. Restrict server access and use secure authentication.

### Option C — Managed application hosting

The customer may prefer a managed hosting provider such as Railway or another compatible service.

1. Connect the approved GitHub repository or upload the application using the provider's supported method.
2. Configure the frontend and backend services.
3. Set environment variables and production start commands.
4. Configure a supported database and persistent storage.
5. Set the public domain and HTTPS.
6. Review build and runtime logs.
7. Test the deployed application.

Managed hosting can reduce server administration, but the customer must still account for hosting costs, database persistence, security, and backups.

## 6. Database and reservation storage

Confirm which database the application actually uses before choosing the hosting architecture.

If the application uses SQLite, its database file must be stored on persistent storage and protected from public access. The file must not be lost when a container or deployment is replaced. Confirm that the chosen platform supports the required persistent storage and that the application handles concurrent reservations appropriately.

For a multi-restaurant service or a larger production deployment, a managed database such as PostgreSQL may be more suitable. Migration requires appropriate application changes and testing; changing a database setting alone may not be sufficient.

Test that reservations remain available after a controlled restart or redeployment. Establish regular backups and test that restoration works.

## 7. Configure email confirmations

1. Select the email provider agreed with the customer.
2. Configure the API key or SMTP credentials in the backend hosting environment.
3. Verify the sender domain or address as required by the provider.
4. Set the sender name and reply-to address.
5. Keep credentials on the server side.
6. Make a test reservation and verify delivery.
7. Check spam folders, provider logs, and application logs if a message is not received.

The application should clearly distinguish between a saved reservation and a successfully sent confirmation email.

## 8. Configure the Telegram bot

1. Create or select the customer's Telegram bot using BotFather.
2. Store the bot token securely in the backend environment.
3. Configure the Mini App or menu button with the customer's public HTTPS URL.
4. Check that Telegram opens the correct restaurant's application.
5. Test the reservation flow on a phone.
6. Verify that the backend receives the correct requests and saves reservations.
7. Confirm that one customer's bot cannot access another customer's data.

If the application uses Telegram webhooks or polling, configure the production process accordingly and avoid running competing polling instances.

## 9. Domain and HTTPS

The customer should use a domain they own or are authorised to manage.

1. Add the domain to the chosen hosting service.
2. Configure the required DNS records.
3. Allow time for DNS changes to propagate.
4. Enable and verify HTTPS.
5. Configure the frontend's backend API URL correctly.
6. Check cross-origin settings if the frontend and backend use different domains.
7. Test the application using the final public URL.

Telegram Mini Apps should use a publicly accessible HTTPS URL. Do not use a development computer's `localhost` address as the production URL.

## 10. Production acceptance checklist

Before handing over the application, verify each item:

- [ ] Correct restaurant name, logo, menu, and prices.
- [ ] Frontend works on desktop and mobile.
- [ ] Backend starts and remains available.
- [ ] Reservations are saved correctly.
- [ ] Reservation data persists after a controlled restart.
- [ ] Date, time zone, opening hours, and booking rules are correct.
- [ ] Confirmation emails are tested.
- [ ] Telegram bot opens the correct Mini App.
- [ ] Domain and HTTPS work correctly.
- [ ] Secrets and administrator access are protected.
- [ ] Database backup and restoration have been tested.
- [ ] Logs and error handling are available.
- [ ] Hosting costs, ownership, and ongoing support are agreed with the customer.

## 11. Future updates

Use a controlled update process:

1. Make changes in the development project.
2. Test the changes locally.
3. Run the production build and resolve any errors.
4. Commit and push the approved code to GitHub.
5. Deploy using the customer's chosen hosting procedure.
6. Review deployment logs and test the production application.
7. Confirm that reservations and integrations still work.
8. Keep a backup and rollback plan before significant changes.

Never overwrite production database files or customer data as part of a routine code update.

## 12. Customer handover

Provide the customer with:

- The production URL and domain details.
- Instructions for accessing the hosting account.
- A list of configured services and recurring costs.
- A record of which party owns the domain, bot, database, and application.
- Backup and recovery procedures.
- Instructions for changing restaurant details and menu items.
- A maintenance and support agreement.

Transfer credentials securely, and do not put passwords or API tokens in the manual.

## Important technical note

This guide describes the general process. Before following deployment commands, inspect the actual repository to confirm the frontend and backend structure, available scripts, database implementation, production configuration, and required environment variables. Hosting instructions must match the project's real architecture and the customer's chosen provider.
