import mongoose from 'mongoose';
const { Schema } = mongoose;

const userAnalysisSchema = new Schema({
  // This creates a 1-to-1 link with a user
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // Ensures one analysis document per user
  },
  totalBugs: {
    type: Number,
    default: 0,
  },
  improvementScore: {
    type: Number,
    default: 0,
  },
  mostCommonMistake: {
    type: String,
    default: 'N/A',
  },
  // The 4 AI analysis cards
  patternRecognition: {
    type: String,
    default: "We're still analyzing your coding patterns. Keep coding!",
  },
  rootCauseAnalysis: {
    type: String,
    default: 'No root cause analysis available yet.',
  },
  improvementInsights: {
    type: String,
    default: 'No improvement insights available yet.',
  },
  personalizedRecommendation: {
    type: String,
    default: 'No personalized recommendations available yet.',
  },
}, {
  // Automatically tracks when this analysis was last updated
  timestamps: true, 
});

const UserAnalysis = mongoose.model('UserAnalysis', userAnalysisSchema);
export default UserAnalysis;