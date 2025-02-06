import pkg from "whatsapp-web.js";
import { WebSocketServer } from "ws";
import fs from "fs";
import path from "path";

// ES Module içinde __dirname oluştur
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SESSION_DIR = path.join(__dirname, "sessions");
console.log(`📁 Session Directory: ${SESSION_DIR}`);

const { Client, LocalAuth } = pkg;

// WebSocket server başlat
const wss = new WebSocketServer({ port: 8080 }, () => {
  console.log("✅ WebSocket server running on port 8080");
});

// Aktif WhatsApp istemcilerini tutan Map nesnesi
const clients = new Map();

// WebSocket bağlantılarını yönet
wss.on("connection", (ws) => {
  console.log("🔗 New client connected");

  ws.on("message", (message) => handleClientMessage(ws, message));
  ws.on("close", () => {
    console.log("❌ Client disconnected");
  });
});

// **İstemciden gelen mesajları işle**
const handleClientMessage = async (ws, message) => {
  try {
    const { type, payload } = JSON.parse(message);

    if (!payload || !payload.taskId) {
      return sendMessage(ws, "error", "Invalid payload structure");
    }

    switch (type) {
      case "createSession":
        handleCreateSession(ws, payload.taskId);
        break;
      case "cancelSession":
        handleCancelSession(ws, payload.taskId);
        break;
      case "deleteSession":
        handleDeleteSession(ws, payload.taskId);
        break;
      default:
        sendMessage(ws, "error", "Unknown message type");
        break;
    }
  } catch (err) {
    console.error("❌ Error processing message:", err);
    sendMessage(ws, "error", "Invalid JSON format");
  }
};

// **Yeni bir WhatsApp istemcisi oluştur**
const handleCreateSession = (ws, taskId) => {
  if (clients.has(taskId)) {
    return sendMessage(ws, "error", "Session already exists");
  }

  try {
    const client = new Client({
      authStrategy: new LocalAuth({
        clientId: taskId,
        dataPath: SESSION_DIR,
      }),
    });

    client.on("qr", (qr) => sendMessage(ws, "qr", { qr, taskId }));
    client.on("ready", () =>
      sendMessage(ws, "status", { message: "Client is ready", taskId })
    );

    client.initialize();
    clients.set(taskId, client);

    sendMessage(ws, "status", { message: "Session created", taskId });
  } catch (err) {
    console.error("❌ Error creating session:", err);
    sendMessage(ws, "error", "Failed to create session");
  }
};

// **Session iptal et**
const handleCancelSession = (ws, taskId) => {
  if (!clients.has(taskId)) {
    return sendMessage(ws, "error", "Session not found");
  }

  clients.get(taskId).destroy();
  clients.delete(taskId);

  sendMessage(ws, "status", { message: "Session creation cancelled", taskId });
};

// **Session sil**
const handleDeleteSession = (ws, taskId) => {
  if (!clients.has(taskId)) {
    return sendMessage(ws, "error", "Session not found");
  }

  clients.get(taskId).destroy();
  clients.delete(taskId);

  sendMessage(ws, "status", { message: "Session deleted", taskId });
};

// **WebSocket istemcisine mesaj gönderme fonksiyonu**
const sendMessage = (ws, type, payload) => {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify({ type, payload }));
  }
};
