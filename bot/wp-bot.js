import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;

// WebSocket Setup
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 }, () => {
  console.log("WebSocket server running on port 8080");
});

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", async (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      const { type, payload } = parsedMessage;

      if (type === "createSession") {
        const client = new Client({
          authStrategy: new LocalAuth({ clientId: payload.clientId }),
        });

        client.on("qr", (qr) => {
          console.log("QR Code received:", qr);
          ws.send(JSON.stringify({ type: "qr", payload: { qr } }));
        });

        client.on("ready", () => {
          console.log("Client is ready");
          ws.send(
            JSON.stringify({
              type: "status",
              payload: { message: "Client is ready" },
            })
          );
        });

        client.on("message", (msg) => {
          console.log("Message received:", msg.body);
        });

        client.initialize();
      } else {
        ws.send(
          JSON.stringify({
            type: "error",
            payload: { message: "Unknown message type" },
          })
        );
      }
    } catch (err) {
      console.error("Error processing message:", err);
      ws.send(
        JSON.stringify({
          type: "error",
          payload: { message: "Invalid message format" },
        })
      );
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
