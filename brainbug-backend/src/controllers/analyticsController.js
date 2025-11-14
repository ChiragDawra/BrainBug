import BugEntry from "../models/bugEntry.model.js";
import mongoose from "mongoose";

export const getAnalytics = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }

        // Convert userId to ObjectId if it's a string
        const userIdObjectId = mongoose.Types.ObjectId.isValid(userId) 
            ? new mongoose.Types.ObjectId(userId) 
            : userId;

        // 1. Bug Type Distribution: Group by bugType
        const bugTypeDistribution = await BugEntry.aggregate([
            { $match: { userId: userIdObjectId } },
            {
                $group: {
                    _id: "$bugType",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    bugType: "$_id",
                    count: 1,
                    _id: 0
                }
            },
            { $sort: { count: -1 } }
        ]);

        // 2. Bugs by Project: Group by projectName
        const bugsByProject = await BugEntry.aggregate([
            { $match: { userId: userIdObjectId } },
            {
                $group: {
                    _id: "$projectName",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    projectName: "$_id",
                    count: 1,
                    _id: 0
                }
            },
            { $sort: { count: -1 } }
        ]);

        // 3. Bugs by Language: Group by language
        const bugsByLanguage = await BugEntry.aggregate([
            { $match: { userId: userIdObjectId } },
            {
                $group: {
                    _id: "$language",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    language: "$_id",
                    count: 1,
                    _id: 0
                }
            },
            { $sort: { count: -1 } }
        ]);

        return res.json({
            success: true,
            bugTypeDistribution,
            bugsByProject,
            bugsByLanguage
        });

    } catch (err) {
        console.error("Error in getAnalytics:", err);
        res.status(500).json({ error: "Internal Server Error", message: err.message });
    }
};

