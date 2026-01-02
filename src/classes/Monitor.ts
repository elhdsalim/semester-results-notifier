import { Config } from '../config/ConfigData';
import { BrowserAutomation } from './ResultsChecker';
import { Store } from './Store';
import { Comparator } from './Comparator';


export class Monitor {
    private readonly config: Config;
    private readonly browserAutomation: BrowserAutomation;
    private readonly referenceStorage: Store;
    private readonly resultComparator: Comparator;

    constructor(private readonly email: string, private readonly password: string) {
        this.config = new Config();
        this.browserAutomation = new BrowserAutomation(this.config);
        this.referenceStorage = new Store(this.config.referenceFileName);
        this.resultComparator = new Comparator();
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

            console.log('\n=== RESULTS ===');
            if (changes.length > 0) {
                console.log('NEW MARKS DETECTED:');
                changes.forEach(({ index, value, oldValue }) => {
                    console.log(`[${index}] "${oldValue}" -> "${value}"`);
                });
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
        console.log(`Waiting ${intervalMinutes} minutes\n`);
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
