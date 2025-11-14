import BugHistory from "../models/BugHistory.js";
import BugEntry from "../models/bugEntry.model.js";
import UserAnalysis from "../models/userAnalysis.model.js";
import mongoose from "mongoose";

// Legacy function (keeping for backward compatibility)
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

// New function to save BugEntry
export const saveBugEntry = async (bugData) => {
    const bugEntry = new BugEntry(bugData);
    return await bugEntry.save();
};

// Async function to update UserAnalysis collection
export const updateUserAnalysisAsync = async (userId) => {
    try {
        // Convert userId to ObjectId if it's a string
        const userIdObjectId = mongoose.Types.ObjectId.isValid(userId) 
            ? new mongoose.Types.ObjectId(userId) 
            : userId;

        // Get all bug entries for this user
        const bugEntries = await BugEntry.find({ userId: userIdObjectId }).lean();

        if (bugEntries.length === 0) {
            return;
        }

        // Calculate statistics
        const totalBugs = bugEntries.length;

        // Find most common mistake (bugType)
        const bugTypeCounts = {};
        bugEntries.forEach(entry => {
            bugTypeCounts[entry.bugType] = (bugTypeCounts[entry.bugType] || 0) + 1;
        });
        const mostCommonMistake = Object.keys(bugTypeCounts).reduce((a, b) => 
            bugTypeCounts[a] > bugTypeCounts[b] ? a : b
        );

        // Calculate improvement score (simplified: decreases with more bugs, but can be enhanced)
        // For now, using a simple formula: 100 - (totalBugs * 2), minimum 0
        const improvementScore = Math.max(0, 100 - (totalBugs * 2));

        // Generate AI analysis insights (simplified - can be enhanced with actual AI)
        const patternRecognition = `You've encountered ${totalBugs} bug${totalBugs !== 1 ? 's' : ''}. The most common issue is "${mostCommonMistake}". Consider reviewing patterns in your code that lead to this type of bug.`;

        const rootCauseAnalysis = `Based on your bug history, ${mostCommonMistake} appears frequently. This suggests a systematic issue in your coding approach. Focus on understanding the root causes rather than just fixing symptoms.`;

        const improvementInsights = `Your improvement score is ${improvementScore}/100. To improve, focus on: 1) Understanding common bug patterns, 2) Writing more defensive code, 3) Testing before committing.`;

        const personalizedRecommendation = `Given your most common mistake is "${mostCommonMistake}", we recommend: 1) Review similar past bugs, 2) Create a checklist for this bug type, 3) Consider code review practices.`;

        // Update or create UserAnalysis document
        await UserAnalysis.findOneAndUpdate(
            { userId: userIdObjectId },
            {
                userId: userIdObjectId,
                totalBugs,
                mostCommonMistake,
                improvementScore,
                patternRecognition,
                rootCauseAnalysis,
                improvementInsights,
                personalizedRecommendation
            },
            { upsert: true, new: true }
        );

        console.log(`✓ Updated UserAnalysis for userId: ${userIdObjectId}`);
    } catch (error) {
        console.error("Error updating UserAnalysis:", error);
        throw error;
    }
};
