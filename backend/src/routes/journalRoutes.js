import { createEntry, getEntries, analyzeJournal, getInsights } from "../controllers/journalController.js";
import express from "express";

const router = express.Router();

router.post("/", createEntry);
router.post("/analyze", analyzeJournal);
router.get("/insights/:userId", getInsights);
router.get("/:userId", getEntries);

export default router;