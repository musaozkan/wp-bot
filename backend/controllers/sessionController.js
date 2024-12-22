import asyncHandler from "express-async-handler";
import {
  createSession as wsCreateSession,
  getQrCodeStatus,
  cancelSession as wsCancelSession,
} from "../services/webSocketClient.js";

export const createSession = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;
  const userId = req.session.user._id;

  if (!phoneNumber) {
    res.status(400);
    throw new Error("Oturum oluşturmak için telefon numarası gereklidir.");
  }

  try {
    const clientId = `${userId}-${phoneNumber}`;

    // Create a WhatsApp session
    const taskId = wsCreateSession(clientId);

    // Check if task ID exists
    if (!taskId) {
      res.status(500);
      throw new Error("Oturum oluşturulamadı.");
    }

    res.status(200).json({
      taskId,
    });
  } catch (error) {
    console.error("Oturum oluşturma sırasında hata:", error.message);
    res.status(500);
    throw new Error("Oturum oluşturulamadı.");
  }
});

export const cancelSession = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  if (!taskId) {
    res.status(400);
    throw new Error("İptal etmek için görev kimliği gereklidir.");
  }

  try {
    // Cancel WhatsApp session creation
    wsCancelSession(taskId);

    res.status(200).json({
      message: "Oturum oluşturma iptal edildi.",
    });
  } catch (error) {
    console.error("Oturum iptali sırasında hata:", error.message);
    res.status(500);
    throw new Error("Oturum iptal edilemedi.");
  }
});

// Serve QR code status via SSE
export const sseQrStatus = (req, res) => {
  const { taskId } = req.params;

  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Flush headers to initiate SSE connection
  res.flushHeaders();

  // Send initial status
  const qrStatus = getQrCodeStatus(taskId);
  if (qrStatus) {
    res.write(`data: ${JSON.stringify(qrStatus)}\n\n`);
  } else {
    res.write("data: {}\n\n");
  }

  // Subscribe to QR code status updates
  const intervalId = setInterval(() => {
    const qrStatus = getQrCodeStatus(taskId);
    if (qrStatus) {
      res.write(`data: ${JSON.stringify(qrStatus)}\n\n`);
    }
  }, 1000);

  // Handle client disconnect
  req.on("close", () => {
    clearInterval(intervalId);
    res.end();
  });
};
