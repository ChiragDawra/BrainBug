import mongoose from 'mongoose';
const { Schema } = mongoose;

const bugEntrySchema = new Schema({
  // This creates the link to the User model
  // Supports both ObjectId (for real users) and String (for demo/test users)
  userId: {
    type: Schema.Types.Mixed, // Allows both ObjectId and String
    required: true,
    index: true, // Good for quickly finding all bugs for a user
    // Custom setter to handle both ObjectId and String
    set: function(value) {
      // If it's a valid ObjectId string, convert it
      if (typeof value === 'string' && mongoose.Types.ObjectId.isValid(value) && value.length === 24) {
        return new mongoose.Types.ObjectId(value);
      }
      // Otherwise, keep it as a string (for demo/test users)
      return value;
    }
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