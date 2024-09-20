"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
let currentDate = null;
let currentLogFilePath = null;
class Logger {
    static log(message) {
        const now = new Date();
        const dateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (!currentDate || dateOnly.getTime() !== currentDate.getTime()) {
            currentDate = dateOnly;
            const filename = `${dateOnly
                .toLocaleDateString()
                .replace(/\//g, "-")}.txt`;
            currentLogFilePath = path_1.default.join(__dirname, "..", "logs", filename);
        }
        const localTime = new Date(now.getTime());
        const logMessage = `${localTime.toLocaleString()} ${message}\n`;
        if (currentLogFilePath) {
            fs_1.default.appendFileSync(currentLogFilePath, logMessage, "utf8");
        }
    }
}
exports.default = Logger;
