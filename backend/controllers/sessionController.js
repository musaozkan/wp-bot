import asyncHandler from "express-async-handler";
import {
  createSession as wsCreateSession,
  getQrCodeStatus,
  cancelSession as wsCancelSession,
  deleteSession as wsDeleteSession,
} from "../services/webSocketClient.js";
import Session from "../models/sessionModel.js";

// **Yeni bir WhatsApp oturumu oluştur**
export const createSession = asyncHandler(async (req, res) => {
  const { sessionName } = req.body;
  const userId = req.session.user._id;

  if (!sessionName) {
    res.status(400);
    throw new Error("Oturum adı gereklidir.");
  }

  try {
    const taskId = wsCreateSession();
    if (!taskId) {
      res.status(500);
      throw new Error("Oturum oluşturulamadı.");
    }

    const session = new Session({
      user: userId,
      name: sessionName,
      taskId,
      status: "pending",
    });

    await session.save();
    res.status(200).json({ taskId });
  } catch (error) {
    console.error("❌ Oturum oluşturma hatası:", error.message);
    res.status(500).json({ error: "Oturum oluşturulamadı." });
  }
});

// **Tüm oturumları getir**
export const getSessions = asyncHandler(async (req, res) => {
  const userId = req.session.user._id;
  const sessions = await Session.find({ user: userId });
  res.status(200).json(sessions);
});

// **Oturumu iptal et veya sil**
export const cancelSession = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { type } = req.query;

  const session = await Session.findOne({ taskId });

  if (!session) {
    res.status(404);
    throw new Error("Oturum bulunamadı.");
  }

  try {
    if (type === "delete") {
      wsDeleteSession(taskId);
      res.status(200).json({ message: "Oturum silindi." });
    } else {
      wsCancelSession(taskId);
      res.status(200).json({ message: "Oturum oluşturma iptal edildi." });
    }
  } catch (error) {
    console.error("❌ Oturum iptali sırasında hata:", error.message);
    res.status(500).json({ error: "Oturum iptal edilemedi veya silinemedi." });
  }
});

// **SSE ile QR kod durumunu dinle**
export const sseQrStatus = (req, res) => {
  const { taskId } = req.params;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const sendQrUpdate = () => {
    const qrStatus = getQrCodeStatus(taskId);
    if (qrStatus) {
      res.write(`data: ${JSON.stringify(qrStatus)}\n\n`);
    }
  };

  const intervalId = setInterval(sendQrUpdate, 1000);

  req.on("close", () => {
    clearInterval(intervalId);
    res.end();
  });
};
