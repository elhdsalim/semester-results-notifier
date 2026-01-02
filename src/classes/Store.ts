import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { ReferenceData } from '../types/ReferenceData';

/**
 * Handle the reference storage
 */
export class Store {
    private readonly filePath: string;

    constructor(fileName: string) {
        this.filePath = join(process.cwd(), fileName);
    }

    /**
     * Check if the reference data already exists
     */
    public exists(): boolean {
        return existsSync(this.filePath);
    }

    /**
     * Load reference data
     */
    public load(): ReferenceData {
        if (!this.exists()) {
            throw new Error("This file doesn't exist");
        }

        const content = readFileSync(this.filePath, 'utf-8');
        return JSON.parse(content);
    }

    /**
     * Save new results as the new reference data (to avoid spam)
     */
    public save(results: (string | null)[]): void {
        const referenceData: ReferenceData = {
            lastUpdate: new Date().toISOString(),
            results: results
        };

        writeFileSync(this.filePath,JSON.stringify(referenceData, null, 2), 'utf-8');
    }

    /**
     * Return the reference's file path
     */
    public getFilePath(): string {
        return this.filePath;
    }
}
