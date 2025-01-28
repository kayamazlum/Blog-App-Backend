import { Request, Response, RequestHandler } from "express";
import Post from "../models/Post";
import mongoose from "mongoose";
import moment from "moment";

//ADD POST

export const createPost: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { title, author, summary, description, images, tags, categories } =
      req.body;

    if (!title || !author || !summary || !description) {
      return res
        .status(400)
        .json({ error: "Title, author and content are required." });
    }

    const newPost = await Post.create({
      title,
      author: req.user?.id,
      summary,
      description,
      images,
      tags,
      categories,
    });

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post.", details: error });
  }
};

// GET ALL POST

export const getPosts: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const posts = await Post.find();

    if (!posts || posts.length === 0) {
      return res.status(200).json({ message: "Post not found.", posts: [] });
    }

    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch post.", details: error });
  }
};

// UPDATE POST

export const updatePost: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Post ID" });
    }

    const updatePost = await Post.findByIdAndUpdate(id, updates, { new: true });

    if (!updatePost) {
      return res.status(404).json({ error: "Post not found." });
    }

    res.status(200).json(updatePost);
  } catch (error) {
    res.status(500).json({ error: "Failed to update post.", details: error });
  }
};

// DELETE POST

export const deletePost: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Post ID." });
    }

    const deletePost = await Post.findByIdAndDelete(id);

    if (!deletePost) {
      return res.status(404).json({ error: "Post not found." });
    }

    res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post.", details: error });
  }
};

// DETAILS POST

export const detailsPost: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Post ID." });
    }

    const post = await Post.findById(id);

    if (!detailsPost) {
      return res.status(404).json({ error: "Post not found." });
    }

    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ error: "Post details could be not fetched." });
  }
};
