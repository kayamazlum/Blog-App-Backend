import mongoose from "mongoose";
import { RequestHandler, Request, Response } from "express";
import fs from "fs-extra";
import path from "path";
import User from "../models/User";
import Post from "../models/Post";

// UPDATE PROFILE PICTURE
export const updateUserProfile: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.params.id;
    const { fullname, username, email } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (req.file?.filename) {
      if (user.profilePicture) {
        const oldImagePath = path.join(__dirname, "..", user.profilePicture);
        await fs.remove(oldImagePath);
      }
      user.profilePicture = `/uploads/profiles/${req.file.filename}`;
    }

    if (fullname) user.fullname = fullname;
    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    res.status(200).json({
      message: "Profile picture uploated.",
      user: {
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update porfile picture.", details: error });
  }
};

//GET USER PROFILE (User info + User's posts)
export const getUserProfile: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid User ID." });
    }

    const user = await User.findById(id).select(
      "-password -resetPasswordToken -resetPasswordExpire"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const posts = await Post.find({ author: id }).populate(
      "author",
      "fullname username profilePicture"
    );

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found for this user." });
    }

    res.status(200).json({
      user,
      posts,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch user profile.", details: error });
  }
};
