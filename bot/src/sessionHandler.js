// src/sessionHandler.js
const fs = require('fs');
const path = require('path');
const { logToFile } = require('./utils');

function cleanupSessions(sessionPath) {
    logToFile(`Oturumlar temizleniyor: ${sessionPath}`, 'BİLGİ');
    try {
        fs.readdirSync(sessionPath).forEach((file) => {
            const fullPath = path.join(sessionPath, file);
            fs.rmSync(fullPath, { recursive: true, force: true });
            logToFile(`Silindi: ${fullPath}`, 'BİLGİ');
        });
    } catch (error) {
        logToFile(`Oturumları temizleme başarısız: ${error.message}`, 'HATA');
    }
}

module.exports = { cleanupSessions };
