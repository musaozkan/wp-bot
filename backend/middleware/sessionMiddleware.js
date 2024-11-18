import session from "express-session";
import FileStore from "session-file-store";
import dotenv from "dotenv";

dotenv.config();

const FileStoreSession = FileStore(session);

const sessionMiddleware = session({
  store: new FileStoreSession({
    path: "./sessions", // Session dosyalarının kaydedileceği dizin
    retries: 1, // Kaydetme deneme sayısı
    ttl: 7200, // Session süresi (saniye cinsinden, burada 2 saat)
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 2, // 2 saat
  },
});

export default sessionMiddleware;
