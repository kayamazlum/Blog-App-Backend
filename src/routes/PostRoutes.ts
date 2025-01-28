import express from "express";
import {
  createPost,
  deletePost,
  detailsPost,
  getPosts,
  updatePost,
} from "../controllers/Post";
import { verifyToken } from "../middleware/AuthMiddleware";
const router = express.Router();

router.post("/", verifyToken, createPost);
router.get("/", getPosts);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);
router.get("/:id", detailsPost);

export default router;
