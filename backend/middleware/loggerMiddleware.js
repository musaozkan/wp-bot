import { createLogger, format, transports } from "winston";
import path from "path";
import fs from "fs";

// Log dosyalarının kaydedileceği dizin
const logDirectory = path.join(process.cwd(), "logs");

// Log dizinini oluştur
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Logger yapılandırması
const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new transports.File({
      filename: path.join(logDirectory, "error.log"),
      level: "error",
    }),
    new transports.File({
      filename: path.join(logDirectory, "warn.log"),
      level: "warn",
    }),
    new transports.File({
      filename: path.join(logDirectory, "info.log"),
      level: "info",
    }),
    new transports.File({
      filename: path.join(logDirectory, "debug.log"),
      level: "debug",
    }),
    new transports.File({
      filename: path.join(logDirectory, "combined.log"),
    }),
  ],
});

// Geliştirme ortamında konsol çıktısı için
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
}

const loggerMiddleware = (req, res, next) => {
  const { method, url } = req;
  const startTime = Date.now();

  // Request bilgilerini logla
  logger.info(`Request: ${method} ${url}`);
  logger.debug(`Headers: ${JSON.stringify(req.headers)}`);
  logger.debug(`Query Params: ${JSON.stringify(req.query)}`);
  logger.debug(`Body: ${JSON.stringify(req.body)}`);

  // Yanıtı loglamak için bir wrapper
  const originalSend = res.send;
  res.send = (body) => {
    const responseTime = Date.now() - startTime;
    logger.info(`Response: ${res.statusCode} - ${body}`);
    logger.debug(`Response Time: ${responseTime}ms`);
    return originalSend.call(res, body);
  };

  // Hataları yakalamak için 'finish' eventini kullan
  res.on("finish", () => {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      logger.warn(`Client Error: ${res.statusCode} - ${method} ${url}`);
    } else if (res.statusCode >= 500) {
      logger.error(`Server Error: ${res.statusCode} - ${method} ${url}`);
    }
  });

  next();
};

export default loggerMiddleware;
