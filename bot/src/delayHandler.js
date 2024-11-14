const { logToFile } = require('./utils');
const config = require('../config/settings.json');

// Idle interval for logging every 10 seconds
const IDLE_LOG_INTERVAL = 10000;

async function ensureWithinSendHours(accountConfig) {
    const { start, end } = config.sendBetweenHours;

    while (true) {
        const currentHour = new Date().getHours();
        if (currentHour >= start && currentHour < end) {
            logToFile(`[${accountConfig.sessionPath}] Mevcut saat izin verilen saatler içinde (${start}:00 - ${end}:00). Mesaj gönderimine devam ediliyor.`);
            break;
        } else {
            logToFile(`[${accountConfig.sessionPath}] İzin verilen saatler dışında (${start}:00 - ${end}:00). Bekleme durumuna geçiliyor. 1 dakika sonra tekrar kontrol ediliyor.`);
            await delayWithIdle(60000, accountConfig);
        }
    }
}

async function delayWithIdle(ms, accountConfig) {
    for (let elapsed = 0; elapsed < ms; elapsed += IDLE_LOG_INTERVAL) {
        logToFile(`[${accountConfig.sessionPath}] ${(ms - elapsed) / 1000} saniye daha bekleme durumunda...`);
        await new Promise(resolve => setTimeout(resolve, Math.min(IDLE_LOG_INTERVAL, ms - elapsed)));
    }
}

module.exports = { ensureWithinSendHours, delayWithIdle };
