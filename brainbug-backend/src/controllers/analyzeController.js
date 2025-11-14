import { runMLModel } from "../services/mlService.js";
import { analyzeWithGemini } from "../services/geminiService.js";
import { saveResult } from "../services/dbService.js";

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
