# Jeton Reservation Check and Schedule Management

With limitation in resourses you have to work with, you gain creativity to solve your problem.

This script is part of the [Reservereminder](https://github.com/theycallmerubik/ReservReminder) designed to manage reminders for university food reservations. The code automates the process of checking whether the reservation system has been updated for the next week and adjusts scheduling accordingly.

## Overview

This script was created to lower the original bots's resource consumption and to add the automated features to the original project with the help of [APIFY](https://apify.com/).

This script performs the following key functions:

1. **Automated Login and Navigation**: Logs into the reservation system using stored credentials and navigates to the relevant page to check for updates.
2. **Schedule Management**:
   - Deletes any existing schedules except for Monday's schedule.
   - Creates a new schedule to re-check the reservation system every 2 hours if it hasn't been updated.
3. **Integration with Telegram Bot**: Sends a POST request to the bot's `/status` endpoint to update the reservation status.

---

## Features

- **Automated Site Login**: Uses Puppeteer to log in and navigate through the reservation system.
- **Dynamic Scheduling**:
  - Deletes outdated schedules to maintain efficiency.
  - Creates a recurring schedule to periodically check for updates if the system isn't ready.
- **Telegram Bot Integration**: Updates the bot with the reservation system's status via a secure API endpoint.
- **Error Handling**: Includes robust error handling for HTTP requests and Puppeteer actions.

---

## Prerequisites

1. **Environment Variables**: Create a `.env` file in the root directory with the following keys:
   ```env
   JET_USERNAME=your_username_for_jeton
   JET_PASSWORD=your_password_for_jeton
   APIFY_TOKEN=your_apify_api_token
   SECRET_KEY=your_bot_api_secret_key
   ```
2. **Dependencies**: Install the required npm packages:
   - `puppeteer`
   - `dotenv`
   - `node-fetch`

---

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/theycallmerubik/web-scraping-script.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the necessary environment variables as described in the **Prerequisites** section.

---

## How It Works

1. **Jeton Reservation Check**:
   - The script logs into the Jeton reservation system and checks if the next week's menu is available.
   - If the system is updated:
     - Deletes all schedules except Monday's schedule.
     - Sends a POST request to the Telegram bot, marking the system as updated.
   - If the system is not updated:
     - Creates a new schedule to re-check the system every 3 hours.
2. **Schedule Management**:
   - Utilizes the Apify API to manage schedules dynamically.
   - Ensures efficient scheduling by removing redundant or outdated tasks.

---

## Key Functions

### `deleteSchedulesExceptMonday()`
- Deletes all schedules except for Monday's schedule (identified by its cron expression: `0 14 * * 1`).

### `createScheduleEvery2Hours()`
- Creates a recurring schedule to check the reservation system every 3 hours, ensuring updates are caught in a timely manner.

### `checkNextWeekMenu()`
- Main function that:
  - Logs into the Jeton reservation system.
  - Checks if the next week's menu is available.
  - Updates the Telegram bot or creates a new schedule based on the system's status.

---

## Troubleshooting

- **Login Issues**: Ensure your Jeton username and password are correct and match the credentials in the `.env` file.
- **Schedule API Errors**: Verify that your Apify API token is valid and has the necessary permissions.
- **Bot Integration Issues**: Double-check the `/status` endpoint and `SECRET_KEY` in the `.env` file.

---

## License

This script is licensed under the MIT License.

---

## Contact

For questions or suggestions, contact:

- Telegram: [@Ru\_bic](https://t.me/Ru_Bic)
- Email: [rubikmanyt@Gmail.com](mailto\:rubikmanyt@Gmail.com)