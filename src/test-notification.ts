import dotenv from 'dotenv';
import { PushoverNotifier } from './classes/PushoverNotifier.js';
import fs from 'fs';
import path from 'path';

dotenv.config();

const PUSHOVER_USER_KEY = process.env.PUSHOVER_USER_KEY;
const PUSHOVER_APP_TOKEN = process.env.PUSHOVER_APP_TOKEN;

if (!PUSHOVER_USER_KEY || !PUSHOVER_APP_TOKEN) {
    console.error('Error: please define PUSHOVER_USER_KEY and PUSHOVER_APP_TOKEN in your .env');
    process.exit(1);
}

async function testNotification() {
    console.log('Testing Pushover notification...\n');

    const notifier = new PushoverNotifier(PUSHOVER_USER_KEY!, PUSHOVER_APP_TOKEN!);

    const screenshotsDir = path.join(process.cwd(), 'screenshots');
    let screenshotPath: string | undefined;

    if (fs.existsSync(screenshotsDir)) {
        const files = fs.readdirSync(screenshotsDir)
            .filter(file => file.endsWith('.png'))  // get the most recent first image
            .sort()
            .reverse();

        if (files.length > 0) {
            screenshotPath = path.join(screenshotsDir, files[0]);
            console.log(`Using screenshot: ${files[0]}\n`);
        } else {
            console.log('No screenshots found in screenshots/ directory');
        }
    }

    try {
        await notifier.sendNotification(
            'test!',
            'test',
            screenshotPath
        );
        console.log('\nTest notification sent successfully!');
    } catch (error) {
        console.error('\nFailed to send test notification:', error);
        process.exit(1);
    }
}

testNotification();
