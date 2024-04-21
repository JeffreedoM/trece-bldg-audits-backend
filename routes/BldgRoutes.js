import express from "express";
import {
  createBldg,
  getAllBldgs,
  getOneBldg,
} from "../controllers/BldgController.js";
const router = express.Router();

// POST
router.post("/", createBldg);

// GET
router.get("/", getAllBldgs);
router.get("/:id", getOneBldg);

export default router;
