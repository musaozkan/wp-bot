import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/userController.js";

const router = express.Router();

// Kullanıcı rotaları
router.post("/register", registerUser); // Register
router.post("/login", loginUser); // Login
router.delete("/logout", logoutUser); // Logout

export default router;
