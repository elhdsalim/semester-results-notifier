import dotenv from 'dotenv';
import { Monitor } from './classes/Monitor.js';

dotenv.config();

const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

if (!EMAIL || !PASSWORD) {
    console.error('Error: please define EMAIL and PASSWORD in your .env');
    process.exit(1);
}

const monitor = new Monitor(EMAIL, PASSWORD);

monitor.start().catch((error) => {
    console.error('Error:', error);
    process.exit(1);
});