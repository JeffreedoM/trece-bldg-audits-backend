import express from "express";
const router = express.Router();

import { loginUser, signupUser } from "../controllers/UserController.js";

// login
router.post("/login", loginUser);
// signup
router.post("/signup", signupUser);

export default router;
