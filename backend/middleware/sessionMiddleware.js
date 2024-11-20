import session from "express-session";
import FileStore from "session-file-store";
import dotenv from "dotenv";

dotenv.config();

const FileStoreSession = FileStore(session);

const sessionMiddleware = session({
  store: new FileStoreSession({
    path: "./sessions",
    retries: 1,
    ttl: 7200,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 2,
  },
});

export default sessionMiddleware;
