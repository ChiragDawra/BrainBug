import { runMLModel } from "../services/mlService.js";
import { analyzeWithGemini } from "../services/geminiService.js";
import { saveBugEntry, updateUserAnalysisAsync } from "../services/dbService.js";
import mongoose from "mongoose";

export const analyzeCode = async (req, res) => {
    try {
        const { code, filePath, userId } = req.body;

        if (!code) {
            return res.status(400).json({ error: "Code is required" });
        }

        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }

        // 1. Run ML prediction
        const mlOutput = await runMLModel(code);

        // 2. Gemini analysis with filePath
        const geminiOutput = await analyzeWithGemini(code, mlOutput, filePath || "");

        // 3. Parse the JSON string from Gemini
        let analysis;
        try {
            analysis = JSON.parse(geminiOutput.analysis);
        } catch (parseError) {
            console.error("Failed to parse Gemini JSON:", parseError);
            // Fallback structure if parsing fails
            analysis = {
                bugType: "Unknown",
                rootCause: geminiOutput.analysis || "Analysis unavailable",
                recommendation: "Review the code carefully",
                suggestedFix: "Please review the analysis above"
            };
        }

        // 4. Extract project name and language from filePath
        const projectName = filePath ? filePath.split('/').filter(Boolean)[0] || 'Unknown' : 'Unknown';
        const language = filePath ? getLanguageFromPath(filePath) : 'Other';

        // 5. Convert userId to ObjectId if it's a string
        const userIdObjectId = mongoose.Types.ObjectId.isValid(userId) 
            ? new mongoose.Types.ObjectId(userId) 
            : userId;

        // 6. Create and save BugEntry
        const bugEntry = await saveBugEntry({
            userId: userIdObjectId,
            projectName,
            language,
            filePath: filePath || 'Unknown',
            bugType: analysis.bugType || 'Unknown',
            rootCause: analysis.rootCause || 'No root cause provided',
            recommendation: analysis.recommendation || 'No recommendation provided',
            suggestedFix: analysis.suggestedFix || 'No fix suggested'
        });

        // 7. Asynchronously update UserAnalysis (don't wait for it)
        updateUserAnalysisAsync(userIdObjectId).catch(err => {
            console.error("Error updating UserAnalysis:", err);
        });

        // 8. Send response
        return res.json({
            success: true,
            ml: mlOutput,
            gemini: analysis,
            bugEntry: {
                id: bugEntry._id,
                bugType: bugEntry.bugType,
                projectName: bugEntry.projectName,
                language: bugEntry.language
            }
        });

    } catch (err) {
        console.error("Error in analyzeCode:", err);
        res.status(500).json({ error: "Internal Server Error", message: err.message });
    }
};

// Helper function to detect language from file path
const getLanguageFromPath = (filePath) => {
    const ext = filePath.split('.').pop()?.toLowerCase();
    const langMap = {
        'ts': 'TypeScript',
        'tsx': 'TypeScript',
        'js': 'JavaScript',
        'jsx': 'JavaScript',
        'py': 'Python',
        'java': 'Java'
    };
    return langMap[ext] || 'Other';
};
