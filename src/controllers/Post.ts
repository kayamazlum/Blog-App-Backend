import { Request, Response, RequestHandler } from "express";
import Post from "../models/Post";
import mongoose from "mongoose";

interface AuthRequest extends Request {
  user?: { id: string };
}

// ADD POST
export const createPost: RequestHandler = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const { title, summary, description, images, tags, categories } = req.body;

    if (!title || !summary || !description) {
      return res
        .status(400)
        .json({ error: "Title, summary, and description are required." });
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
    res.status(500).json({ error: "Failed to create post." });
  }
};

// GET ALL POSTS
export const getPosts: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const posts = await Post.find()
      .select("title summary tags categories createdAt updatedAt")
      .sort({ createdAt: -1 })
      .populate("author", "fullname username");
    if (!posts || posts.length === 0) {
      return res.status(200).json({ message: "No posts found.", posts: [] });
    }

    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts." });
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
      return res.status(400).json({ error: "Invalid Post ID." });
    }

    const updatedPost = await Post.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found." });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: "Failed to update post." });
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

    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found." });
    }

    res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post." });
  }
};

//  GET POST DETAILS
export const detailsPost: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Post ID." });
    }

    const post = await Post.findById(id).populate(
      "author",
      "fullname username"
    );

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch post details." });
  }
};

// FILTERED POSTS (CATEGORY & TAG)
export const getFilteredPost: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { category, tag } = req.query;
    let filter: any = {};

    if (category) {
      filter.categories = {
        $in: Array.isArray(category) ? category : [category],
      };
    }
    if (tag) {
      filter.tags = { $in: Array.isArray(tag) ? tag : [tag] };
    }

    const posts = await Post.find(filter).sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to filter posts.", details: error });
  }
};
