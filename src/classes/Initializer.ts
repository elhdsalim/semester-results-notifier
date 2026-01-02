import { Config } from '../config/ConfigData';
import { BrowserAutomation } from './ResultsChecker';
import { Store } from './Store';

/**
 * Initializer for the reference file
 */
export class ReferenceInitializer {
    private readonly config: Config;
    private readonly browserAutomation: BrowserAutomation;
    private readonly referenceStorage: Store;

    constructor(private readonly email: string, private readonly password: string) {
        this.config = new Config();
        this.browserAutomation = new BrowserAutomation(this.config);
        this.referenceStorage = new Store(this.config.referenceFileName);
    }

    /**
     * Initialize the reference file with the current results
     */
    public async initialize(): Promise<void> {
        try {
            await this.browserAutomation.initialize();
            await this.browserAutomation.login(this.email, this.password);
            await this.browserAutomation.navigateToResults();

            const results = await this.browserAutomation.extractResults();

            this.referenceStorage.save(results);
            console.log(`Reference file saved in ${this.referenceStorage.getFilePath()}`);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            await this.browserAutomation.close();
        }
    }
}
