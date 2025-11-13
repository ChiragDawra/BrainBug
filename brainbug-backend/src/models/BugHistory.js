import mongoose from "mongoose";

const BugSchema = new mongoose.Schema({
  userId: String,
  fileName: String,
  originalCode: String,
  mlPredictions: Object,
  geminiOutput: Object,
  createdAt: { type: Date, default: Date.now }
});

// This line creates and exports the model.
// Mongoose will automatically create a collection called "bughistories"
const BugHistory = mongoose.model("BugHistory", BugSchema);

export default BugHistory;