import mongoose from "mongoose";
import { RequestHandler, Request, Response } from "express";
import fs from "fs-extra";
import path from "path";
import User from "../models/User";
import Post from "../models/Post";

// UPDATE PROFILE PICTURE
export const updateProfilePicture: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    if (user.profilePicture) {
      const oldImagePath = path.join(__dirname, "..", user.profilePicture);
      await fs.remove(oldImagePath);
    }

    user.profilePicture = `/uploads/profiles/${req.file.filename}`;
    await user.save();

    res.status(200).json({
      message: "Profile picture uploated.",
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update porfile picture.", details: error });
  }
};

// GET USER POSTS
export const getUserPosts: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid) {
      return res.status(400).json({ error: "Invalid User ID." });
    }

    const posts = await Post.find({ author: id }).populate(
      "author",
      "fullname username email"
    );

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found for this user." });
    }

    res.status(200).json({ posts });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch user's posts.", details: error });
  }
};
