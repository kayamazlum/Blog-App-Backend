import express from "express";
import {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/Category";
const router = express.Router();

router.post("/", createCategory);
router.get("/", getCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
