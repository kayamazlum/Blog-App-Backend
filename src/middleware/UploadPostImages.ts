import multer from "multer";
import path from "path";
import fs from "fs-extra";

const postStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = "uploads/posts/";
    await fs.ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now}-${file.originalname}`);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .png, .jpg, .jpeg, and .webp format allowed'"), false);
  }
};

const uploadPostImage = multer({
  storage: postStorage,
  fileFilter,
  limits: { fileSize: 6 * 1024 * 1024 },
});

export default uploadPostImage;
