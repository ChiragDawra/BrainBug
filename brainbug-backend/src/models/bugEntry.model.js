import mongoose from 'mongoose';
const { Schema } = mongoose;

const bugEntrySchema = new Schema({
  // This creates the link to the User model
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // This 'User' must match the model name from user.model.js
    required: true,
    index: true, // Good for quickly finding all bugs for a user
  },
  projectName: {
    type: String,
    required: [true, 'Project name is required for analytics'],
    trim: true,
  },
  language: {
    type: String,
    required: [true, 'Language is required for analytics'],
    // Use an enum to standardize your analytics data
    enum: ['TypeScript', 'JavaScript', 'Python', 'Java', 'Other'],
  },
  filePath: {
    type: String,
    required: [true, 'File path is required'],
    trim: true,
  },
  bugType: {
    type: String,
    required: [true, 'Bug type is required'],
    index: true, // Good for filtering by bug type
  },
  rootCause: {
    type: String,
    required: [true, 'Root cause analysis is required'],
  },
  recommendation: {
    type: String,
    required: [true, 'Recommendation is required'],
  },
  suggestedFix: {
    type: String,
    required: [true, 'Suggested fix is required'],
  },
  timestamp: {
    type: Date,
    default: Date.now, // Automatically sets the bug time
    index: true, // Good for sorting by date (Bugs vs. Time chart)
  },
});

const BugEntry = mongoose.model('BugEntry', bugEntrySchema);
export default BugEntry;