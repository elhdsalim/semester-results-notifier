export class Config {
    public readonly checkIntervalMs: number;

    public readonly viewportWidth: number;

    public readonly viewportHeight: number;

    public readonly waitDelayMs: number;

    public readonly headless: boolean;

    public readonly referenceFileName: string;

    constructor() {
        this.checkIntervalMs = 1 * 60 * 1000;
        this.viewportWidth = 2000;
        this.viewportHeight = 1024;
        this.waitDelayMs = 3000;
        this.headless = false;
        this.referenceFileName = 'reference.json';
    }
    public getCheckIntervalInMinutes(): number {
        return this.checkIntervalMs / 1000 / 60;
    }
}
