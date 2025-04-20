import express from "express";
import { signAnonToken } from "../controllers/anonUser.controller.js";
import { verifyAnonToken } from "../middlewares/anonUser.middleware.js";

const router = express.Router();

router.get('/anon', verifyAnonToken);
router.post('/anon', verifyAnonToken, signAnonToken);

export default router;