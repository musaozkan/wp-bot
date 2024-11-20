import cors from "cors";

const allowedOrigins = ["http://localhost:3001"];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(
        new Error("CORS hatası: İzin verilmeyen bir kaynaktan erişim isteği.")
      );
    }
  },
  credentials: true,
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
