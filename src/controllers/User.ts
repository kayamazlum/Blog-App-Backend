import mongoose from "mongoose";
import { RequestHandler, Request, Response } from "express";
import fs from "fs-extra";
import path from "path";
import User from "../models/User";
import Post from "../models/Post";

// UPDATE USER PROFILE
export const updateUserProfile: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.params.id;
    const { fullname, username, email, biography, location } = req.body;

    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    const profileImage = files?.["profilePicture"]?.[0];
    const headerImage = files?.["headerImage"]?.[0];

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (profileImage) {
      if (user.profilePicture) {
        const oldProfilePath = path.join(__dirname, "..", user.profilePicture);
        await fs.remove(oldProfilePath);
      }
      user.profilePicture = `/uploads/profiles/${profileImage.filename}`;
    }

    if (headerImage) {
      if (user.headerPicture) {
        const oldHeaderPath = path.join(__dirname, "..", user.headerPicture);
        await fs.remove(oldHeaderPath);
      }
      user.headerPicture = `/uploads/headers/${headerImage.filename}`;
    }

    if (fullname) user.fullname = fullname;

    if (biography) user.biography = biography;

    if (location) user.location = location;

    if (username && username !== user.username) {
      const existingUse = await User.findOne({ username });
      if (existingUse) {
        return res.status(400).json({ error: "Username is already token." });
      }
      user.username = username;
    }

    if (email && email !== user.email) {
      const existingUse = await User.findOne({ email });
      if (existingUse) {
        return res.status(400).json({ error: "Email is already in use." });
      }
      user.email = email;
    }

    await user.save();

    res.status(200).json({
      message: "Profile picture uploated.",
      user: {
        fullname: user.fullname,
        username: user.username,
        biography: user.biography,
        location: user.location,
        email: user.email,
        profilePicture: user.profilePicture,
        headerPiture: user.headerPicture,
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

    const posts = await Post.find({ author: id })
      .select("title summary tags categories createdAt updatedAt")
      .sort({ createdAt: -1 })
      .populate(
        "author",
        "fullname username profilePicture biography location"
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
