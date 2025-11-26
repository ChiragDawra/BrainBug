import BugEntry from "../models/bugEntry.model.js";
import mongoose from "mongoose";

export const getBugHistory = async (req, res) => {
    try {
        const { userId, bugType, dateRange, page = 1, limit = 10 } = req.query;

        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }

        // Handle userId - support both ObjectId and String (for demo/test users)
        let userIdForQuery = userId;
        if (typeof userId === 'string' && mongoose.Types.ObjectId.isValid(userId) && userId.length === 24) {
            userIdForQuery = new mongoose.Types.ObjectId(userId);
        }

        // Build query filter
        const filter = { userId: userIdForQuery };

        // Filter by bugType if provided
        if (bugType) {
            filter.bugType = bugType;
        }

        // Filter by dateRange if provided
        if (dateRange) {
            const now = new Date();
            let startDate = null;

            switch (dateRange.toLowerCase()) {
                case 'today':
                    startDate = new Date();
                    startDate.setHours(0, 0, 0, 0);
                    break;
                case 'week':
                    startDate = new Date();
                    startDate.setDate(startDate.getDate() - 7);
                    break;
                case 'month':
                    startDate = new Date();
                    startDate.setMonth(startDate.getMonth() - 1);
                    break;
                case 'year':
                    startDate = new Date();
                    startDate.setFullYear(startDate.getFullYear() - 1);
                    break;
                default:
                    // Try to parse as custom date range (format: "YYYY-MM-DD,YYYY-MM-DD")
                    const dates = dateRange.split(',');
                    if (dates.length === 2) {
                        filter.timestamp = {
                            $gte: new Date(dates[0]),
                            $lte: new Date(dates[1])
                        };
                    }
            }

            if (startDate && !filter.timestamp) {
                filter.timestamp = { $gte: startDate };
            }
        }

        // Calculate pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Get total count for pagination
        const total = await BugEntry.countDocuments(filter);

        // Fetch bug entries with pagination
        const bugs = await BugEntry.find(filter)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limitNum)
            .lean();

        return res.json({
            success: true,
            data: bugs,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum)
            }
        });

    } catch (err) {
        console.error("Error in getBugHistory:", err);
        res.status(500).json({ error: "Internal Server Error", message: err.message });
    }
};

