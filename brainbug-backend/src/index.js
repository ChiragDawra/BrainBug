import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import analyzeRoute from "./routes/analyzeRoute.js";
import dashboardRoute from "./routes/dashboardRoute.js";
import analyticsRoute from "./routes/analyticsRoute.js";
import bugHistoryRoute from "./routes/bugHistoryRoute.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

// Database connection (MongoDB)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🔥 MongoDB Connected"))
  .catch(err => console.log("DB Error:", err));

// Routes
app.use("/api/analyze", analyzeRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/analytics", analyticsRoute);
app.use("/api/bug-history", bugHistoryRoute);

app.listen(5000, () => {
  console.log("🚀 BrainBug Backend running on http://localhost:5000");
});
