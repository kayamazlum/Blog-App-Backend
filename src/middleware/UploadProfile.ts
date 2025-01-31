import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profiles/");
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
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, //2MB Limit
});

export default UploadProfile;
