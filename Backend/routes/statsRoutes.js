import express from "express";
import { getStats } from "../controllers/statsContollers.js"

const router = express.Router();

router.get("/", getStats);

export default router;
