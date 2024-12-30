import express from "express";
import {
  createSession,
  getSessions,
  cancelSession,
  sseQrStatus,
} from "../controllers/sessionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to create a new session
router.post("/", protect, createSession);

// Route to get all sessions
router.get("/", protect, getSessions);

// Route to cancel a session creation
router.delete("/:taskId", protect, cancelSession);

// Route to serve QR code status via SSE
router.get("/qr-status/:taskId", sseQrStatus);

export default router;
