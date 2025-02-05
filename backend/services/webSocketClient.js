import WebSocket from "ws";
import { v4 as uuidv4 } from "uuid";

let wsClient = null;
const qrStatusStore = new Map();

// WebSocket bağlantısını oluştur ve yönet
export const connectWebSocket = (url) => {
  if (wsClient) return wsClient;

  wsClient = new WebSocket(url);

  wsClient.on("open", () => {
    console.log("✅ WebSocket Client Connected");
  });

  wsClient.on("message", handleMessage);

  wsClient.on("close", () => {
    console.warn("⚠️ WebSocket Disconnected. Reconnecting...");
    wsClient = null;
    setTimeout(() => connectWebSocket(url), 3000); // Otomatik tekrar bağlan
  });

  wsClient.on("error", (err) => {
    console.error("❌ WebSocket Error:", err.message);
  });

  return wsClient;
};

// Gelen mesajları işle
const handleMessage = (message) => {
  try {
    const parsedMessage = JSON.parse(message);
    switch (parsedMessage.type) {
      case "qr":
        handleQrMessage(parsedMessage.payload);
        break;
      case "status":
        handleStatusMessage(parsedMessage.payload);
        break;
      case "error":
        console.error("❌ WebSocket Error:", parsedMessage.payload.message);
        break;
      default:
        console.warn("⚠️ Unknown WebSocket message type:", parsedMessage.type);
    }
  } catch (err) {
    console.error("❌ WebSocket Message Parsing Error:", err.message);
  }
};

// QR kod mesajlarını işle
const handleQrMessage = (payload) => {
  const { qr, taskId } = payload;
  qrStatusStore.set(taskId, { qr, status: "qr-received" });
};

// Session durumlarını yönet
const handleStatusMessage = (payload) => {
  const { message, taskId } = payload;
  if (message === "Session creation cancelled") {
    qrStatusStore.delete(taskId);
  } else if (message === "Client is ready") {
    qrStatusStore.set(taskId, { status: "client-ready" });
  }
};

// WebSocket üzerinden mesaj gönder
const sendMessage = (type, payload) => {
  if (wsClient && wsClient.readyState === WebSocket.OPEN) {
    wsClient.send(JSON.stringify({ type, payload }));
  } else {
    console.error("❌ WebSocket Client is not connected.");
  }
};

// WhatsApp session yönetimi
export const createSession = () => {
  const taskId = uuidv4();
  qrStatusStore.set(taskId, { status: "pending" });
  sendMessage("createSession", { taskId });
  return taskId;
};

export const cancelSession = (taskId) => {
  sendMessage("cancelSession", { taskId });
  qrStatusStore.delete(taskId);
};

export const deleteSession = (taskId) => {
  sendMessage("deleteSession", { taskId });
  qrStatusStore.delete(taskId);
};

export const getQrCodeStatus = (taskId) => qrStatusStore.get(taskId) || null;
