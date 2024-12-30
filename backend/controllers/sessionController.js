import asyncHandler from "express-async-handler";
import {
  createSession as wsCreateSession,
  getQrCodeStatus,
  cancelSession as wsCancelSession,
  deleteSession as wsDeleteSession,
} from "../services/webSocketClient.js";
import Session from "../models/sessionModel.js";

export const createSession = asyncHandler(async (req, res) => {
  const { phoneNumber, sessionName } = req.body;
  const userId = req.session.user._id;

  if (!phoneNumber) {
    res.status(400);
    throw new Error("Oturum oluşturmak için telefon numarası gereklidir.");
  }

  if (!sessionName) {
    res.status(400);
    throw new Error("Oturum oluşturmak için oturum adı gereklidir.");
  }

  try {
    // Create a WhatsApp session
    const taskId = wsCreateSession();

    // Check if task ID exists
    if (!taskId) {
      res.status(500);
      throw new Error("Oturum oluşturulamadı.");
    }

    // Save session details to database
    const session = new Session({
      user: userId,
      name: sessionName,
      taskId,
      phoneNumber,
    });

    await session.save();

    res.status(200).json({
      taskId,
    });
  } catch (error) {
    console.error("Oturum oluşturma sırasında hata:", error.message);
    res.status(500);
    throw new Error("Oturum oluşturulamadı.");
  }
});

// Cancel WhatsApp session creation or delete a session
export const cancelSession = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { type } = req.query;

  if (!taskId) {
    res.status(400);
    if (type === "delete") {
      res.status(400);
      throw new Error("Silmek için görev kimliği gereklidir.");
    } else {
      res.status(400);
      throw new Error("İptal etmek için görev kimliği gereklidir.");
    }
  }

  /*
  const sessionSchema = mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
      name: {
        type: String,
        required: true,
      },
      taskId: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );
  */

  // Find and delete session by task ID
  const session = await Session.findOne({ taskId });

  if (!session) {
    res.status(404);
    throw new Error("Oturum bulunamadı.");
  }

  await Session.deleteOne({ taskId });

  try {
    if (type === "delete") {
      // Delete WhatsApp session
      wsDeleteSession(taskId);

      res.status(200).json({
        message: "Oturum silindi.",
      });
    } else {
      // Cancel WhatsApp session creation
      wsCancelSession(taskId);

      res.status(200).json({
        message: "Oturum oluşturma iptal edildi.",
      });
    }
  } catch (error) {
    console.error("Oturum iptali sırasında hata:", error.message);
    res.status(500);
    throw new Error("Oturum iptal edilemedi veya silinemedi.");
  }
});

// Get all sessions
export const getSessions = asyncHandler(async (req, res) => {
  const userId = req.session.user._id;

  const sessions = await Session.find({ user: userId });

  res.status(200).json(sessions);
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
