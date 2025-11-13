import express from 'express';
import cors from 'cors';
const app = express();

// Use port 8000 or any port you prefer
const PORT = process.env.PORT || 8000;

// === MIDDLEWARE ===

// 2. Use cors() to allow requests from other origins (like your React app)
app.use(cors());

// This middleware parses incoming JSON requests
app.use(express.json());

// === ROUTES ===

// 3. Import your new bug routes
import bugRoutes from './routes/bugsRoutes.js'; // <-- This is the new syntax
// 4. Tell Express to use those routes for any path starting with /api
// For example, a GET request to /api/bugs will be handled by bugRoutes
app.use('/api', bugRoutes);

/*
// ---
// TODO: Add your other routes here in the same way
// (Based on your screenshot, you might have routes for analysis, etc.)
//
// const analysisRoutes = require('./routes/analysisRoute.js');
// app.use('/api', analysisRoutes);
// ---
*/


// === START SERVER ===
app.listen(PORT, () => {
  console.log(`🚀 Express backend server running at http://127.0.0.1:${PORT}`);
});