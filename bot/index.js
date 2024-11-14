const path = require('path');
const sendMessages = require(path.join(__dirname, './src/sendMessages'));
const settings = require(path.join(__dirname, './config/settings.json'));
const initializeClient = require(path.join(__dirname, './src/client'));
const { outputPageStructure } = require(path.join(__dirname, './src/screenshotHandler'));

// Start the dynamic sessions
async function startDynamicSessions() {
    const accountPromises = settings.accounts.map((accountConfig) =>
        new Promise((resolve) => {
            initializeClient(accountConfig, async (client) => {
                await outputPageStructure(client); // Optional for debugging purposes
                await sendMessages(client, accountConfig);
                resolve();
            });
        })
    );

    await Promise.all(accountPromises);
    console.log('All WhatsApp sessions have been initialized and completed messaging.');
}

startDynamicSessions();
