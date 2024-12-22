import pkg from "whatsapp-web.js";
import { WebSocketServer } from "ws";

const { Client, LocalAuth } = pkg;

// Create WebSocket server
const wss = new WebSocketServer({ port: 8080 }, () => {
  console.log("WebSocket server running on port 8080");
});

// Handle WebSocket connection
wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (message) => handleClientMessage(ws, message));
  ws.on("close", handleClientDisconnection);
});

// Handle incoming client message
const handleClientMessage = async (ws, message) => {
  try {
    const parsedMessage = JSON.parse(message);
    const { type, payload } = parsedMessage;

    switch (type) {
      case "createSession":
        await handleCreateSession(ws, payload);
        break;
      case "cancelSession":
        await handleCancelSession(ws, payload.taskId);
        break;
      default:
        sendError(ws, "Unknown message type");
        break;
    }
  } catch (err) {
    console.error("Error processing message:", err);
    sendError(ws, "Invalid message format");
  }
};

// Store active clients
const clients = new Map();

// Cancel session creation
const handleCancelSession = async (ws, taskId) => {
  const client = clients.get(taskId);
  if (client) {
    client.destroy();
    clients.delete(taskId);
    sendStatus(ws, "Session creation cancelled", taskId);
  }
};

// Create a new WhatsApp session
const handleClientCreate = (ws, clientId, taskId) => {
  try {
    const client = new Client({
      authStrategy: new LocalAuth({ clientId }),
    });

    client.on("qr", (qr) => sendQrCode(ws, qr, taskId));
    client.on("ready", () => sendStatus(ws, "Client is ready"));
    client.initialize();
    clients.set(taskId, client);
  } catch (err) {
    console.error("Error creating session:", err);
    sendError(ws, "Failed to create session");
  }
};

// Handle session creation
const handleCreateSession = async (ws, payload) => {
  try {
    handleClientCreate(ws, payload.clientId, payload.taskId);
  } catch (err) {
    console.error("Error creating session:", err);
    sendError(ws, "Failed to create session");
  }
};

// Send QR code to client
const sendQrCode = (ws, qr, taskId) => {
  console.log("Sending QR code to client:", taskId);
  ws.send(
    JSON.stringify({
      type: "qr",
      payload: { qr, taskId },
    })
  );
};

// Send status message to client
const sendStatus = (ws, message, taskId) => {
  ws.send(
    JSON.stringify({
      type: "status",
      payload: { message, taskId },
    })
  );
};

// Send error message to client
const sendError = (ws, errorMessage) => {
  ws.send(
    JSON.stringify({
      type: "error",
      payload: { message: errorMessage },
    })
  );
};

// Handle WebSocket disconnection
const handleClientDisconnection = () => {
  console.log("Client disconnected");
};
