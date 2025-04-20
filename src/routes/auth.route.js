import express from "express";
import { isRegistered, isLoggedIn } from "../middlewares/auth.middleware.js";
import { registerUser, loginUser } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", isRegistered, registerUser);
router.post("/login", isLoggedIn, loginUser);
router.get("/me", isLoggedIn);

export default router;