# Railway + Resend + Miss Hosting --- Deployment and Email Configuration Manual

**Example project:** Nordic Ember Restaurant\
**Domain:** `softsolutionsahand.com`\
**Restaurant email subdomain:** `restaurant.softsolutionsahand.com`

This manual explains the complete setup from deploying an application on
Railway to sending reservation confirmation emails through Resend using
a custom domain managed in Miss Hosting.

It is intentionally written as a **configuration manual**, without
application source code or programming-error details, so it can be
reused for other applications later.

------------------------------------------------------------------------

## 1. Overview

The finished solution uses four main services:

**GitHub** stores the application source code.

**Railway** takes the application from GitHub, builds it, runs it on the
Internet, provides the public website, stores production configuration
variables, and hosts the production database volume.

**Resend** sends confirmation emails from the production application.

**Miss Hosting** manages the DNS records for `softsolutionsahand.com`,
allowing Resend to verify that the restaurant is authorized to send
email using a Softsolution Sahand subdomain.

The final flow is:

``` text
Developer
   ↓
GitHub
   ↓
Railway
   ↓
Public Restaurant Website
   ↓
Customer reserves a table
   ↓
Railway saves the reservation
   ↓
Railway calls Resend
   ↓
Resend sends confirmation email
   ↓
Customer receives email from Nordic Ember
```

The intended sender is:

``` text
Nordic Ember <booking@restaurant.softsolutionsahand.com>
```

------------------------------------------------------------------------

## 2. Why Use Railway?

A restaurant application developed on a local computer is normally
available only on that computer or local network.

To allow customers to use it on the Internet, the application needs
production hosting.

Railway is useful because it can:

-   connect directly to a GitHub repository;
-   build the application automatically;
-   run the frontend and backend online;
-   provide a public HTTPS address;
-   automatically redeploy when new code is pushed to the connected
    GitHub branch;
-   store production environment variables and secrets;
-   provide deployment and application logs;
-   attach persistent storage for data such as a SQLite database.

For the Nordic Ember project, Railway became the production hosting
platform.

------------------------------------------------------------------------

## 3. Prepare the Application in GitHub

Before creating the Railway deployment, the application should already
be stored in a GitHub repository.

### 3.1 Create or use a GitHub repository

Sign in to GitHub and create a repository for the application if one
does not already exist.

For Nordic Ember, the repository contains the complete restaurant
application.

The production branch is:

``` text
main
```

### 3.2 Push the tested application to GitHub

Before connecting Railway, make sure the latest working version has been
committed and pushed to GitHub.

The important principle is:

``` text
Local development
      ↓
Test
      ↓
Commit
      ↓
Push to GitHub
      ↓
Railway deploys
```

Do not store passwords, API keys, email passwords, or other secrets
directly in the GitHub repository.

Those values belong in environment variables.

------------------------------------------------------------------------

## 4. Create a Railway Account

Open the Railway website and create an account or sign in.

When Railway needs access to GitHub, authorize the GitHub connection.

This allows Railway to see the repositories that you permit it to use.

------------------------------------------------------------------------

## 5. Create the Railway Project

After signing in to Railway:

1.  Open the Railway dashboard.
2.  Choose **New Project**.
3.  Select **Deploy from GitHub repo**.
4.  Connect GitHub if Railway asks for permission.
5.  Find the application's GitHub repository.
6.  Select the repository.
7.  Choose the production branch, normally `main`.
8.  Start the deployment.

Railway creates a service for the application and begins building the
project.

------------------------------------------------------------------------

## 6. How GitHub and Railway Work Together

After the repository is connected, GitHub becomes the source for the
Railway service.

The normal workflow is:

``` text
Change application locally
      ↓
Test locally
      ↓
Commit changes
      ↓
Push to GitHub main
      ↓
Railway detects the new commit
      ↓
Railway builds a new deployment
      ↓
New production version becomes active
```

This means it is normally unnecessary to upload application files
manually to Railway.

Before pushing an important change, test it locally first.

After pushing, always verify that the Railway deployment completed
successfully.

------------------------------------------------------------------------

## 7. Configure the Railway Service

Open the application service inside the Railway project.

The most important areas are:

-   **Deployments**
-   **Variables**
-   **Settings**
-   **Networking**
-   **Logs**

### 7.1 Production start configuration

Railway must know how the application starts.

The application's normal production start command should be defined by
the project configuration or Railway service settings.

After deployment, check the logs and confirm that the application server
starts and remains running.

### 7.2 Production port

Railway supplies the port used by the production service.

The application should use Railway's provided port rather than depend
only on a fixed local-development port.

### 7.3 Persistent database storage

Nordic Ember uses SQLite.

Production database data must survive application redeployments, so
persistent Railway storage is used.

For this project the database is stored on a Railway volume.

This is important because the application itself may be rebuilt or
replaced during deployment, while customer reservation data must remain.

------------------------------------------------------------------------

## 8. Create the Public Railway Website

A successful deployment does not automatically mean customers have a
convenient public URL.

Open:

**Railway service → Settings → Networking**

Generate a Railway domain.

Railway then provides a public HTTPS address similar to:

``` text
https://your-application-production.up.railway.app
```

Open that address in a normal browser.

Test the complete restaurant interface:

-   Home
-   Menu
-   Book Table
-   About
-   Contact
-   language selection
-   navigation
-   mobile layout

At this stage the application is publicly accessible.

------------------------------------------------------------------------

## 9. Test Reservations on Railway

Before configuring a new email provider, test the main reservation
process.

A production test should verify that:

1.  the public restaurant website opens;
2.  the customer can select **Book Table**;
3.  date and time can be selected;
4.  guest information can be entered;
5.  the reservation can be confirmed;
6.  the reservation is stored successfully;
7.  the confirmation screen is displayed.

Email should then be tested as a separate part of the workflow.

------------------------------------------------------------------------

## 10. Why We Added Resend

The application originally used Gmail SMTP successfully during local
development.

When deployed to Railway, SMTP was not a reliable production email
solution for this project.

Instead of depending on the same SMTP connection in Railway, we selected
**Resend** for production email.

Resend is suitable because it provides an email API designed for
applications and can be called from the Railway-hosted backend over
HTTPS.

The final approach is:

``` text
Local development → Gmail SMTP

Railway production → Resend
```

This also keeps local testing independent from production email
delivery.

------------------------------------------------------------------------

## 11. Create a Resend Account

Open Resend and create an account.

Complete the account verification requested by Resend and sign in to the
dashboard.

After login, the main areas needed for this project are:

-   **API Keys**
-   **Domains**
-   **Emails / Logs**

------------------------------------------------------------------------

## 12. Create a Resend API Key

Inside Resend:

1.  Open **API Keys**.
2.  Choose **Create API Key**.
3.  Give the key a meaningful name, for example:

``` text
Nordic Ember Railway Production
```

4.  Select an appropriate sending permission.
5.  Create the key.
6.  Copy the generated API key immediately.
7.  Store it securely.

The API key is a secret.

Do not put it in:

-   GitHub source code;
-   public documentation;
-   screenshots intended for publication;
-   frontend JavaScript;
-   blog articles.

Railway will store this secret instead.

------------------------------------------------------------------------

## 13. Connect Railway to Resend

Return to the Railway project.

Open:

**Service → Variables**

Create a new variable named:

``` text
RESEND_API_KEY
```

Paste the secret Resend API key as its value.

Save the variable.

Railway treats service variables as environment variables available to
the deployed application.

When Railway shows pending/staged configuration changes, apply or deploy
them.

After the deployment becomes active, Railway can authenticate to Resend
without exposing the API key to customers or GitHub.

------------------------------------------------------------------------

## 14. First Resend Production Test

Before configuring the Softsolution Sahand domain, Resend can be tested
using its provided onboarding/test sender.

Make one reservation through the public Railway restaurant website.

Confirm that:

1.  Railway accepts the reservation;
2.  the reservation is stored;
3.  Resend receives the email request;
4.  the customer receives the confirmation email.

For Nordic Ember, this first Railway-to-Resend test succeeded.

The received message initially showed a Resend onboarding sender.

That proved that the technical connection worked:

``` text
Railway
   ↓
Resend API
   ↓
Customer email
```

The next goal was to replace the Resend test sender with a professional
Nordic Ember address.

------------------------------------------------------------------------

## 15. Why Use a Softsolution Sahand Subdomain?

The main domain is:

``` text
softsolutionsahand.com
```

It already has other services and subdomains.

For example, FlightFinder uses its own DNS configuration.

Rather than changing existing services, a dedicated restaurant email
subdomain was selected:

``` text
restaurant.softsolutionsahand.com
```

This keeps the restaurant email configuration separate from the main
website and other applications.

The desired customer-facing sender is:

``` text
Nordic Ember <booking@restaurant.softsolutionsahand.com>
```

------------------------------------------------------------------------

## 16. Add the Restaurant Domain to Resend

In Resend:

1.  Open **Domains**.
2.  Choose **Add Domain**.
3.  Enter:

``` text
restaurant.softsolutionsahand.com
```

4.  Select the appropriate European sending region if offered.
5.  Add the domain.

Resend then displays DNS records that must be published by the DNS
provider for `softsolutionsahand.com`.

Do not invent these values.

Always copy the exact DNS names and values displayed by Resend.

------------------------------------------------------------------------

## 17. Why Resend Needs DNS Records

Anyone could otherwise claim to send email using another company's
domain.

Resend therefore asks the domain owner to publish special DNS records.

Because only the owner or administrator of `softsolutionsahand.com` can
normally change its DNS configuration, publishing the Resend-provided
records proves control of the domain.

The DNS records also support email authentication and delivery.

------------------------------------------------------------------------

## 18. Open DNS Management in Miss Hosting

The DNS for `softsolutionsahand.com` is managed in Miss Hosting.

Sign in to the Miss Hosting control panel.

Open:

**Domains → Zone Editor**

Find:

``` text
softsolutionsahand.com
```

Choose **Manage**.

The DNS Zone Editor displays the existing records for the domain.

### Important

Do not delete or replace unrelated existing records.

The existing website, mail configuration, FlightFinder, and other
services should remain untouched.

Only add the new records required for the restaurant/Resend
configuration.

------------------------------------------------------------------------

## 19. Add the Resend DKIM Record in Miss Hosting

Resend provides a DKIM record for the restaurant domain.

In Miss Hosting:

1.  Click **Add Record**.
2.  Select **TXT** as the record type.
3.  Copy the DKIM name exactly from Resend.
4.  Copy the complete DKIM value exactly from Resend.
5.  Use the normal DNS TTL, such as `3600`, if appropriate.
6.  Save the record.

For this project the record name is based on:

``` text
resend._domainkey.restaurant.softsolutionsahand.com
```

The long DKIM content must be copied directly from Resend.

Do not shorten it or manually retype it.

------------------------------------------------------------------------

## 20. Add the Resend Sending CNAME

Resend also requires a sending-related CNAME record.

In Miss Hosting:

1.  Click **Add Record**.
2.  Select **CNAME**.
3.  Enter the name supplied by Resend.
4.  Enter the destination supplied by Resend.
5.  Save the record.

For Nordic Ember the configured record is:

``` text
send.restaurant.softsolutionsahand.com
```

pointing to:

``` text
send.forge.rmta.net
```

These restaurant email records are independent of existing FlightFinder
records.

------------------------------------------------------------------------

## 21. Tell Resend the DNS Records Have Been Added

Return to the Resend domain page.

Click:

**I've added the records**

This does **not** connect Resend directly to the Miss Hosting account.

Resend does not need the Miss Hosting username or password.

Instead:

1.  Miss Hosting publishes the DNS records publicly.
2.  Resend performs public DNS lookups.
3.  Resend searches for the records it previously generated.
4.  Resend compares the public values with the expected values.
5.  Matching records prove that the domain is under your control.

The domain may temporarily display:

``` text
Pending
```

or:

``` text
Checking DNS
```

DNS propagation can take some time.

Do not repeatedly delete correct records simply because verification is
not immediate.

------------------------------------------------------------------------

## 22. Wait for Resend Domain Verification

Refresh the Resend domain page periodically.

The desired final status is:

``` text
Verified
```

Once verified, Resend is authorized to send using the configured
restaurant subdomain.

At that point, the production sender can be configured as:

``` text
Nordic Ember <booking@restaurant.softsolutionsahand.com>
```

------------------------------------------------------------------------

## 23. Configure the Production Sender in Railway

After Resend verifies the domain, return to:

**Railway → Service → Variables**

Add or update the production sender variable used by the application,
for example:

``` text
RESEND_FROM
```

with the value:

``` text
Nordic Ember <booking@restaurant.softsolutionsahand.com>
```

Save the variable and deploy/apply the Railway changes.

The production application should now use:

-   Railway for hosting;
-   Resend for email delivery;
-   the verified Softsolution Sahand restaurant subdomain as the sender
    identity.

------------------------------------------------------------------------

## 24. Final End-to-End Restaurant Test

After Railway is active and the Resend domain is verified, perform a
complete customer test.

### Step 1 --- Open the public restaurant website

Use the Railway public HTTPS address.

### Step 2 --- Open Book Table

Select the reservation section.

### Step 3 --- Enter a realistic reservation

Test:

-   reservation date;
-   reservation time;
-   number of guests;
-   seating area;
-   customer name;
-   telephone number;
-   customer email address;
-   special requests if applicable.

Use an email address you can access so the result can be verified.

### Step 4 --- Confirm the reservation

Submit the reservation once.

### Step 5 --- Check the customer experience

The customer should see that the reservation was accepted.

### Step 6 --- Check Railway

Verify that the production deployment remains healthy and the
reservation has been processed.

### Step 7 --- Check Resend

Open Resend's email activity/log area and confirm that the message was
sent.

### Step 8 --- Check the customer's mailbox

The customer should receive the reservation confirmation.

Verify:

-   sender display name is **Nordic Ember**;
-   sender uses the restaurant Softsolution Sahand domain;
-   customer name is correct;
-   booking reference is present;
-   date is correct;
-   time is correct;
-   guest count is correct;
-   seating information is correct;
-   special requests are correct.

Also check the spam/junk folder during testing if the message does not
appear immediately.

------------------------------------------------------------------------

## 25. The Complete Production Flow

After all configuration is complete:

``` text
GitHub repository
       ↓
Railway automatically deploys the application
       ↓
Customer opens public restaurant website
       ↓
Customer reserves a table
       ↓
Reservation is stored
       ↓
Railway uses RESEND_API_KEY
       ↓
Resend sends the confirmation
       ↓
DNS authenticates restaurant.softsolutionsahand.com
       ↓
Customer receives:
Nordic Ember <booking@restaurant.softsolutionsahand.com>
```

------------------------------------------------------------------------

## 26. Reusing This Manual for Another Application

The same pattern can be reused for future applications.

For another application:

1.  create or prepare its GitHub repository;
2.  test the application locally;
3.  create a Railway project;
4.  connect Railway to the GitHub repository;
5.  configure production variables;
6.  deploy the application;
7.  generate and test the Railway public domain;
8.  create or use a Resend account;
9.  create an API key for the application;
10. store the API key in Railway Variables;
11. choose a dedicated sending subdomain;
12. add the subdomain in Resend;
13. copy Resend's DNS records to Miss Hosting;
14. wait for Resend verification;
15. configure the application's professional sender address;
16. redeploy Railway;
17. perform a complete end-to-end customer test.

A future application could use a different subdomain while leaving
existing applications untouched.

------------------------------------------------------------------------

## 27. Security Checklist

Before using the application for real customers:

-   keep the Resend API key private;
-   keep SMTP passwords private;
-   never commit secrets to GitHub;
-   store production secrets in Railway Variables;
-   restrict API keys to only the permissions required;
-   protect customer reservation data;
-   do not expose administrative reservation information publicly;
-   use HTTPS for the public application;
-   test production email delivery before launch;
-   keep GitHub, Railway, Resend, and Miss Hosting accounts protected
    with strong authentication.

------------------------------------------------------------------------

## 28. Nordic Ember Configuration Summary

### Hosting

``` text
Railway
```

### Source control

``` text
GitHub
```

### Production email provider

``` text
Resend
```

### Main domain

``` text
softsolutionsahand.com
```

### Restaurant email subdomain

``` text
restaurant.softsolutionsahand.com
```

### Intended sender

``` text
Nordic Ember <booking@restaurant.softsolutionsahand.com>
```

### DNS provider

``` text
Miss Hosting
```

### DNS management location

``` text
Miss Hosting
→ Domains
→ Zone Editor
→ softsolutionsahand.com
→ Manage
```

### Deployment relationship

``` text
GitHub → Railway → Resend → Customer
                     ↑
          Miss Hosting DNS verification
```

------------------------------------------------------------------------

## 29. Current Checkpoint

At the current stage:

-   the restaurant application is deployed publicly on Railway;
-   GitHub and Railway are connected;
-   the production reservation workflow has been tested;
-   Railway-to-Resend email delivery has been tested successfully;
-   `restaurant.softsolutionsahand.com` has been added to Resend;
-   the required restaurant DNS records have been added in Miss Hosting;
-   Resend is checking/verifying the custom domain;
-   the final custom-domain sender test should be performed after the
    domain status becomes **Verified**.

------------------------------------------------------------------------

## 30. Add Telegram to the Production Flow

Telegram completes the Nordic Ember deployment by giving customers
another way to discover and open the restaurant application.

The bot used for this project is:

``` text
@NordicEmberBot
```

The complete architecture becomes:

``` text
Local development
      ↓
GitHub
      ↓
Railway
      ├── Public restaurant website
      ├── Reservation backend
      ├── Database
      ├── Resend connection
      └── Telegram bot connection
             ↓
Resend                      Telegram
   ↓                           ↓
Customer email          @NordicEmberBot
                             ↓
                       Open Restaurant
                             ↓
                       Railway website
                             ↓
                       Reserve a table
                             ↓
                  Confirmation email via Resend
```

The same Railway-hosted restaurant application can therefore be opened
directly in a browser or from Telegram.

------------------------------------------------------------------------

## 31. Why Use a Telegram Bot?

A Telegram bot gives the restaurant a permanent Telegram identity.

Customers can search for the bot, open it, read information about the
restaurant, use commands, and launch the restaurant application.

For Nordic Ember the public Telegram identity is:

``` text
@NordicEmberBot
```

Telegram Mini Apps allow a normal web application to be launched inside
Telegram. A bot can expose the Mini App through its profile, menu
button, messages, or direct Telegram links.

------------------------------------------------------------------------

## 32. Open BotFather

Telegram bots are created and administered through Telegram's official
**@BotFather** bot.

In Telegram:

1.  Search for **@BotFather**.
2.  Verify that you are using the official BotFather.
3.  Open the chat.
4.  Press **Start** if necessary.

BotFather provides commands for creating and configuring bots.

------------------------------------------------------------------------

## 33. Create the Nordic Ember Bot

In the BotFather conversation, send:

``` text
/newbot
```

BotFather asks for two important values:

1.  the bot's **Name**;
2.  the bot's **Username**.

### Bot name

The name is the human-readable name customers see.

For this project:

``` text
Nordic Ember
```

### Bot username

The username is the unique Telegram identifier.

For this project:

``` text
NordicEmberBot
```

Telegram bot usernames must end in `bot`, and the username becomes part
of the bot's Telegram address.

The public identity is therefore:

``` text
@NordicEmberBot
```

### There is no separate bot password

BotFather does **not** create a normal password for the bot.

Instead, Telegram generates a **bot token**. The token is the secret
credential that allows the restaurant server to control the bot through
the Telegram Bot API.

Treat the token like a password.

------------------------------------------------------------------------

## 34. Save the Telegram Bot Token Securely

After the bot is created, BotFather provides a token.

The real token must never be placed in:

-   GitHub;
-   public documentation;
-   screenshots for publication;
-   frontend JavaScript;
-   blog articles;
-   public chat messages.

Store the token only in secure configuration such as local environment
settings and Railway Variables.

If a token is accidentally exposed, revoke/regenerate it through
BotFather and update the application configuration.

------------------------------------------------------------------------

## 35. Configure the Bot's Public Information

A professional restaurant bot should not be left with only a username.

Use BotFather to configure the public information customers see.

Open:

``` text
/mybots
```

Select:

``` text
@NordicEmberBot
```

Then open the bot settings/edit options.

### Name

Use:

``` text
Nordic Ember
```

### Description

The description appears when a new user opens the bot and helps explain
what the bot can do.

A suitable description is:

``` text
Welcome to Nordic Ember. Explore our menu, reserve a table, and open the Nordic Ember restaurant app directly in Telegram.
```

### About text

The About text is a shorter description shown on the bot's profile.

For example:

``` text
Nordic Ember restaurant — menu, table reservations and restaurant information.
```

### Profile picture

Upload a clear Nordic Ember restaurant logo or brand image.

The same visual identity should ideally be used by the website and
Telegram bot.

------------------------------------------------------------------------

## 36. Configure Bot Commands

Bot commands make the bot easier to understand.

In BotFather, choose the command configuration for `@NordicEmberBot`.

A simple restaurant command set can include:

``` text
start - Welcome and open Nordic Ember
menu - View the restaurant menu
book - Reserve a table
help - Show help and restaurant information
```

Only configure commands that the application actually supports.

When a customer types `/` in the bot conversation, Telegram can show the
configured commands as suggestions.

------------------------------------------------------------------------

## 37. Connect the Telegram Bot to the Restaurant Backend

Creating the bot in BotFather creates the Telegram identity, but the bot
still needs a server-side application to respond to customers.

For Nordic Ember, that server is the same backend deployed on Railway.

The relationship is:

``` text
Telegram customer
      ↓
@NordicEmberBot
      ↓
Telegram Bot API
      ↓
Nordic Ember backend on Railway
      ↓
Bot response / restaurant link / Mini App
```

The backend uses the secret bot token to authenticate with Telegram.

The token must be read on the **server side**, never from
browser/frontend code.

------------------------------------------------------------------------

## 38. Add the Telegram Token to Railway

Open the Nordic Ember project in Railway.

Go to:

**Service → Variables**

Add the Telegram bot-token variable expected by the restaurant backend.

For example, if the application uses:

``` text
TELEGRAM_BOT_TOKEN
```

create a Railway variable with that exact name and paste the token
generated by BotFather as the value.

Use the exact variable name expected by the application.

After adding or changing the variable:

1.  review the staged Railway change;
2.  apply/deploy it;
3.  wait for the new deployment;
4.  verify that the service becomes active;
5.  inspect the application logs to confirm that the Telegram
    integration started.

Railway Variables keep the secret outside GitHub while making it
available to the running backend.

------------------------------------------------------------------------

## 39. Local Telegram Configuration

For local development, the Telegram token can be stored in the local
environment configuration rather than source code.

The local token and Railway production token may be the same during a
small demonstration project, but only one active polling process should
consume updates for the same bot at a time.

For normal production use, the Railway deployment should be treated as
the active production bot service.

Never commit the local environment file containing the bot token to
GitHub.

------------------------------------------------------------------------

## 40. Connect the Railway Website to the Telegram Bot

Before configuring the Mini App, the Nordic Ember website must already
have a public HTTPS URL.

Railway provides this under the service's networking settings.

The public Railway website is the application URL that Telegram can
open.

The relationship is:

``` text
@NordicEmberBot
      ↓
Open Restaurant / Launch App
      ↓
HTTPS Railway public URL
      ↓
Nordic Ember restaurant application
```

Test the Railway URL directly in a normal browser before adding it to
BotFather.

The website should already support the complete customer reservation
flow.

------------------------------------------------------------------------

## 41. Configure Nordic Ember as a Telegram Mini App

Telegram allows a bot to launch a web application directly inside
Telegram.

For a restaurant application this is useful because the customer can
open the same Nordic Ember interface without leaving Telegram.

In BotFather:

1.  open `/mybots`;
2.  select `@NordicEmberBot`;
3.  open **Bot Settings**;
4.  choose **Configure Mini App** or the current equivalent option;
5.  enable/configure the Mini App;
6.  provide the public HTTPS URL of the Nordic Ember application hosted
    on Railway.

Telegram may provide several Mini App launch options. For Nordic Ember,
the important goal is to make the restaurant application easy to open
from the bot.

------------------------------------------------------------------------

## 42. Configure the Telegram Menu Button

A convenient configuration is to make the bot's menu button launch the
restaurant application.

BotFather supports configuring a Mini App menu button.

Configure:

**Button text**, for example:

``` text
Open Restaurant
```

or:

``` text
Reserve a Table
```

**Mini App URL:**

Use the public HTTPS URL of the Nordic Ember application hosted on
Railway.

The customer experience becomes:

``` text
Open @NordicEmberBot
      ↓
Tap Open Restaurant
      ↓
Nordic Ember opens inside Telegram
      ↓
Browse Menu / Book Table / About / Contact
```

------------------------------------------------------------------------

## 43. Configure the Main Mini App

Telegram also supports a **Main Mini App** for a bot.

When configured, the bot profile can display a prominent button that
launches the application.

For Nordic Ember, configure the Main Mini App through BotFather using
the Railway public HTTPS URL.

This gives customers another simple entry point:

``` text
@NordicEmberBot profile
      ↓
Launch/Open App
      ↓
Nordic Ember Mini App
```

The exact labels shown by Telegram may change as Telegram updates
BotFather, but the concept remains the same: associate the bot with the
production HTTPS application URL.

------------------------------------------------------------------------

## 44. Telegram Direct Links

After the bot exists, customers can find it by its username:

``` text
@NordicEmberBot
```

A Main Mini App can also be opened through Telegram's Mini App link
mechanism after it has been configured.

This can later be useful for:

-   the Softsolution Sahand blog;
-   restaurant QR codes;
-   social media;
-   email;
-   printed restaurant material;
-   customer support messages.

The bot username should remain consistent wherever the restaurant is
promoted.

------------------------------------------------------------------------

## 45. Test the Telegram Bot Before Testing the Mini App

First test the bot itself.

In Telegram:

1.  search for `@NordicEmberBot`;
2.  open the bot;
3.  press **Start**;
4.  verify that the bot responds;
5.  test the configured commands;
6.  verify the name;
7.  verify the description;
8.  verify the About text;
9.  verify the profile image.

If the bot does not respond, check the Railway deployment and Telegram
configuration before testing the Mini App.

------------------------------------------------------------------------

## 46. Test the Nordic Ember Mini App in Telegram

After the bot and Mini App are connected:

1.  open `@NordicEmberBot`;
2.  press the configured **Open Restaurant**, **Launch App**, or
    equivalent Mini App button;
3.  confirm that Nordic Ember opens inside Telegram;
4.  test the Home screen;
5.  test Menu;
6.  test Book Table;
7.  test About;
8.  test Contact;
9.  test language selection;
10. test navigation;
11. test mobile layout inside Telegram.

The Telegram Mini App should use the same production Railway application
that was already tested in a normal browser.

------------------------------------------------------------------------

## 47. Test a Complete Reservation from Telegram

This is the most important final Telegram test.

### Step 1 --- Open Telegram

Open:

``` text
@NordicEmberBot
```

### Step 2 --- Launch Nordic Ember

Use the bot's Mini App/menu/profile button.

### Step 3 --- Open Book Table

Choose the reservation section.

### Step 4 --- Enter a real test reservation

Enter:

-   date;
-   time;
-   number of guests;
-   seating area;
-   customer name;
-   telephone number;
-   an email address you can access;
-   optional special requests.

### Step 5 --- Confirm

Submit the reservation once.

### Step 6 --- Verify the reservation

The Mini App should show that the reservation has been accepted.

### Step 7 --- Verify Railway

Confirm that the Railway application remains healthy and processes the
reservation.

### Step 8 --- Verify Resend

Confirm that Resend processes the reservation confirmation email.

### Step 9 --- Verify the customer email

The customer should receive the reservation email from the verified
Nordic Ember sender.

The expected final experience is:

``` text
Telegram
   ↓
@NordicEmberBot
   ↓
Nordic Ember Mini App
   ↓
Railway
   ↓
Reservation
   ↓
Resend
   ↓
Customer confirmation email
```

------------------------------------------------------------------------

## 48. Telegram and Resend Have Different Responsibilities

It is useful to keep these services conceptually separate.

### Telegram

Telegram provides:

-   the `@NordicEmberBot` identity;
-   customer interaction with the bot;
-   bot commands;
-   the Mini App entry point;
-   a way to open the restaurant application inside Telegram.

### Railway

Railway provides:

-   production application hosting;
-   the public HTTPS restaurant website;
-   the backend;
-   production environment variables;
-   database storage;
-   connection to Telegram;
-   connection to Resend.

### Resend

Resend provides:

-   production reservation confirmation email delivery;
-   the custom sender identity after domain verification.

### Miss Hosting

Miss Hosting provides:

-   DNS management for `softsolutionsahand.com`;
-   the DNS records that prove the restaurant sending domain is
    authorized for Resend.

### GitHub

GitHub provides:

-   source control;
-   the repository Railway deploys.

------------------------------------------------------------------------

## 49. Complete Nordic Ember Production Flow

After all configuration is finished, the complete project flow is:

``` text
DEVELOPMENT
Local computer
      ↓
Test application
      ↓
Git commit
      ↓

SOURCE CONTROL
GitHub
      ↓
Push main
      ↓

PRODUCTION HOSTING
Railway
      ├── builds application
      ├── runs backend
      ├── hosts public website
      ├── stores production variables
      ├── stores persistent reservation data
      ├── connects to Resend
      └── connects to Telegram
            ↓
     ┌──────┴────────┐
     ↓               ↓
  Resend          Telegram
     ↓               ↓
Custom email     @NordicEmberBot
     ↓               ↓
Miss Hosting     Mini App
DNS verification    ↓
     ↓            Railway website
Customer email      ↓
                 Reservation
                     ↓
                  Resend
                     ↓
              Confirmation email
```

This is the complete deployment chain from development to the final
customer experience.

------------------------------------------------------------------------

## 50. Final End-to-End Acceptance Test

Before considering Nordic Ember complete, perform one final production
test.

### Browser test

1.  Open the Railway public website.
2.  Make a reservation.
3.  Confirm the reservation is accepted.
4.  Confirm the customer receives the email from the custom Nordic Ember
    sender.

### Telegram test

1.  Open `@NordicEmberBot`.
2.  Press Start.
3.  Launch the Nordic Ember Mini App.
4.  Make another test reservation.
5.  Confirm the reservation succeeds.
6.  Confirm the customer receives the email.
7.  Verify the sender address.
8.  Verify the booking details.

### Administration check

Confirm that:

-   Railway deployment is active;
-   GitHub contains the intended production version;
-   Railway secrets are configured;
-   Resend domain is verified;
-   Resend API key is active;
-   Miss Hosting DNS records remain present;
-   Telegram bot token is stored securely;
-   BotFather points to the correct production Mini App URL;
-   `@NordicEmberBot` opens the correct application.

------------------------------------------------------------------------

## 51. Reusing the Complete Flow for Another Application

For a future application, the same overall procedure can be reused:

1.  develop and test locally;
2.  create a GitHub repository;
3.  push the tested project;
4.  create a Railway project;
5.  connect Railway to GitHub;
6.  configure Railway variables and persistent storage;
7.  generate a public Railway HTTPS URL;
8.  test the application in a browser;
9.  create/configure Resend;
10. create a Resend API key;
11. add the API key to Railway;
12. select a custom sending subdomain;
13. add the domain in Resend;
14. add the required DNS records in Miss Hosting;
15. wait for Resend verification;
16. test customer email;
17. create a Telegram bot with BotFather;
18. configure its name, username, description, About text, image, and
    commands;
19. store the Telegram bot token in Railway;
20. configure the Railway HTTPS application as the Telegram Mini App;
21. configure the bot's menu/Main Mini App;
22. test the bot;
23. test the Mini App;
24. perform a complete reservation from Telegram;
25. confirm the final customer email.

------------------------------------------------------------------------

## 52. Final Nordic Ember Service Map

  ------------------------------------------------------------------------------------------------
  Purpose                             Service
  ----------------------------------- ------------------------------------------------------------
  Development                         Local Windows development environment

  Source control                      GitHub

  Production hosting                  Railway

  Public restaurant application       Railway HTTPS domain

  Production database storage         Railway persistent volume

  Production email                    Resend

  Email-domain DNS                    Miss Hosting

  Main domain                         `softsolutionsahand.com`

  Restaurant email subdomain          `restaurant.softsolutionsahand.com`

  Customer email sender               `Nordic Ember <booking@restaurant.softsolutionsahand.com>`

  Telegram bot                        `@NordicEmberBot`

  Telegram configuration              BotFather

  Telegram application                Nordic Ember Railway website as a Telegram Mini App
  ------------------------------------------------------------------------------------------------

------------------------------------------------------------------------

## 53. Documentation Maintenance

Keep this Markdown file as the master manual.

Update it whenever:

-   the Railway public/custom domain changes;
-   the Resend sender changes;
-   DNS records change;
-   Telegram bot commands change;
-   the Mini App URL changes;
-   deployment steps change;
-   the production architecture changes.

Because Markdown is editable and works well with GitHub and VS Code, it
is the recommended source document.

When the project is completely finished and tested, a PDF can be
generated from this Markdown manual for distribution or archival use.
