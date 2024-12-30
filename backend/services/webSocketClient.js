import WebSocket from "ws";
import { v4 as uuidv4 } from "uuid";

let wsClient = null;

// Store for QR code and session statuses
const qrStatusStore = new Map();

// Connect to WebSocket Server
export const connectWebSocket = (url) => {
  if (wsClient) return wsClient;

  wsClient = new WebSocket(url);

  wsClient.on("open", handleOpen);
  wsClient.on("message", handleMessage);
  wsClient.on("close", handleClose);
  wsClient.on("error", handleError);

  return wsClient;
};

// Handle WebSocket open event
const handleOpen = () => {
  console.log("WebSocket Client Connected");
};

// Handle WebSocket message event
const handleMessage = (message) => {
  try {
    const parsedMessage = JSON.parse(message);
    console.log("Message from WebSocket Server:", parsedMessage);

    switch (parsedMessage.type) {
      case "qr":
        handleQrMessage(parsedMessage.payload);
        break;
      case "status":
        handleStatusMessage(parsedMessage.payload);
        break;
      case "error":
        handleErrorMessage(parsedMessage.payload.message);
        break;
      default:
        console.warn("Unknown message type:", parsedMessage.type);
    }
  } catch (err) {
    console.error("Failed to process WebSocket message:", err.message);
  }
};

// Handle QR code messages
const handleQrMessage = (payload) => {
  const { qr, taskId } = payload;

  // Update QR code status
  const qrStatus = qrStatusStore.get(taskId);
  qrStatusStore.set(taskId, { ...qrStatus, qr, status: "qr-received" });
};

// Handle status messages
const handleStatusMessage = (payload) => {
  const { message, taskId } = payload;
  if (message === "Session creation cancelled") {
    qrStatusStore.delete(taskId);
  } else if (message === "Client is ready") {
    const qrStatus = qrStatusStore.get(taskId);
    qrStatusStore.set(taskId, { ...qrStatus, status: "client-ready" });
  }
};

// Handle error messages
const handleErrorMessage = (message) => {
  console.error("Error received:", message);
};

// Handle WebSocket close event
const handleClose = () => {
  console.log("WebSocket Client Disconnected");
  wsClient = null;
};

// Handle WebSocket error event
const handleError = (error) => {
  console.error("WebSocket Client Error:", error.message);
};

// Send a message to the WebSocket server
const sendMessage = (type, payload) => {
  if (wsClient && wsClient.readyState === WebSocket.OPEN) {
    const message = { type, payload };
    wsClient.send(JSON.stringify(message));
    console.log("Message sent to WebSocket Server:", message);
  } else {
    console.error("WebSocket Client is not connected.");
  }
};

// Create a new WhatsApp session
export const createSession = () => {
  const taskId = uuidv4();

  // Initialize session status
  qrStatusStore.set(taskId, { qr: null, status: "pending" });

  sendMessage("createSession", { taskId });

  return taskId;
};

// Cancel a WhatsApp session creation
export const cancelSession = (taskId) => {
  if (!taskId) {
    console.error("Task ID is required to cancel a session.");
    return;
  }

  sendMessage("cancelSession", { taskId });
};

export const deleteSession = (taskId) => {
  if (!taskId) {
    console.error("Task ID is required to delete a session.");
    return;
  }

  sendMessage("deleteSession", { taskId });
};

// Get QR code for a given task ID and
export const getQrCodeStatus = (taskId) => {
  const qrStatus = qrStatusStore.get(taskId);
  return qrStatus ? qrStatus : null;
};
