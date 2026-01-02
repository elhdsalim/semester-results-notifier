import dotenv from 'dotenv';
import { Config } from './config/ConfigData.js';
import { BrowserAutomation } from './classes/ResultsChecker.js';
import { Store } from './classes/Store.js';

dotenv.config();

const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

if (!EMAIL || !PASSWORD) {
    console.error('Error: please define EMAIL and PASSWORD in your .env');
    process.exit(1);
}

async function initialize() {
    const config = new Config();
    const browserAutomation = new BrowserAutomation(config);
    const referenceStorage = new Store(config.referenceFileName);

    console.log('Initializing reference file...\n');

    try {
        await browserAutomation.initialize();

        await browserAutomation.login(EMAIL, PASSWORD);

        await browserAutomation.navigateToResults();

        const currentResults = await browserAutomation.extractResults();

        referenceStorage.save(currentResults);
        console.log(`File saved in: ${referenceStorage.getFilePath()}`);

        console.log('\nExtracted results:');
        console.log(currentResults);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    } finally {
        await browserAutomation.close();
    }
}

initialize();
