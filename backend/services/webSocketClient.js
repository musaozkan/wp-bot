import WebSocket from "ws";
import { v4 as uuidv4 } from "uuid";
import Session from "../models/sessionModel.js";

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
const handleMessage = async (message) => {
  try {
    const parsedMessage = JSON.parse(message);
    switch (parsedMessage.type) {
      case "qr":
        await handleQrMessage(parsedMessage.payload);
        break;
      case "status":
        await handleStatusMessage(parsedMessage.payload);
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

// QR kod mesajlarını işle ve MongoDB'ye kaydet
const handleQrMessage = async (payload) => {
  const { qr, taskId } = payload;
  qrStatusStore.set(taskId, { qr, status: "qr-received" });
};

// Session durumlarını yönet ve MongoDB'yi güncelle
const handleStatusMessage = async (payload) => {
  const { message, taskId } = payload;

  if (message === "Session creation cancelled") {
    qrStatusStore.delete(taskId);
    await Session.findOneAndDelete({ taskId });
  } else if (message === "Session deleted") {
    qrStatusStore.delete(taskId);
    await Session.findOneAndDelete({ taskId });
  } else if (message === "Client is ready") {
    qrStatusStore.set(taskId, { status: "client-ready" });
    await Session.findOneAndUpdate({ taskId }, { status: "client-ready" });
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

export const cancelSession = async (taskId) => {
  sendMessage("cancelSession", { taskId });
};

export const deleteSession = async (taskId) => {
  sendMessage("deleteSession", { taskId });
};

export const getQrCodeStatus = (taskId) => qrStatusStore.get(taskId) || null;
