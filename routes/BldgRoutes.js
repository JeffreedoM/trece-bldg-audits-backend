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
import {
  UploadBldgDefects,
  deleteDefect,
  getBldgDefects,
} from "../controllers/BldgDefectsController.js";

// POST
// router.post("/", upload.single("file"), createBldg);
router.post("/", upload.single("image"), createBldg);
router.put("/uploadBldgDefects/:id", upload.array("images"), UploadBldgDefects);
// router.post("/upload", upload.single("file"), uploadBldgImage);

// PUT
router.put("/edit/:id", editBldg);
router.put("/edit-bldg-image/:id", upload.single("image"), editBldgImage);

// GET
router.get("/schoolsWithCount", getBldgCount);
router.get("/getBldgsBySchool", getBldgsBySchool);
router.get("/getBldgDefects/:id", getBldgDefects);
router.get("/:id", getOneBldg);
router.get("/", getAllBldgs);

// DELETE
router.delete("/:id", deleteBldg);
router.delete("/deleteBldgDefect/:id", deleteDefect);

export default router;
