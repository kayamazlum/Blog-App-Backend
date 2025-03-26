import { Request, Response, RequestHandler } from "express";
import Post from "../models/Post";
import mongoose from "mongoose";
import { saveBase64Image } from "../utils/saveBase64Image";
import { deleteFile } from "../utils/DeleteFile";

interface AuthRequest extends Request {
  user?: { id: string };
}

// ADD POST
export const createPost: RequestHandler = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const { title, summary, description, tags, categories } = req.body;

    if (!title || !summary || !description) {
      return res
        .status(400)
        .json({ error: "Title, summary, and description are required." });
    }

    let updatedDescription = description;

    // HTML içindeki base64 resimleri bul
    const imgRegex =
      /<img\s+src=["'](data:image\/[a-zA-Z+]+;base64,[^"']+)["']/g;
    const matches = [...description.matchAll(imgRegex)];

    for (const match of matches) {
      const base64Data = match[1];
      const imageUrl = await saveBase64Image(base64Data); // Base64'ü kaydet

      if (imageUrl) {
        // HTML içindeki eski src'yi güncelle
        updatedDescription = updatedDescription.replace(base64Data, imageUrl);
      }
    }

    const newPost = await Post.create({
      title,
      author: req.user?.id,
      summary,
      description: updatedDescription,
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
    const { title, summary, description, tags, categories } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Post ID." });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    let updatedDescription = description;
    const oldDescription = post.description;

    const oldImgRegex = /<img\s+src=["'](\/uploads\/posts\/[^"']+)["']/g;
    const oldImages = [...oldDescription.matchAll(oldImgRegex)].map(
      (match) => match[1]
    );

    const newImgRegex =
      /<img\s+src=["'](data:image\/[a-zA-Z+]+;base64,[^"']+)["']/g;
    const newMatches = [...description.matchAll(newImgRegex)];

    for (const match of newMatches) {
      const base64Data = match[1];
      const imageUrl = await saveBase64Image(base64Data);

      if (imageUrl) {
        updatedDescription = updatedDescription.replace(base64Data, imageUrl);
      }
    }

    const newImgTags = [...updatedDescription.matchAll(oldImgRegex)].map(
      (match) => match[1]
    );
    const deletedImages = oldImages.filter((img) => !newImgTags.includes(img));

    for (const image of deletedImages) {
      await deleteFile(image);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, summary, description: updatedDescription, tags, categories },
      { new: true }
    );

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

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    const imgRegex = /<img\s+src=["'](\/uploads\/posts\/[^"']+)["']/g;
    const images = [...post.description.matchAll(imgRegex)].map(
      (match) => match[1]
    );

    for (const image of images) {
      await deleteFile(image);
    }

    await Post.findByIdAndDelete(id);

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
