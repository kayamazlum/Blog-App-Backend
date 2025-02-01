import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/User";
import UploadProfile from "../middleware/UploadProfile";
import { verifyToken } from "../middleware/AuthMiddleware";

const router = express.Router();

router.put(
  "/profile/:id",
  verifyToken,
  UploadProfile.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "headerPicture", maxCount: 1 },
  ]),
  updateUserProfile
);

router.get("/:id", getUserProfile);
export default router;
