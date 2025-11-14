# API Testing Guide

This guide explains how to test all the BrainBug backend API endpoints.

## Prerequisites

1. **Start the server:**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

2. **Environment Variables:**
   Make sure you have a `.env` file in the `brainbug-backend` directory with:
   ```env
   MONGO_URI=mongodb://localhost:27017/brainbug
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   You can copy `.env.example` to `.env` and fill in your values.

3. **MongoDB:**
   - Make sure MongoDB is running
   - The connection string should match your MongoDB setup

## Running Tests

Run the comprehensive test suite:
```bash
npm test
# or
npm run test:api
```

## Manual Testing

### 1. POST /api/analyze

**Request:**
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "code": "function test() { let x = 5; }",
    "filePath": "test-project/src/test.js",
    "userId": "507f1f77bcf86cd799439011"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "ml": { ... },
  "gemini": { ... },
  "bugEntry": { ... }
}
```

### 2. GET /api/dashboard

**Request:**
```bash
curl "http://localhost:5000/api/dashboard?userId=507f1f77bcf86cd799439011"
```

**Expected Response:**
```json
{
  "success": true,
  "statCards": {
    "totalBugs": 5,
    "mostCommonMistake": "Logic Error",
    "improvementScore": 90
  },
  "aiAnalysis": { ... },
  "bugsVsTime": [ ... ],
  "recentBugs": [ ... ]
}
```

### 3. GET /api/analytics

**Request:**
```bash
curl "http://localhost:5000/api/analytics?userId=507f1f77bcf86cd799439011"
```

**Expected Response:**
```json
{
  "success": true,
  "bugTypeDistribution": [ ... ],
  "bugsByProject": [ ... ],
  "bugsByLanguage": [ ... ]
}
```

### 4. GET /api/bug-history

**Basic Request:**
```bash
curl "http://localhost:5000/api/bug-history?userId=507f1f77bcf86cd799439011&page=1&limit=10"
```

**With Filters:**
```bash
# Filter by bug type
curl "http://localhost:5000/api/bug-history?userId=507f1f77bcf86cd799439011&bugType=Logic%20Error"

# Filter by date range
curl "http://localhost:5000/api/bug-history?userId=507f1f77bcf86cd799439011&dateRange=week"

# Combined filters
curl "http://localhost:5000/api/bug-history?userId=507f1f77bcf86cd799439011&bugType=Logic%20Error&dateRange=month&page=1&limit=5"
```

**Date Range Options:**
- `today` - Bugs from today
- `week` - Bugs from last 7 days
- `month` - Bugs from last 30 days
- `year` - Bugs from last year
- Custom: `YYYY-MM-DD,YYYY-MM-DD` (e.g., `2024-01-01,2024-01-31`)

**Expected Response:**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

## Test Script Features

The automated test script (`test-api.js`) tests:

1. ✅ **POST /api/analyze** - Code analysis endpoint
2. ✅ **GET /api/dashboard** - Dashboard data endpoint
3. ✅ **GET /api/analytics** - Analytics aggregations
4. ✅ **GET /api/bug-history** - Bug history with pagination and filters
5. ✅ **Error Handling** - Tests for missing required parameters

## Troubleshooting

### Server won't start
- Check that MongoDB is running
- Verify `.env` file exists and has correct values
- Check port 5000 is not already in use

### Tests fail with connection errors
- Make sure the server is running before running tests
- Check the server logs for errors

### MongoDB connection errors
- Verify MongoDB is running: `mongosh` or check MongoDB service
- Check `MONGO_URI` in `.env` matches your MongoDB setup
- For MongoDB Atlas, use the connection string from Atlas dashboard

### Gemini API errors
- Verify `GEMINI_API_KEY` is set correctly in `.env`
- Check API key is valid and has quota remaining
- The test will still run but Gemini analysis may fail

## Notes

- The test script uses a sample userId. In production, use actual user IDs from your User collection.
- Some tests may fail if there's no data in the database yet. Run the analyze endpoint first to create test data.
- The Gemini API has rate limits, so multiple rapid tests might hit limits.

