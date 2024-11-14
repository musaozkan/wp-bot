const sendMessages = require('./src/sendMessages'); // Adjusted path
const settings = require('./config/settings.json'); // Adjusted if config is in config folder
const initializeClient = require('./src/client'); // Adjust the path if client.js is elsewhere

async function startDynamicSessions() {
    const accountPromises = settings.accounts.map((accountConfig) =>
        new Promise((resolve) => {
            initializeClient(accountConfig, async (client) => {
                await sendMessages(client, accountConfig);
                resolve();
            });
        })
    );

    await Promise.all(accountPromises);
    console.log('All WhatsApp sessions have been initialized and completed messaging.');
}

startDynamicSessions();
