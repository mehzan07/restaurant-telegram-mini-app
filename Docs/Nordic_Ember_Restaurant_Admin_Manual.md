# Nordic Ember Restaurant — Administrator Manual

## 1. Purpose

This manual explains how restaurant administrators and staff use the Nordic Ember Admin Dashboard.

It focuses on daily reservation management and the configurable customer UI language setting.

Administrators normally do not need to edit source code.

## 2. Open the Admin Dashboard

Open the restaurant application and choose **Admin**, or open:

```text
/admin
```

Example:

```text
https://your-restaurant-domain.example/admin
```

Enter the administrator password configured for the restaurant installation.

## 3. Dashboard Statistics

The Admin Dashboard provides summary statistics such as:

- **Today** — reservations for today
- **This week** — reservations for the current week
- **This month** — reservations for the current month
- **Total** — all reservations stored in the system

These statistics are independent of the search and filter controls.

## 4. Search and Filter Reservations

Use the administration controls to find reservations by:

- customer name or search text;
- booking reference;
- phone number;
- email address;
- reservation status;
- reservation date.

The exact search and filter controls depend on the installed version.

## 5. Reservation Statuses

| Status | Meaning |
|---|---|
| Confirmed | Reservation is confirmed |
| Arrived | Guest has arrived |
| Completed | Visit has been completed |
| Cancelled | Reservation was cancelled |
| Did not arrive | Guest did not arrive |

## 6. Create a Reservation from Admin

Staff can create a reservation directly from the Admin Dashboard, for example when a guest books by phone.

Enter the required information:

- number of guests;
- date;
- time;
- seating area;
- guest name;
- country code;
- phone number;
- email address when available;
- special requests;
- internal admin notes when needed.

Save the reservation and confirm that it appears in the reservation list.

## 7. Edit a Reservation

Open the reservation and change the required information, such as:

- guest count;
- date;
- time;
- seating area;
- guest name;
- phone number;
- email address;
- special requests;
- administrator notes.

Save the changes and verify that the updated information is displayed.

## 8. Change Reservation Status

Use the status controls as the reservation progresses through the guest journey.

A typical workflow is:

```text
Confirmed
   ↓
Arrived
   ↓
Completed
```

Use **Cancelled** when a reservation is cancelled.

Use **Did not arrive** when the guest does not arrive.

## 9. Delete a Reservation

Use deletion only when the reservation should genuinely be removed according to the restaurant's operating procedure.

Before deleting, check the booking reference and guest information carefully.

## 10. Configure Customer UI Languages

Nordic Ember supports four UI languages:

- English
- Swedish
- Farsi
- Turkish

The default configuration is:

```text
☑ English
☑ Swedish
☐ Farsi
☐ Turkish
```

The restaurant administrator can change this selection without changing source code and without running a script.

### Change the language selection

In the Admin Dashboard, open the **Visible languages** area.

You will see language options similar to:

```text
☑ English       English interface
☑ Swedish       Svenskt gränssnitt
☐ Farsi         Persian interface
☐ Turkish       Türkçe arayüz
```

Enable the languages that customers should be allowed to select.

Then click:

```text
Save language settings
```

### Important rule

At least one language must remain enabled.

The application prevents the administrator from saving a configuration with zero languages.

### Verify the result

After saving:

1. Open the customer restaurant interface.
2. Refresh the page if it was already open.
3. Open the Language selector.
4. Confirm that only the enabled languages are visible.

For example:

```text
Admin setting:
☑ English
☑ Swedish
☑ Farsi
☐ Turkish

Customer selector:
English
Svenska
فارسی
```

## 11. Language Settings Are Persistent

The language configuration is stored in SQLite.

This means the selected languages are not supposed to disappear when the server restarts.

After a deployment, verify the configuration once as part of the production acceptance test.

## 12. What the Language Setting Does Not Change

The language setting controls the customer-facing UI language selector.

It does not automatically translate restaurant menu content, dish descriptions, prices, contact information, or other restaurant data.

Restaurant content remains managed as application content.

## 13. One-Time Developer Script

A developer installation script named:

```text
nordic_ember_configurable_languages.py
```

was used to install the language feature.

Restaurant administrators should **not** run this script during normal operation.

The normal workflow is:

```text
Developer installs feature once
        ↓
Admin uses Admin Dashboard
        ↓
Admin changes languages
        ↓
Save
        ↓
Customer sees the selected languages
```

## 14. Recommended Daily Workflow

At the beginning of the day:

1. Open Admin.
2. Check **Today**.
3. Review today's reservations.
4. Review special requests.
5. Make any required reservation corrections.

During service:

1. Mark arriving guests **Arrived**.
2. Mark finished visits **Completed**.
3. Mark cancelled bookings **Cancelled**.
4. Mark no-shows **Did not arrive**.

## 15. Returning to the Restaurant App

Use the **Restaurant** navigation provided by the application to return to the customer-facing interface.

The normal navigation is:

```text
Admin Dashboard → Restaurant → Admin → Admin Dashboard
```

## 16. Security Rules

Never share the Admin password with customers.

Never place the following values in public documentation or frontend code:

- administrator password;
- admin session secret;
- Telegram bot token;
- Resend API key;
- SMTP password.

Only authorized staff should use the Admin Dashboard.

## 17. Administrator Acceptance Checklist

Before considering the installation ready for daily use, verify:

- Admin login works;
- Today/This week/This month/Total statistics work;
- search works;
- date/status filters work;
- reservations can be created;
- reservations can be edited;
- statuses can be changed;
- deletion works when intended;
- language settings can be changed;
- at least one language is enforced;
- the customer selector reflects the saved language configuration;
- the language configuration remains after a server restart;
- customer reservation email continues to work.
