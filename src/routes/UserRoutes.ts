import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/User";
import UploadProfile from "../middleware/UploadProfile";
import { verifyToken } from "../middleware/AuthMiddleware";

const router = express.Router();

router.put(
  "/profile-picture/:id",
  verifyToken,
  UploadProfile.single("profilePicture"),
  updateUserProfile
);

router.get("/:id", getUserProfile);
export default router;
