import express from "express";
import {
  analyzeCode,
  listAnalyses,
  getAnalysisBySession,
  deleteAnalysis,
} from "../controllers/analyzeController.js";

const router = express.Router();

// simple admin middleware: set ADMIN_TOKEN in .env to enable
const adminAuth = (req, res, next) => {
  const token = req.headers["x-admin-token"] || req.query.admin_token;
  if (process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN) return next();
  return res.status(403).json({ error: "unauthorized" });
};

// Analyze code and persist result
router.post("/", analyzeCode);

// List analyses (optional query: userId, limit)
// GET /api/analyze?userId=...&limit=50
router.get("/", listAnalyses);

// Get single analysis by sessionId
router.get("/:sessionId", getAnalysisBySession);

// Admin delete an analysis
router.delete("/:sessionId", adminAuth, deleteAnalysis);

export default router;
