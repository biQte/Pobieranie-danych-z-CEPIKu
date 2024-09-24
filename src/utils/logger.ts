import fs from 'fs';
import path from 'path';

let currentDate: Date | null = null;
let currentLogFilePath: string | null = null;

export default class Logger {
    static log(message: string) {
        const now = new Date();
        const dateOnly = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
        );

        if (!currentDate || dateOnly.getTime() !== currentDate.getTime()) {
            currentDate = dateOnly;

            const logsDirectory = path.join(__dirname, '..', 'logs');

            if (!fs.existsSync(logsDirectory)) {
                fs.mkdirSync(logsDirectory, { recursive: true });
            }

            const filename = `${dateOnly
                .toLocaleDateString()
                .replace(/\//g, '-')}.txt`;
            currentLogFilePath = path.join(logsDirectory, filename);
        }

        const localTime = new Date(now.getTime());

        const logMessage = `${localTime.toLocaleString()} ${message}\n`;

        if (currentLogFilePath) {
            fs.appendFileSync(currentLogFilePath, logMessage, 'utf8');
        }
    }
}
