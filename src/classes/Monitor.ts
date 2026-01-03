import { Config } from '../config/ConfigData';
import { BrowserAutomation } from './ResultsChecker';
import { Store } from './Store';
import { Comparator } from './Comparator';
import { PushoverNotifier } from './PushoverNotifier';
import path from 'path';
import fs from 'fs';


export class Monitor {
    private readonly config: Config;
    private readonly browserAutomation: BrowserAutomation;
    private readonly referenceStorage: Store;
    private readonly resultComparator: Comparator;
    private readonly pushoverNotifier?: PushoverNotifier;
    private readonly screenshotsDir: string;

    constructor(private readonly email: string, private readonly password: string, pushoverUserKey?: string, pushoverAppToken?: string) {
        this.config = new Config();
        this.browserAutomation = new BrowserAutomation(this.config);
        this.referenceStorage = new Store(this.config.referenceFileName);
        this.resultComparator = new Comparator();

        if (pushoverUserKey && pushoverAppToken) {
            this.pushoverNotifier = new PushoverNotifier(pushoverUserKey, pushoverAppToken);
        }

        this.screenshotsDir = path.join(process.cwd(), 'screenshots');
        if (!fs.existsSync(this.screenshotsDir)) {
            fs.mkdirSync(this.screenshotsDir, { recursive: true });
        }
    }

    public async checkForNewResults(): Promise<void> {
        if (!this.referenceStorage.exists()) {
            console.error('Reference file doesn\'t exist');
            console.log('Please first run the initializer script.');
            return;
        }

        const referenceData = this.referenceStorage.load();
        console.log('Reference loaded (last update:', referenceData.lastUpdate, ')');
        console.log('Reference:', referenceData.results);
        console.log('\nChecking for new marks...\n');

        try {
            await this.browserAutomation.initialize();
            await this.browserAutomation.login(this.email, this.password);
            await this.browserAutomation.navigateToResults();
            const currentResults = await this.browserAutomation.extractResults();

            console.log('Current state', currentResults);

            const changes = this.resultComparator.compare(
                currentResults,
                referenceData.results
            );

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const screenshotPath = path.join(this.screenshotsDir, `results-${timestamp}.png`);

            await this.browserAutomation.takeScreenshot(screenshotPath);
            console.log(`Screenshot saved: ${screenshotPath}`);

            console.log('\n=== RESULTS ===');
            if (changes.length > 0) {
                console.log('NEW MARKS DETECTED:');
                changes.forEach(({ index, value, oldValue }) => {
                    console.log(`[${index}] "${oldValue}" -> "${value}"`);
                });

                if (this.pushoverNotifier) {
                    const changesText = changes
                        .map(({ index, value, oldValue }) => `[${index}] "${oldValue}" -> "${value}"`)
                        .join('\n');

                    await this.pushoverNotifier.sendNotification(
                        `New marks detected:\n${changesText}`,
                        'New Semester Results Available!',
                        screenshotPath
                    );
                }

                this.referenceStorage.save(currentResults);
                console.log('Reference file updated with new results');
            } else {
                console.log('No new marks detected');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            await this.browserAutomation.close();
        }
    }


    public async start(): Promise<void> {
        const intervalMinutes = this.config.getCheckIntervalInMinutes();
        console.log('Starting monitoring...');
        console.log('='.repeat(60));

        let checkCount = 0;

        while (true) {
            checkCount++;
            const timestamp = new Date().toLocaleString('fr-FR');

            console.log(`\n\nVerifying #${checkCount} - ${timestamp}`);
            console.log('='.repeat(60));

            try {
                await this.checkForNewResults();
            } catch (error) {
                console.error('Error:', error);
            }

            console.log('\n' + '='.repeat(60));
            console.log(`Next verification in ${intervalMinutes} minutes...`);
            console.log('='.repeat(60));

            await this.sleep(this.config.checkIntervalMs);
        }
    }

    private sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
