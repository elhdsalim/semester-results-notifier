import puppeteer, { Browser, Page } from 'puppeteer';
import { Config } from '../config/ConfigData';

export class BrowserAutomation {
    private browser: Browser | null = null;
    private page: Page | null = null;

    constructor(private readonly config: Config) {}

    /**
     * Starts the navigator and create a new page
     */
    public async initialize(): Promise<void> {
        this.browser = await puppeteer.launch({
            headless: this.config.headless
        });

        this.page = await this.browser.newPage();

        await this.page.setViewport({
            width: this.config.viewportWidth,
            height: this.config.viewportHeight
        });
    }

    /**
     * Login to the student portal
     */
    public async login(email: string, password: string): Promise<void> {
        if (!this.page) {
            throw new Error('There is no page?');
        }

        await this.page.goto(
            'https://cas.univ-lille.fr/login?service=https%3A%2F%2Fmon-dossier-etudiant.univ-lille.fr%2Flogin%2Fcas#!etatCivilView'
        );

        await this.page.keyboard.type(email);
        await this.page.keyboard.press('Tab');
        
        await this.page.keyboard.type(password);
        await this.page.keyboard.press('Enter');

        await this.wait();
    }

    /**
     * Navigate to the results page
     */
    public async navigateToResults(): Promise<void> {
        if (!this.page) {
            throw new Error('Error with the navigator (page)');
        }

        await this.page.goto('https://mon-dossier-etudiant.univ-lille.fr/');
        await this.wait();

        await this.page.click(
            '#ROOT-2521314 > div > div.v-verticallayout.v-layout.v-vertical.v-widget.v-has-width.v-has-height > div > div > div > div > div:nth-child(1) > div > div > div:nth-child(8)'
        );
        await this.wait();
    }

    /**
     * Extract the results of the page
     */
    public async extractResults(): Promise<(string | null)[]> {
        if (!this.page) {
            throw new Error('Error with the navigator (page)');
        }

        const results = await this.page.$$eval(
            '#ROOT-2521314 tbody tr',
            (rows) => rows.map((row) => {
                const td = row.querySelector('td:nth-child(6)');
                if (!td) return null;

                const inner = td.querySelector('div div div div');
                return inner?.textContent?.trim() ?? null;
            })
        );

        return results;
    }

    /**
     * Take a screenshot of the results page
     */
    public async takeScreenshot(filePath: string): Promise<void> {
        if (!this.page) {
            throw new Error('Error with the navigator (page)');
        }

        await this.page.screenshot({
            path: filePath,
            fullPage: true
        });
    }

    /**
     * Close the navigator
     */
    public async close(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
            this.page = null;
        }
    }

    /**
     * Wait a delay
     */
    private async wait(): Promise<void> {
        await new Promise((resolve) =>
            setTimeout(resolve, this.config.waitDelayMs)
        );
    }
}
