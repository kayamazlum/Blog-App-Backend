import { Request, Response, RequestHandler } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendMail } from "../utils/SendMail";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config/config";

//USER REGISTER
export const registerUser: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { fullname, username, email, password, biography, location } =
      req.body;

    if (!fullname || !username || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exist." });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "This username already exists." });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters long." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullname,
      username,
      email,
      password: hashedPassword,
      biography,
      location,
    });

    res.status(201).json({
      message: "User registered successfully.",
      user: { id: newUser._id, email },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user.", details: error });
  }
};

// LOGIN USER
export const loginUser: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters long." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    //CREATE TOKEN
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      message: "Login successfully.",
      user: { id: user._id, email },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to log in.", details: error });
  }
};

// FORGOT PASSWORD
export const forgotPassword: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found with this email." });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minute

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpire = resetPasswordExpire;
    await user.save();

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/reset-password/${resetToken}`;
    const message = `You are receiving this email because you requested to reset your password. Click the link below to reset your password: \n\n ${resetUrl}`;

    try {
      await sendMail({
        to: email,
        subject: "Password Reset Request",
        text: message,
      });
      res.status(200).json({ message: "Email sent successfully." });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      res.status(500).json({ error: "Failed to send email.", details: error });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to process forgot password request.",
      details: error,
    });
  }
};

// RESET PASSWORD
export const resetPassword: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token." });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to reset password.", details: error });
  }
};
