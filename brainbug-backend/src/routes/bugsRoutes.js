import express from 'express';
// 1. Import your Mongoose model
import BugHistory from '../models/BugHistory.js'; 
// 2. Import your service function
import { saveResult } from '../services/dbService.js';

const router = express.Router();

// ---
// GET /api/bugs (Fetches all bugs for the BugHistory page)
// ---
router.get('/bugs', async (req, res) => {
  console.log("Request received for GET /api/bugs");
  
  try {
    const bugs = await BugHistory.find({});
    res.json(bugs);
  } catch (error) {
    console.error("Database error fetching bugs:", error);
    res.status(500).json({ message: "Error fetching bug history" });
  }
});


// ---
// POST /api/bugs (Saves a new bug using your dbService)
// ---
router.post('/bugs', async (req, res) => {
  console.log("Request received for POST /api/bugs");
  
  try {
    // 3. Get the data from the request body
    const { userId, fileName, code, ml, gemini } = req.body;

    // 4. Use your saveResult function to save to the DB
    const newBug = await saveResult(userId, fileName, code, ml, gemini);
    
    // 5. Send back a "201 Created" status and the new bug
    res.status(201).json(newBug);

  } catch (error) {
    console.error("Database error saving bug:", error);
    res.status(500).json({ message: "Error saving bug" });
  }
});


export default router;