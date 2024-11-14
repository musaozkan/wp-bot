const { MessageMedia } = require('whatsapp-web.js');
const { logToFile } = require('./utils');
const config = require('../config/settings.json');
const { checkMessageStatus } = require('./statusChecker');
const { takeScreenshotOfChat } = require('./screenshotHandler'); // Import the correct function
const { loadContacts, removeContact } = require('./contactManager');
const { delayWithIdle, ensureWithinSendHours } = require('./delayHandler');

// Fixed delay of 10 minutes
const FIXED_DELAY = 10 * 60 * 1000;

async function sendMessages(client, accountConfig) {
    await ensureWithinSendHours(accountConfig);
    let firstMessageSent = false;

    while (true) {
        let contacts = loadContacts();

        if (contacts.length === 0) {
            logToFile(`[${accountConfig.sessionPath}] Kontak yok. 'contacts.txt' dosyasının yeniden doldurulması bekleniyor.`);
            await delayWithIdle(10000, accountConfig); // Wait 10 seconds until contacts are refilled
            continue;
        }

        for (let phoneNumber of contacts) {
            try {
                if (firstMessageSent) {
                    logToFile(`[${accountConfig.sessionPath}] 10 dakikalık bekleme süresi başladı. Mesaj gönderimi için bekleniyor...`);
                    await delayWithIdle(FIXED_DELAY, accountConfig);
                } else {
                    firstMessageSent = true;
                }

                const sentSuccessfully = await sendMessageWithDelay(client, phoneNumber, accountConfig.messageId, accountConfig);

                if (sentSuccessfully) {
                    removeContact(phoneNumber);
                    logToFile(`[${accountConfig.sessionPath}] ${phoneNumber} numarasına mesaj başarılı bir şekilde gönderildi ve kontak listeden silindi.`);
                } else {
                    logToFile(`[${accountConfig.sessionPath}] ${phoneNumber} numarasına mesaj gönderilemedi, kontak listede korunuyor.`);
                }

            } catch (error) {
                logToFile(`[${accountConfig.sessionPath}] ${phoneNumber} numarasına mesaj gönderilemedi: ${error}`);
            }
        }
    }
}

// Helper function to send a message with optional media
async function sendMessageWithDelay(client, phoneNumber, messageId, accountConfig) {
    const messageConfig = config.messages[messageId];
    if (!messageConfig) {
        logToFile(`[${accountConfig.sessionPath}] Mesaj ID'si '${messageId}' yapılandırmada bulunamadı.`, 'ERROR');
        return false;
    }

    const { text, mediaPaths } = messageConfig;
    const chatId = `${phoneNumber.trim()}@c.us`;

    try {
        let sentMessage;

        if (mediaPaths && mediaPaths.length > 0) {
            for (let path of mediaPaths) {
                const media = MessageMedia.fromFilePath(path);
                sentMessage = await client.sendMessage(chatId, media, { caption: text });
            }
        } else {
            sentMessage = await client.sendMessage(chatId, text);
        }

        logToFile(`[${accountConfig.sessionPath}] ${phoneNumber} numarasına mesaj gönderildi.`);
        
        checkMessageStatus(sentMessage, accountConfig.sessionPath);
        await takeScreenshotOfChat(client, chatId, phoneNumber);
        
        return true;
    } catch (error) {
        logToFile(`[${accountConfig.sessionPath}] ${phoneNumber} numarasına mesaj gönderilemedi. Hata: ${error.message}`, 'ERROR');
        return false;
    }
}

module.exports = sendMessages;
