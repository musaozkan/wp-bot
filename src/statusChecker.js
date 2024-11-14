const { logToFile } = require('./utils');

function checkMessageStatus(message, sessionPath) {
    const status = message.ack;
    let statusText;

    switch (status) {
        case -1:
            statusText = 'Hata: Mesaj gönderilemedi';
            break;
        case 0:
            statusText = 'Mesaj gönderildi';
            break;
        case 1:
            statusText = 'Mesaj teslim edildi';
            break;
        case 2:
            statusText = 'Mesaj okundu';
            break;
        default:
            statusText = 'Bilinmeyen durum';
            break;
    }

    logToFile(`[${sessionPath}] Mesaj durumu: ${statusText}`);
}

module.exports = { checkMessageStatus };
