// index.js
const path = require('path');
const sendMessages = require('./src/sendMessages');
const settings = require('./config/settings.json');
const initializeClient = require('./src/client');
const { outputPageStructure } = require('./src/screenshotHandler');

// Dinamik oturumları başlat
async function startDynamicSessions() {
    const accountPromises = settings.accounts.map((accountConfig) =>
        new Promise((resolve) => {
            initializeClient(accountConfig, async (client) => {
                await outputPageStructure(client);
                await sendMessages(client, accountConfig);
                resolve();
            });
        })
    );

    await Promise.all(accountPromises);
    console.log('Tüm WhatsApp oturumları başlatıldı ve mesaj gönderimi tamamlandı.');
}

startDynamicSessions();
