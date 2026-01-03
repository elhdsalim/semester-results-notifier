import dotenv from 'dotenv';
import { Monitor } from './classes/Monitor.js';

dotenv.config();

const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const PUSHOVER_USER_KEY = process.env.PUSHOVER_USER_KEY;
const PUSHOVER_APP_TOKEN = process.env.PUSHOVER_APP_TOKEN;

if (!EMAIL || !PASSWORD) {
    console.error('Error: please define EMAIL and PASSWORD in your .env');
    process.exit(1);
}

if (!PUSHOVER_USER_KEY || !PUSHOVER_APP_TOKEN) {
    console.warn('Error: please define PUSHOVER_USER_KEY and PUSHOVER_APP_TOKEN in your .env');
}

const monitor = new Monitor(EMAIL, PASSWORD, PUSHOVER_USER_KEY, PUSHOVER_APP_TOKEN);

monitor.start().catch((error) => {
    console.error('Error:', error);
    process.exit(1);
});