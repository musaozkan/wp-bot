const fs = require('fs');
const path = require('path');
const { logToFile } = require('./utils');

// Function to take a screenshot of the currently active chat window
async function outputPageStructure(client, phoneNumber) {
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const screenshotPath = path.join(__dirname, `../screenshots/${phoneNumber}-${timestamp}.png`);

        // Ensure the screenshots directory exists
        if (!fs.existsSync(path.dirname(screenshotPath))) {
            fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
        }

        // Simply take a screenshot of the current page
        if (client.pupPage) {
            await client.pupPage.screenshot({ path: screenshotPath, fullPage: true });
            logToFile(`Screenshot taken and saved at: ${screenshotPath}`);
        } else {
            logToFile(`Unable to access Puppeteer page. Screenshot failed.`, 'ERROR');
        }
    } catch (error) {
        logToFile(`Failed to take screenshot. Error: ${error.message}`, 'ERROR');
    }
}

module.exports = { outputPageStructure };
