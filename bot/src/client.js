const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const path = require('path');
const fs = require('fs');
const { logToFile } = require('./utils');

// Helper function to get clientId from sessionPath
function getClientId(sessionPath) {
    return path.basename(sessionPath); // Extracts only the folder name as clientId
}

function initializeClient(accountConfig, onReady) {
    const clientId = getClientId(accountConfig.sessionPath);
    const sessionDir = path.resolve(__dirname, '../sessions', clientId);

    // Check if the session directory exists
    if (fs.existsSync(sessionDir)) {
        logToFile(`Oturum dizini '${clientId}' 'sessions' içinde bulundu. Oturum tekrar kullanılmaya çalışılıyor.`, 'INFO');
    } else {
        logToFile(`'${clientId}' için oturum dizini 'sessions' içinde bulunamadı. Yeni bir QR kod taraması gerekli.`, 'INFO');
    }

    // Initialize the client with LocalAuth using the 'sessions' directory
    const client = new Client({
        authStrategy: new LocalAuth({
            clientId,
            dataPath: path.resolve(__dirname, '../sessions') // All sessions stored in 'sessions' folder
        })
    });

    client.on('qr', (qr) => {
        // Only display QR code if session data is not found
        if (!fs.existsSync(sessionDir)) {
            logToFile('\nQR kodu tarama için gösteriliyor...', 'INFO');
            qrcode.generate(qr, { small: true });
        }
    });

    client.on('ready', () => {
        logToFile(`WhatsApp istemcisi '${clientId}' için hazır!`, 'INFO');
        onReady(client, accountConfig);
    });

    client.on('auth_failure', (msg) => {
        logToFile(`'${clientId}' için kimlik doğrulama hatası. Sebep: ${msg}`, 'ERROR');
    });

    client.initialize();
}

module.exports = initializeClient;
