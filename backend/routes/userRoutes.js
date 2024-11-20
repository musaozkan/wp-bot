import express from "express";
import {
  checkSession,
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/userController.js";

const router = express.Router();

// Kullanıcı rotaları
router.get("/check-session", checkSession); // Check Session
router.post("/register", registerUser); // Register
router.post("/login", loginUser); // Login
router.delete("/logout", logoutUser); // Logout

export default router;
