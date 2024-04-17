import express from "express";
import {
  createSchool,
  deleteSchool,
  getAllSchools,
  getOneSchool,
  updateSchool,
} from "../controllers/SchoolController.js";
const router = express.Router();

// get one school
router.get("/", getAllSchools);

// get one school
router.get("/:id", getOneSchool);

// create
router.post("/create", createSchool);

// delete
router.put("/update/:id", updateSchool);

// delete
router.delete("/delete/:id", deleteSchool);

export default router;
