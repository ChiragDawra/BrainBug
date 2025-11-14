# Unit Testing Guide

This guide explains the unit tests for the BrainBug backend API controllers.

## Overview

We have comprehensive unit tests for all 4 main controllers, with **4 test cases each** (16 total test cases) that verify optimal data flow.

## Test Structure

### Test Files
- `src/__tests__/controllers/analyzeController.test.js` - Tests for POST /api/analyze
- `src/__tests__/controllers/dashboardController.test.js` - Tests for GET /api/dashboard
- `src/__tests__/controllers/analyticsController.test.js` - Tests for GET /api/analytics
- `src/__tests__/controllers/bugHistoryController.test.js` - Tests for GET /api/bug-history

## Test Cases Per Controller

Each controller has 4 test cases that verify optimal data flow:

### 1. analyzeController (POST /api/analyze)

**Test Case 1: Successful code analysis with optimal data flow**
- Verifies end-to-end processing: ML → Gemini → Database
- Checks all data transformations are correct
- Validates response structure

**Test Case 2: Data transformation and language detection**
- Tests project name extraction from filePath
- Verifies language detection for different file types (TS, JS, PY, Java)
- Ensures correct data mapping

**Test Case 3: Error handling and fallback mechanisms**
- Tests JSON parse error handling
- Verifies fallback data structure when parsing fails
- Tests missing required field validation

**Test Case 4: Performance and async operations optimization**
- Verifies UserAnalysis update doesn't block response
- Tests error handling in async operations
- Ensures optimal response time

### 2. dashboardController (GET /api/dashboard)

**Test Case 1: Optimal data aggregation and flow**
- Tests efficient aggregation pipelines
- Verifies all dashboard data is returned correctly
- Checks data structure completeness

**Test Case 2: Data calculation and transformation accuracy**
- Tests most common mistake calculation
- Verifies improvement score calculation
- Tests fallback when UserAnalysis is missing

**Test Case 3: Error handling and edge cases**
- Tests empty bug entries handling
- Verifies missing userId validation
- Tests database error handling

**Test Case 4: Performance optimization and query efficiency**
- Verifies aggregation pipeline efficiency
- Tests query optimization (limit, select, lean)
- Ensures optimal database queries

### 3. analyticsController (GET /api/analytics)

**Test Case 1: Optimal aggregation data flow for all three metrics**
- Tests all three aggregations (bugType, project, language)
- Verifies parallel execution efficiency
- Checks complete data structure

**Test Case 2: Data aggregation accuracy and sorting**
- Tests correct grouping and counting
- Verifies descending sort order
- Tests projection transformations

**Test Case 3: Error handling and edge cases**
- Tests empty results handling
- Verifies missing userId validation
- Tests database aggregation errors

**Test Case 4: Performance optimization and query efficiency**
- Verifies $match stage usage for filtering
- Tests $group and $sum for efficient counting
- Ensures optimal query execution

### 4. bugHistoryController (GET /api/bug-history)

**Test Case 1: Optimal pagination and data flow**
- Tests pagination calculation
- Verifies correct skip/limit application
- Checks response structure with pagination metadata

**Test Case 2: Filter accuracy and date range handling**
- Tests bugType filtering
- Tests dateRange filtering (today, week, month, year)
- Tests custom date range parsing
- Verifies combined filters

**Test Case 3: Error handling and edge cases**
- Tests empty results with correct pagination
- Verifies missing userId validation
- Tests default pagination values
- Tests database error handling

**Test Case 4: Performance optimization and query efficiency**
- Verifies lean() usage for performance
- Tests correct skip/limit calculations
- Tests sorting optimization
- Verifies totalPages calculation accuracy

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Unit Tests
```bash
npm run test:unit
```

### Run Tests in Watch Mode
```bash
npm run test:unit:watch
```

### Run Tests with Coverage
```bash
npm run test:unit:coverage
```

### Run Specific Test File
```bash
npm run test:unit -- analyzeController.test.js
```

## Test Coverage

The tests use mocks for:
- **Services**: mlService, geminiService, dbService
- **Models**: BugEntry, UserAnalysis
- **Mongoose**: ObjectId conversion

This ensures:
- Fast test execution (no real database calls)
- Isolated unit testing
- Reliable and repeatable tests

## What the Tests Verify

### Data Flow Optimization
- ✅ All data transformations are correct
- ✅ No unnecessary database calls
- ✅ Efficient query structures
- ✅ Proper error handling

### Performance
- ✅ Async operations don't block responses
- ✅ Query optimization (lean, select, limit)
- ✅ Efficient aggregation pipelines
- ✅ Correct pagination calculations

### Accuracy
- ✅ Correct data calculations
- ✅ Proper filtering and sorting
- ✅ Accurate pagination metadata
- ✅ Correct date range handling

### Error Handling
- ✅ Graceful error handling
- ✅ Fallback mechanisms
- ✅ Proper validation
- ✅ Error response structure

## Example Test Output

```
PASS  src/__tests__/controllers/analyzeController.test.js
  analyzeController - POST /api/analyze
    Test Case 1: Successful code analysis with optimal data flow
      ✓ should process code analysis end-to-end with all data transformations (45ms)
    Test Case 2: Data transformation and language detection
      ✓ should correctly extract project name and detect language from filePath (12ms)
    Test Case 3: Error handling and fallback mechanisms
      ✓ should handle Gemini JSON parse errors gracefully with fallback data (8ms)
      ✓ should return 400 error when required fields are missing (5ms)
    Test Case 4: Performance and async operations optimization
      ✓ should not block response waiting for UserAnalysis update (15ms)
      ✓ should handle UserAnalysis update errors without affecting response (7ms)

Test Suites: 4 passed, 4 total
Tests:       16 passed, 16 total
Snapshots:   0 total
Time:        2.345 s
```

## Notes

- All tests use mocks to avoid external dependencies
- Tests verify both success and error scenarios
- Each test case focuses on a specific aspect of optimal data flow
- Tests are designed to catch performance regressions
- Mock data is realistic and covers edge cases

