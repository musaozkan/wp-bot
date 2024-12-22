import express from "express";
import {
  createSession,
  cancelSession,
  sseQrStatus,
} from "../controllers/sessionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to create a new session
router.post("/", protect, createSession);

// Route to cancel a session creation (not implemented)
router.delete("/:taskId", protect, cancelSession);

// Route to serve QR code status via SSE
router.get("/qr-status/:taskId", protect, sseQrStatus);

export default router;
