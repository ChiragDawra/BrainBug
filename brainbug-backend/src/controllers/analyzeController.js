import { runMLModel } from "../services/mlService.js";
import { analyzeWithGemini } from "../services/geminiService.js";
import { saveResult } from "../services/dbService.js";
import BugHistory from "../models/BugHistory.js";

export const analyzeCode = async (req, res) => {
    try {
        const { code, fileName, userId } = req.body;

        if (!code) {
            return res.status(400).json({ error: "Code is required" });
        }

        // 1. Run ML prediction
        const mlOutput = await runMLModel(code);

        // 2. Gemini analysis
        const geminiOutput = await analyzeWithGemini(code, mlOutput);

        // 3. Store into DB
        const saved = await saveResult(userId, fileName, code, mlOutput, geminiOutput);

        // 4. Send response
        return res.json({
            success: true,
            ml: mlOutput,
            gemini: geminiOutput,
            savedId: saved._id
        });

    } catch (err) {
        console.log("Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const listAnalyses = async (req, res) => {
    try {
        const { userId, limit = 50 } = req.query;
        const query = userId ? { userId } : {};
        const analyses = await BugHistory.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));
        return res.json(analyses);
    } catch (err) {
        console.log("Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAnalysisBySession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const analysis = await BugHistory.findById(sessionId);
        if (!analysis) {
            return res.status(404).json({ error: "Analysis not found" });
        }
        return res.json(analysis);
    } catch (err) {
        console.log("Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteAnalysis = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const deleted = await BugHistory.findByIdAndDelete(sessionId);
        if (!deleted) {
            return res.status(404).json({ error: "Analysis not found" });
        }
        return res.json({ success: true, message: "Analysis deleted" });
    } catch (err) {
        console.log("Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
