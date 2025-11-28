import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { getAnalytics } from '../../controllers/analyticsController.js';
import BugEntry from '../../models/bugEntry.model.js';
import mongoose from 'mongoose';

// Mock model
jest.mock('../../models/bugEntry.model.js', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('mongoose', () => ({
  Types: {
    ObjectId: class {
      constructor(id) {
        this.id = id;
      }
      static isValid(id) {
        return typeof id === 'string' && id.length === 24;
      }
      toString() {
        return this.id;
      }
    },
  },
}));

describe('analyticsController - GET /api/analytics', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      query: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // mongoose mock is already set up in jest.mock
  });

  describe('Test Case 1: Optimal aggregation data flow for all three metrics', () => {
    it('should efficiently aggregate and return all three analytics datasets in parallel', async () => {
      // Arrange - Setup optimal data flow
      const userId = '507f1f77bcf86cd799439011';
      req.query = { userId };

      const mockBugTypeDistribution = [
        { bugType: 'Logic Error', count: 15 },
        { bugType: 'Syntax Error', count: 8 },
        { bugType: 'Performance Issue', count: 5 },
      ];

      const mockBugsByProject = [
        { projectName: 'frontend', count: 12 },
        { projectName: 'backend', count: 10 },
        { projectName: 'mobile', count: 6 },
      ];

      const mockBugsByLanguage = [
        { language: 'JavaScript', count: 18 },
        { language: 'TypeScript', count: 7 },
        { language: 'Python', count: 3 },
      ];

      // Mock aggregate to return optimal data for each aggregation
      BugEntry.aggregate = jest.fn()
        .mockResolvedValueOnce(mockBugTypeDistribution)
        .mockResolvedValueOnce(mockBugsByProject)
        .mockResolvedValueOnce(mockBugsByLanguage);

      // Act
      await getAnalytics(req, res);

      // Assert - Verify optimal data flow
      expect(BugEntry.aggregate).toHaveBeenCalledTimes(3);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        bugTypeDistribution: mockBugTypeDistribution,
        bugsByProject: mockBugsByProject,
        bugsByLanguage: mockBugsByLanguage,
      });
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('Test Case 2: Data aggregation accuracy and sorting', () => {
    it('should correctly group and sort data by count in descending order', async () => {
      // Arrange - Test sorting accuracy
      req.query = { userId: '507f1f77bcf86cd799439011' };

      const unsortedData = [
        { bugType: 'Type B', count: 5 },
        { bugType: 'Type A', count: 10 },
        { bugType: 'Type C', count: 3 },
      ];

      BugEntry.aggregate = jest.fn()
        .mockResolvedValueOnce(unsortedData)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      // Act
      await getAnalytics(req, res);

      // Assert - Verify data is sorted correctly (should be sorted by aggregation)
      const callArgs = res.json.mock.calls[0][0];
      expect(callArgs.bugTypeDistribution).toEqual(unsortedData);

      // Verify aggregation pipeline includes $sort
      const aggregateCalls = BugEntry.aggregate.mock.calls;
      aggregateCalls.forEach((call) => {
        const pipeline = call[0];
        const hasSort = pipeline.some((stage) => stage.$sort);
        expect(hasSort).toBe(true);
        if (hasSort) {
          const sortStage = pipeline.find((stage) => stage.$sort);
          expect(sortStage.$sort.count).toBe(-1); // Descending order
        }
      });
    });

    it('should correctly project and transform aggregation results', async () => {
      // Arrange
      req.query = { userId: '507f1f77bcf86cd799439011' };

      BugEntry.aggregate = jest.fn()
        .mockResolvedValueOnce([{ bugType: 'A', count: 1 }])
        .mockResolvedValueOnce([{ projectName: 'B', count: 2 }])
        .mockResolvedValueOnce([{ language: 'C', count: 3 }]);

      // Act
      await getAnalytics(req, res);

      // Assert - Verify projection stages in pipeline
      const aggregateCalls = BugEntry.aggregate.mock.calls;
      
      // First call should project bugType
      const firstPipeline = aggregateCalls[0][0];
      const firstProject = firstPipeline.find((stage) => stage.$project);
      expect(firstProject.$project).toHaveProperty('bugType');

      // Second call should project projectName
      const secondPipeline = aggregateCalls[1][0];
      const secondProject = secondPipeline.find((stage) => stage.$project);
      expect(secondProject.$project).toHaveProperty('projectName');

      // Third call should project language
      const thirdPipeline = aggregateCalls[2][0];
      const thirdProject = thirdPipeline.find((stage) => stage.$project);
      expect(thirdProject.$project).toHaveProperty('language');
    });
  });

  describe('Test Case 3: Error handling and edge cases', () => {
    it('should handle empty results gracefully', async () => {
      // Arrange - No data in database
      req.query = { userId: '507f1f77bcf86cd799439011' };

      BugEntry.aggregate = jest.fn()
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      // Act
      await getAnalytics(req, res);

      // Assert - Should return empty arrays
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        bugTypeDistribution: [],
        bugsByProject: [],
        bugsByLanguage: [],
      });
    });

    it('should return 400 error when userId is missing', async () => {
      // Arrange
      req.query = {};

      // Act
      await getAnalytics(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'userId is required' });
      expect(BugEntry.aggregate).not.toHaveBeenCalled();
    });

    it('should handle database aggregation errors gracefully', async () => {
      // Arrange
      req.query = { userId: '507f1f77bcf86cd799439011' };

      BugEntry.aggregate = jest.fn()
        .mockRejectedValueOnce(new Error('Aggregation failed'));

      // Act
      await getAnalytics(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Internal Server Error',
        message: 'Aggregation failed',
      });
    });
  });

  describe('Test Case 4: Performance optimization and query efficiency', () => {
    it('should use efficient $match stage to filter by userId before grouping', async () => {
      // Arrange
      req.query = { userId: '507f1f77bcf86cd799439011' };

      BugEntry.aggregate = jest.fn()
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      // Act
      await getAnalytics(req, res);

      // Assert - Verify $match is used first for optimal performance
      const aggregateCalls = BugEntry.aggregate.mock.calls;
      aggregateCalls.forEach((call) => {
        const pipeline = call[0];
        const firstStage = pipeline[0];
        expect(firstStage).toHaveProperty('$match');
        expect(firstStage.$match).toHaveProperty('userId');
      });
    });

    it('should use $group and $sum for efficient counting', async () => {
      // Arrange
      req.query = { userId: '507f1f77bcf86cd799439011' };

      BugEntry.aggregate = jest.fn()
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      // Act
      await getAnalytics(req, res);

      // Assert - Verify $group uses $sum for counting
      const aggregateCalls = BugEntry.aggregate.mock.calls;
      aggregateCalls.forEach((call) => {
        const pipeline = call[0];
        const groupStage = pipeline.find((stage) => stage.$group);
        expect(groupStage).toBeDefined();
        expect(groupStage.$group.count).toEqual({ $sum: 1 });
      });
    });

    it('should execute all three aggregations efficiently', async () => {
      // Arrange
      req.query = { userId: '507f1f77bcf86cd799439011' };

      const startTime = Date.now();
      BugEntry.aggregate = jest.fn()
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      // Act
      await getAnalytics(req, res);
      const endTime = Date.now();

      // Assert - Verify all three are called
      expect(BugEntry.aggregate).toHaveBeenCalledTimes(3);
      // Verify they're called in sequence (could be optimized to run in parallel)
      expect(endTime - startTime).toBeLessThan(1000); // Should complete quickly
    });
  });
});

