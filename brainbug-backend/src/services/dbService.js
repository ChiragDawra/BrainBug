import BugHistory from "../models/BugHistory.js";

export const saveResult = async (userId, fileName, code, ml, gemini) => {
    const data = new BugHistory({
        userId,
        fileName,
        originalCode: code,
        mlPredictions: ml,
        geminiOutput: gemini
    });

    return await data.save();
};
