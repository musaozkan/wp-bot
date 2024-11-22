import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  checkSession,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/logout", protect, logoutUser);
router.get("/check-session", checkSession);

export default router;
