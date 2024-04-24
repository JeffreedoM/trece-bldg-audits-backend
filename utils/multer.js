import multer from "multer";
import path from "path";

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Destination directory for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

export const upload = multer({ storage: storage });
