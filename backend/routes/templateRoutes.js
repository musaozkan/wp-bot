import express from "express";
import multer from "multer";
import {
  createTemplate,
  getTemplates,
  getTemplateById,
  editTemplate,
  deleteTemplate,
} from "../controllers/templateController.js";

import { protect } from "../middleware/authMiddleware.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "templates/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const router = express.Router();

router
  .route("/")
  .get(protect, getTemplates)
  .post(protect, upload.single("image"), createTemplate);

router
  .route("/:id")
  .get(protect, getTemplateById)
  .put(protect, upload.single("image"), editTemplate)
  .delete(protect, deleteTemplate);

export default router;
