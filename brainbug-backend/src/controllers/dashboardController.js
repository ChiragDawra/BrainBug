import BugEntry from "../models/bugEntry.model.js";
import UserAnalysis from "../models/userAnalysis.model.js";
import mongoose from "mongoose";

export const getDashboard = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }

        // Handle userId - support both ObjectId and String (for demo/test users)
        let userIdForQuery = userId;
        if (typeof userId === 'string' && mongoose.Types.ObjectId.isValid(userId) && userId.length === 24) {
            userIdForQuery = new mongoose.Types.ObjectId(userId);
        }

        // 1. Stat Cards: Use MongoDB aggregation
        const statCards = await BugEntry.aggregate([
            { $match: { userId: userIdForQuery } },
            {
                $group: {
                    _id: null,
                    totalBugs: { $sum: 1 },
                    bugTypes: { $push: "$bugType" }
                }
            }
        ]);

        let totalBugs = 0;
        let mostCommonMistake = "N/A";

        if (statCards.length > 0) {
            totalBugs = statCards[0].totalBugs;
            // Find most common bug type
            const bugTypeCounts = {};
            statCards[0].bugTypes.forEach(type => {
                bugTypeCounts[type] = (bugTypeCounts[type] || 0) + 1;
            });
            mostCommonMistake = Object.keys(bugTypeCounts).reduce((a, b) =>
                bugTypeCounts[a] > bugTypeCounts[b] ? a : b
            ) || "N/A";
        }

        // Get improvement score from UserAnalysis or calculate it
        // Only query UserAnalysis if userId is a valid ObjectId
        let userAnalysis = null;
        if (userIdForQuery instanceof mongoose.Types.ObjectId || 
            (typeof userIdForQuery === 'string' && mongoose.Types.ObjectId.isValid(userIdForQuery) && userIdForQuery.length === 24)) {
            const userIdForAnalysis = userIdForQuery instanceof mongoose.Types.ObjectId 
                ? userIdForQuery 
                : new mongoose.Types.ObjectId(userIdForQuery);
            userAnalysis = await UserAnalysis.findOne({ userId: userIdForAnalysis });
        }
        const improvementScore = userAnalysis?.improvementScore || Math.max(0, 100 - (totalBugs * 2));

        // 2. AI Analysis: Fetch from UserAnalysis collection
        const aiAnalysis = {
            patternRecognition: userAnalysis?.patternRecognition || "We're still analyzing your coding patterns. Keep coding!",
            rootCauseAnalysis: userAnalysis?.rootCauseAnalysis || "No root cause analysis available yet.",
            improvementInsights: userAnalysis?.improvementInsights || "No improvement insights available yet.",
            personalizedRecommendation: userAnalysis?.personalizedRecommendation || "No personalized recommendations available yet."
        };

        // 3. Bugs vs. Time Chart: Group by timestamp (day)
        const bugsVsTime = await BugEntry.aggregate([
            { $match: { userId: userIdForQuery } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    date: "$_id",
                    count: 1,
                    _id: 0
                }
            }
        ]);

        // 4. Recent Bug History: Last 5 entries
        const recentBugs = await BugEntry.find({ userId: userIdForQuery })
            .sort({ timestamp: -1 })
            .limit(5)
            .select("bugType projectName language filePath timestamp rootCause suggestedFix")
            .lean();

        return res.json({
            success: true,
            statCards: {
                totalBugs,
                mostCommonMistake,
                improvementScore
            },
            aiAnalysis,
            bugsVsTime,
            recentBugs
        });

    } catch (err) {
        console.error("Error in getDashboard:", err);
        res.status(500).json({ error: "Internal Server Error", message: err.message });
    }
};

