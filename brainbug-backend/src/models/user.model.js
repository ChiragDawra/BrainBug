import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  // Assuming email-based sign-in from your UI
  email: {
    type: String,
    required: true,
    unique: true, // No two users can have the same email
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true, // This should be a hashed password, not plain text!
  },
  // You can add more fields like 'username' if you want
}, {
  // Adds `createdAt` and `updatedAt` timestamps automatically
  timestamps: true, 
});

const User = mongoose.model('User', userSchema);
export default User;