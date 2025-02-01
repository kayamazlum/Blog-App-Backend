import multer from "multer";
import path from "path";
import fs from "fs-extra";

const profileStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath =
      file.fieldname === "headerPicture"
        ? "uploads/headers/"
        : "uploads/profiles/";

    await fs.ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/ewbp",
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .png, .jpg, .jpeg and .webp format allowed!"), false);
  }
};

const UploadProfile = multer({
  storage: profileStorage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, //2MB Limit
});

export default UploadProfile;
