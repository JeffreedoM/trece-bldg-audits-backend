import express from "express";
import {
  createBldg,
  getAllBldgs,
  getOneBldg,
  uploadBldgImage,
} from "../controllers/BldgController.js";
const router = express.Router();

import { upload } from "../utils/multer.js";

// POST
// router.post("/", upload.single("file"), createBldg);
router.post("/", upload.single("image"), createBldg);
router.post("/upload", upload.single("file"), uploadBldgImage);

// GET
router.get("/", getAllBldgs);
router.get("/:id", getOneBldg);

export default router;
