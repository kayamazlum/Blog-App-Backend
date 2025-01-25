import express from "express";
import {
  createPost,
  deletePost,
  detailsPost,
  getPosts,
  updatePost,
} from "../controllers/Post";
const router = express.Router();

router.post("/", createPost);
router.get("/", getPosts);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.get("/:id", detailsPost);

export default router;
