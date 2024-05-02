import express from "express";
import {
  createBldg,
  deleteBldg,
  editBldg,
  editBldgImage,
  getAllBldgs,
  getBldgCount,
  getBldgsBySchool,
  getOneBldg,
  uploadBldgImage,
} from "../controllers/BldgController.js";
const router = express.Router();

import { upload } from "../utils/multer.js";

// POST
// router.post("/", upload.single("file"), createBldg);
router.post("/", upload.single("image"), createBldg);
router.put("/edit-bldg-image/:id", upload.single("image"), editBldgImage);
// router.post("/upload", upload.single("file"), uploadBldgImage);

// PUT
router.put("/edit/:id", editBldg);

// GET
router.get("/schoolsWithCount", getBldgCount);
router.get("/getBldgsBySchool", getBldgsBySchool);
router.get("/:id", getOneBldg);
router.get("/", getAllBldgs);

// DELETE
router.delete("/:id", deleteBldg);

export default router;
