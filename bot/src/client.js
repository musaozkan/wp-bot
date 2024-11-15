// src/client.js
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const path = require('path');
const fs = require('fs');
const { logToFile } = require('./utils');
const { cleanupSessions } = require('./sessionHandler');

// Helper function to get clientId from sessionPath
function getClientId(sessionPath) {
    return path.basename(sessionPath); // Sadece klasör adını clientId olarak alır
}

function initializeClient(accountConfig, onReady) {
    const clientId = getClientId(accountConfig.sessionPath);
    const sessionDir = path.resolve(__dirname, '../sessions', clientId);

    // Oturum dizininin mevcut olup olmadığını kontrol edin
    if (fs.existsSync(sessionDir)) {
        logToFile(`Oturum dizini '${clientId}' bulundu. Oturum yeniden kullanılmaya çalışılıyor.`, 'BİLGİ');
    } else {
        logToFile(`'${clientId}' için oturum dizini bulunamadı. Yeni bir QR taraması gerekiyor.`, 'BİLGİ');
    }

    // 'sessions' dizini kullanarak LocalAuth ile istemciyi başlatın
    const client = new Client({
        authStrategy: new LocalAuth({
            clientId,
            dataPath: path.resolve(__dirname, '../sessions'),
        }),
    });

    client.on('qr', (qr) => {
        if (!fs.existsSync(sessionDir)) {
            logToFile('QR kodu tarama için gösteriliyor...', 'BİLGİ');
            qrcode.generate(qr, { small: true });
        }
    });

    client.on('ready', () => {
        logToFile(`WhatsApp istemcisi '${clientId}' hazır!`, 'BİLGİ');
        onReady(client, accountConfig);
    });

    client.on('auth_failure', (msg) => {
        logToFile(`Kimlik doğrulama hatası '${clientId}': ${msg}`, 'HATA');
        cleanupSessions(sessionDir); // Kimlik doğrulama hatasında oturum verilerini temizleyin
    });

    client.initialize();
}

module.exports = initializeClient;
