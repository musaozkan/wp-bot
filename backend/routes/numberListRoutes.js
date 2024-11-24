import express from "express";
import {
  createList,
  getLists,
  getList,
  addNumber,
  removeNumber,
  deleteList,
} from "../controllers/numberListController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to create a new list or add numbers while creating
router.post("/create", protect, createList);

// Route to get all lists for a user
router.get("/", protect, getLists);

// Route to get a specific list with numbers
router.get("/:listName", protect, getList);

// Route to add a number to an existing list
router.put("/add-number", protect, addNumber);

// Route to remove a number from a list
router.put("/remove-number", protect, removeNumber);

// Route to delete an entire list
router.delete("/:listName", protect, deleteList);

export default router;
