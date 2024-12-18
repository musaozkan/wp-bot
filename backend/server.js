import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import loggerMiddleware from "./middleware/loggerMiddleware.js";
import corsMiddleware from "./middleware/corsMiddleware.js";
import sessionMiddleware from "./middleware/sessionMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import templateRoutes from "./routes/templateRoutes.js";
import numberListRoutes from "./routes/numberListRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import { connectWebSocket } from "./services/webSocketClient.js";

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

// Middleware
app.use(loggerMiddleware);
app.use(corsMiddleware);
app.use(sessionMiddleware);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/numbers", numberListRoutes);
app.use("/api/sessions", sessionRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Create WebSocket Connection
connectWebSocket("ws://localhost:8080");

app.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});
