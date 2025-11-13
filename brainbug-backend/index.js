import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI) // <-- This is the updated line
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// --- ROUTES ---
// Import from your actual file name: bugsRoutes.js
import bugRoutes from './src/routes/bugsRoutes.js'; // <-- This is the corrected line
import analyzeRoutes from './src/routes/analyzeRoute.js';

app.use('/api', bugRoutes);
app.use('/api/analyze', analyzeRoutes);


// ... (rest of your file) ...

app.listen(PORT, () => {
  console.log(`🚀 Express backend server running at http://127.0.0.1:${PORT}`);
});