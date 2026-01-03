import { Pushover } from 'pushover-js';
import fs from 'fs';

export class PushoverNotifier {
    private pushover: Pushover;

    constructor(userKey: string, appToken: string) {
        this.pushover = new Pushover(userKey, appToken);
    }

    /**
     * Send a notification with a screenshot attachment
     */
    public async sendNotification(message: string,title: string,screenshotPath?: string): Promise<void> {
        try {
            this.pushover.setSound('pushover');
            this.pushover.setPriority(1);

            if (screenshotPath && fs.existsSync(screenshotPath)) {
                this.pushover.setAttachment('results.png', screenshotPath);
            }

            await this.pushover.send(title, message);
            console.log('Pushover notification sent successfully');
        } catch (error) {
            console.error('Error sending Pushover notification:', error);
            throw error;
        }
    }
}
