// src/utils.js
const fs = require('fs');
const path = require('path');

// Logs dosyasının veri dizinindeki yolu tanımlayın
const logFilePath = path.join(__dirname, '../data/logs.txt');

// Veri dizininin mevcut olduğundan emin olun
if (!fs.existsSync(path.dirname(logFilePath))) {
    fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
}

function logToFile(message, level = 'BİLGİ') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}\n`;
    fs.appendFileSync(logFilePath, logMessage);
    console.log(logMessage.trim()); // Gerçek zamanlı izleme için ayrıca konsola çıktı ver
}

module.exports = { logToFile };
