import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { getDashboard } from '../../controllers/dashboardController.js';
import BugEntry from '../../models/bugEntry.model.js';
import UserAnalysis from '../../models/userAnalysis.model.js';
import mongoose from 'mongoose';

// Mock models
jest.mock('../../models/bugEntry.model.js', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('../../models/userAnalysis.model.js', () => ({
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

describe('dashboardController - GET /api/dashboard', () => {
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

  describe('Test Case 1: Optimal data aggregation and flow', () => {
    it('should efficiently aggregate and return all dashboard data in optimal structure', async () => {
      // Arrange - Setup optimal data flow
      const userId = '507f1f77bcf86cd799439011';
      req.query = { userId };

      const mockStatCards = [{
        totalBugs: 15,
        bugTypes: ['Logic Error', 'Logic Error', 'Syntax Error', 'Performance Issue', 'Logic Error'],
      }];

      const mockUserAnalysis = {
        improvementScore: 85,
        patternRecognition: 'You show patterns of logic errors',
        rootCauseAnalysis: 'Common root cause is missing validation',
        improvementInsights: 'Focus on input validation',
        personalizedRecommendation: 'Add validation checks',
      };

      const mockBugsVsTime = [
        { date: '2024-01-15', count: 3 },
        { date: '2024-01-16', count: 5 },
        { date: '2024-01-17', count: 7 },
      ];

      const mockRecentBugs = [
        {
          bugType: 'Logic Error',
          projectName: 'project1',
          language: 'JavaScript',
          filePath: 'src/test.js',
          timestamp: new Date('2024-01-17'),
          rootCause: 'Missing null check',
          suggestedFix: 'Add null validation',
        },
      ];

      // Mock aggregate to return optimal data
      BugEntry.aggregate = jest.fn()
        .mockResolvedValueOnce(mockStatCards) // First call for statCards
        .mockResolvedValueOnce(mockBugsVsTime); // Second call for bugsVsTime

      UserAnalysis.findOne = jest.fn().mockResolvedValue(mockUserAnalysis);
      
      const mockFindChain = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockRecentBugs),
      };
      BugEntry.find = jest.fn().mockReturnValue(mockFindChain);

      // Act
      await getDashboard(req, res);

      // Assert - Verify optimal data flow and structure
      expect(BugEntry.aggregate).toHaveBeenCalledTimes(2);
      expect(UserAnalysis.findOne).toHaveBeenCalledWith({ userId: expect.anything() });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        statCards: {
          totalBugs: 15,
          mostCommonMistake: 'Logic Error',
          improvementScore: 85,
        },
        aiAnalysis: {
          patternRecognition: 'You show patterns of logic errors',
          rootCauseAnalysis: 'Common root cause is missing validation',
          improvementInsights: 'Focus on input validation',
          personalizedRecommendation: 'Add validation checks',
        },
        bugsVsTime: mockBugsVsTime,
        recentBugs: mockRecentBugs,
      });
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('Test Case 2: Data calculation and transformation accuracy', () => {
    it('should correctly calculate most common mistake from aggregated bug types', async () => {
      // Arrange - Test different bug type distributions
      const testCases = [
        {
          bugTypes: ['A', 'A', 'A', 'B', 'B'],
          expected: 'A',
        },
        {
          bugTypes: ['X', 'Y', 'Z', 'Y', 'Z', 'Y'],
          expected: 'Y',
        },
        {
          bugTypes: ['Type1', 'Type2', 'Type3'],
          expected: 'Type3', // Last one wins with reduce when equal counts
        },
      ];

      for (const testCase of testCases) {
        jest.clearAllMocks();
        req.query = { userId: '507f1f77bcf86cd799439011' };

        BugEntry.aggregate = jest.fn()
          .mockResolvedValueOnce([{
            totalBugs: testCase.bugTypes.length,
            bugTypes: testCase.bugTypes,
          }])
          .mockResolvedValueOnce([]);

        UserAnalysis.findOne = jest.fn().mockResolvedValue(null);
        const mockFindChain = {
          sort: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          lean: jest.fn().mockResolvedValue([]),
        };
        BugEntry.find = jest.fn().mockReturnValue(mockFindChain);

        // Act
        await getDashboard(req, res);

        // Assert - Verify correct calculation
        const callArgs = res.json.mock.calls[0][0];
        expect(callArgs.statCards.mostCommonMistake).toBe(testCase.expected);
      }
    });

    it('should calculate improvement score correctly when UserAnalysis is missing', async () => {
      // Arrange
      req.query = { userId: '507f1f77bcf86cd799439011' };

      BugEntry.aggregate = jest.fn()
        .mockResolvedValueOnce([{ totalBugs: 10, bugTypes: ['A'] }])
        .mockResolvedValueOnce([]);

      UserAnalysis.findOne = jest.fn().mockResolvedValue(null);
      BugEntry.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]),
      });

      // Act
      await getDashboard(req, res);

      // Assert - Should calculate: 100 - (10 * 2) = 80
      const callArgs = res.json.mock.calls[0][0];
      expect(callArgs.statCards.improvementScore).toBe(80);
    });
  });

  describe('Test Case 3: Error handling and edge cases', () => {
    it('should handle empty bug entries gracefully', async () => {
      // Arrange - No bugs in database
      req.query = { userId: '507f1f77bcf86cd799439011' };

      BugEntry.aggregate = jest.fn()
        .mockResolvedValueOnce([]) // No stat cards
        .mockResolvedValueOnce([]); // No bugs vs time

      UserAnalysis.findOne = jest.fn().mockResolvedValue(null);
      const mockFindChain = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]),
      };
      BugEntry.find = jest.fn().mockReturnValue(mockFindChain);

      // Act
      await getDashboard(req, res);

      // Assert - Should return default values
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        statCards: {
          totalBugs: 0,
          mostCommonMistake: 'N/A',
          improvementScore: 100, // 100 - (0 * 2)
        },
        aiAnalysis: {
          patternRecognition: "We're still analyzing your coding patterns. Keep coding!",
          rootCauseAnalysis: 'No root cause analysis available yet.',
          improvementInsights: 'No improvement insights available yet.',
          personalizedRecommendation: 'No personalized recommendations available yet.',
        },
        bugsVsTime: [],
        recentBugs: [],
      });
    });

    it('should return 400 error when userId is missing', async () => {
      // Arrange
      req.query = {};

      // Act
      await getDashboard(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'userId is required' });
      expect(BugEntry.aggregate).not.toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      req.query = { userId: '507f1f77bcf86cd799439011' };

      BugEntry.aggregate = jest.fn().mockRejectedValue(new Error('Database error'));

      // Act
      await getDashboard(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Internal Server Error',
        message: 'Database error',
      });
    });
  });

  describe('Test Case 4: Performance optimization and query efficiency', () => {
    it('should use efficient aggregation pipelines for optimal performance', async () => {
      // Arrange
      req.query = { userId: '507f1f77bcf86cd799439011' };

      const mockAggregate = jest.fn()
        .mockResolvedValueOnce([{ totalBugs: 5, bugTypes: ['A', 'B'] }])
        .mockResolvedValueOnce([{ date: '2024-01-01', count: 1 }]);

      BugEntry.aggregate = mockAggregate;
      UserAnalysis.findOne = jest.fn().mockResolvedValue(null);
      BugEntry.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]),
      });

      // Act
      await getDashboard(req, res);

      // Assert - Verify aggregation pipelines are called correctly
      expect(mockAggregate).toHaveBeenCalledTimes(2);

      // Verify first aggregation (statCards) uses $match and $group
      const firstCall = mockAggregate.mock.calls[0][0];
      expect(firstCall).toContainEqual(
        expect.objectContaining({ $match: expect.anything() })
      );
      expect(firstCall).toContainEqual(
        expect.objectContaining({ $group: expect.anything() })
      );

      // Verify second aggregation (bugsVsTime) uses date grouping
      const secondCall = mockAggregate.mock.calls[1][0];
      expect(secondCall).toContainEqual(
        expect.objectContaining({ $group: expect.objectContaining({ _id: expect.anything() }) })
      );
    });

    it('should limit recent bugs query to 5 for optimal performance', async () => {
      // Arrange
      req.query = { userId: '507f1f77bcf86cd799439011' };

      const mockFind = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]),
      };

      BugEntry.aggregate = jest.fn()
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);
      UserAnalysis.findOne = jest.fn().mockResolvedValue(null);
      BugEntry.find = jest.fn().mockReturnValue(mockFind);

      // Act
      await getDashboard(req, res);

      // Assert - Verify query optimization
      expect(mockFind.sort).toHaveBeenCalledWith({ timestamp: -1 });
      expect(mockFind.limit).toHaveBeenCalledWith(5);
      expect(mockFind.select).toHaveBeenCalledWith('bugType projectName language filePath timestamp rootCause suggestedFix');
      expect(mockFind.lean).toHaveBeenCalled(); // lean() for better performance
    });
  });
});

