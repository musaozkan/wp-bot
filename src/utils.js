const fs = require('fs');
const path = require('path');

// Define the path to the logs file in the data directory
const logFilePath = path.join(__dirname, '../data/logs.txt');

// Ensure the data directory exists
if (!fs.existsSync(path.dirname(logFilePath))) {
    fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
}

function logToFile(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}\n`;
    fs.appendFileSync(logFilePath, logMessage);
    console.log(logMessage.trim());
}

module.exports = { logToFile };
