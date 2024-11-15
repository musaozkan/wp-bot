// src/sendMessages.js
const { MessageMedia } = require('whatsapp-web.js');
const { logToFile } = require('./utils');
const config = require('../config/settings.json');
const { checkMessageStatus } = require('./statusChecker');
const { loadContacts, removeContact } = require('./contactManager');
const { delayWithIdle, ensureWithinSendHours } = require('./delayHandler');

// Sabit bekleme süresi: 10 dakika
const FIXED_DELAY = 10 * 60 * 1000;

async function sendMessages(client, accountConfig) {
    await ensureWithinSendHours(accountConfig);
    let firstMessageSent = false;

    while (true) {
        let contacts = loadContacts();

        if (contacts.length === 0) {
            logToFile(`[${accountConfig.sessionPath}] Hiç kontak bulunamadı. 'contacts.txt' dosyasının yeniden doldurulması bekleniyor.`);
            await delayWithIdle(10000, accountConfig); // Kontak yoksa 10 saniye bekle
            continue;
        }

        for (let phoneNumber of contacts) {
            try {
                if (firstMessageSent) {
                    logToFile(`[${accountConfig.sessionPath}] Bir sonraki mesaj gönderimi için 10 dakika bekleniyor.`);
                    await delayWithIdle(FIXED_DELAY, accountConfig);
                } else {
                    firstMessageSent = true;
                }

                const sentSuccessfully = await sendMessageWithDelay(client, phoneNumber, accountConfig.messageId, accountConfig);

                if (sentSuccessfully) {
                    removeContact(phoneNumber);
                    logToFile(`[${accountConfig.sessionPath}] ${phoneNumber} numarasına mesaj başarıyla gönderildi ve kontak listeden çıkarıldı.`);
                } else {
                    logToFile(`[${accountConfig.sessionPath}] ${phoneNumber} numarasına mesaj gönderilemedi, kontak listede tutuluyor.`);
                }

            } catch (error) {
                logToFile(`[${accountConfig.sessionPath}] ${phoneNumber} numarasına mesaj gönderilemedi: ${error.message}`, 'HATA');
            }
        }
    }
}

// Opsiyonel medya ile mesaj gönderme yardımcı fonksiyonu
async function sendMessageWithDelay(client, phoneNumber, messageId, accountConfig) {
    const messageConfig = config.messages[messageId];
    if (!messageConfig) {
        logToFile(`[${accountConfig.sessionPath}] Mesaj ID '${messageId}' yapılandırmada bulunamadı.`, 'HATA');
        return false;
    }

    const { text, mediaPaths } = messageConfig;
    const chatId = `${phoneNumber.trim()}@c.us`;

    try {
        let sentMessage;

        if (mediaPaths && mediaPaths.length > 0) {
            for (let mediaPath of mediaPaths) {
                const media = MessageMedia.fromFilePath(mediaPath);
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
        logToFile(`[${accountConfig.sessionPath}] ${phoneNumber} numarasına mesaj gönderilemedi. Hata: ${error.message}`, 'HATA');
        return false;
    }
}

module.exports = sendMessages;
