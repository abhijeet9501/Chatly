import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import anonRoutes from "./routes/anonUser.route.js";
import cors from "cors";

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/anonUser', anonRoutes);

export {app};