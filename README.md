# Semester Results Notifier

## Description

This project uses Puppeteer to automate login to a student portal and continuously monitor the results page. When new results are detected, the system notifies you immediately via push notifications.


## Features

- Automated login to student portal
- Monitoring with configurable intervals
- Detects when there is a new result
- Takes screenshots of results page
- Sends push notifications via Pushover with screenshot attachments

## Installation

1. Clone the repository:
```bash
git clone https://github.com/elhdsalim/semester-results-notifier.git
cd semester-results-notifier
```

2. Install dependencies:
```bash
npm install
```

3. Environment:
```bash
cp .env.example .env
```

4. Edit the `.env` file with your credentials:
```env
EMAIL="your.email@example.com"
PASSWORD="your_password"
PUSHOVER_USER_KEY="your_pushover_user_key"
PUSHOVER_APP_TOKEN="your_pushover_app_token"
```

To get your Pushover credentials:
- Sign up at [https://pushover.net](https://pushover.net)
- Your User Key is shown on your dashboard
- Create a new application to get an App Token

## Usage

### First run - Initialization

Before starting the monitoring, you need to create a reference file with your current results:

```bash
npm run init
```

This command will:
- Connect to the student account
- Extract the current results
- Create a `reference.json` file that will serve as a baseline for comparison

### Start Monitoring

Once the reference file is created, start the monitor:

```bash
npm start
```

The system will:
- Check your results every minute (configurable)
- Compare with the reference file
- Display any newly detected results
- Take a screenshot when new results are found
- Send a Pushover notification with the screenshot attached
- Save screenshots in the `screenshots/` directory

## Configuration

Parameters are defined in [src/config/ConfigData.ts](src/config/ConfigData.ts):

```typescript
checkIntervalMs: 1 * 60 * 1000, // Check interval (1 minute)
viewportWidth: 1080, // Browser window width
viewportHeight: 1024, // Browser window height
waitDelayMs: 3000, // Wait delay between actions
headless: false, // Headless mode
referenceFileName: 'reference.json' // Reference file name
```

To modify these settings, edit the `ConfigData.ts` file directly.

## Reference File Format

The `reference.json` file contains:

```json
{
  "lastUpdate": "2026-01-02T10:30:00.000Z",
  "results": [
    '',    '',        'ADM',
    '',    'ADM',      '',
    '',    '',        '',
    '',    'ADM',     'AJ',
    'ADM', 'ADM', 'ADM',
    ''
    ]
}
```

## Stack

- TypeScript
- Puppeteer
- Node.js
- Pushover (push notifications)