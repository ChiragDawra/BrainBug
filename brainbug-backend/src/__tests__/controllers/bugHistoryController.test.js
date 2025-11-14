import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { getBugHistory } from '../../controllers/bugHistoryController.js';
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

describe('bugHistoryController - GET /api/bug-history', () => {
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

  describe('Test Case 1: Optimal pagination and data flow', () => {
    it('should efficiently paginate and return bug history with correct structure', async () => {
      // Arrange - Setup optimal pagination flow
      const userId = '507f1f77bcf86cd799439011';
      req.query = {
        userId,
        page: '2',
        limit: '10',
      };

      const mockBugs = [
        {
          _id: 'bug1',
          bugType: 'Logic Error',
          projectName: 'project1',
          language: 'JavaScript',
          filePath: 'src/test.js',
          timestamp: new Date('2024-01-17'),
        },
        {
          _id: 'bug2',
          bugType: 'Syntax Error',
          projectName: 'project2',
          language: 'TypeScript',
          filePath: 'src/test2.ts',
          timestamp: new Date('2024-01-16'),
        },
      ];

      BugEntry.countDocuments = jest.fn().mockResolvedValue(25);
      BugEntry.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockBugs),
      });

      // Act
      await getBugHistory(req, res);

      // Assert - Verify optimal data flow
      expect(BugEntry.countDocuments).toHaveBeenCalledWith({ userId: expect.anything() });
      expect(BugEntry.find).toHaveBeenCalledWith({ userId: expect.anything() });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockBugs,
        pagination: {
          page: 2,
          limit: 10,
          total: 25,
          totalPages: 3,
        },
      });
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('Test Case 2: Filter accuracy and date range handling', () => {
    it('should correctly filter by bugType and dateRange with optimal query building', async () => {
      // Arrange - Test different filter combinations
      const testCases = [
        {
          query: { userId: '507f1f77bcf86cd799439011', bugType: 'Logic Error' },
          expectedFilter: { userId: expect.anything(), bugType: 'Logic Error' },
        },
        {
          query: { userId: '507f1f77bcf86cd799439011', dateRange: 'week' },
          expectedFilter: { userId: expect.anything(), timestamp: expect.objectContaining({ $gte: expect.any(Date) }) },
        },
        {
          query: { userId: '507f1f77bcf86cd799439011', dateRange: 'month' },
          expectedFilter: { userId: expect.anything(), timestamp: expect.objectContaining({ $gte: expect.any(Date) }) },
        },
        {
          query: { userId: '507f1f77bcf86cd799439011', bugType: 'Syntax Error', dateRange: 'today' },
          expectedFilter: { userId: expect.anything(), bugType: 'Syntax Error', timestamp: expect.objectContaining({ $gte: expect.any(Date) }) },
        },
      ];

      for (const testCase of testCases) {
        jest.clearAllMocks();
        req.query = testCase.query;

        BugEntry.countDocuments = jest.fn().mockResolvedValue(5);
        BugEntry.find = jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnThis(),
          skip: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          lean: jest.fn().mockResolvedValue([]),
        });

        // Act
        await getBugHistory(req, res);

        // Assert - Verify correct filter is applied
        expect(BugEntry.find).toHaveBeenCalledWith(testCase.expectedFilter);
      }
    });

    it('should correctly parse custom date range format', async () => {
      // Arrange
      req.query = {
        userId: '507f1f77bcf86cd799439011',
        dateRange: '2024-01-01,2024-01-31',
      };

      BugEntry.countDocuments = jest.fn().mockResolvedValue(0);
      BugEntry.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]),
      });

      // Act
      await getBugHistory(req, res);

      // Assert - Verify custom date range is parsed correctly
      const findCall = BugEntry.find.mock.calls[0][0];
      expect(findCall.timestamp).toEqual({
        $gte: new Date('2024-01-01'),
        $lte: new Date('2024-01-31'),
      });
    });
  });

  describe('Test Case 3: Error handling and edge cases', () => {
    it('should handle empty results with correct pagination metadata', async () => {
      // Arrange - No bugs found
      req.query = { userId: '507f1f77bcf86cd799439011', page: '1', limit: '10' };

      BugEntry.countDocuments = jest.fn().mockResolvedValue(0);
      BugEntry.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]),
      });

      // Act
      await getBugHistory(req, res);

      // Assert - Should return empty array with correct pagination
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      });
    });

    it('should return 400 error when userId is missing', async () => {
      // Arrange
      req.query = { page: '1', limit: '10' };

      // Act
      await getBugHistory(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'userId is required' });
      expect(BugEntry.find).not.toHaveBeenCalled();
    });

    it('should use default pagination values when not provided', async () => {
      // Arrange
      req.query = { userId: '507f1f77bcf86cd799439011' };

      BugEntry.countDocuments = jest.fn().mockResolvedValue(15);
      BugEntry.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]),
      });

      // Act
      await getBugHistory(req, res);

      // Assert - Should use defaults: page=1, limit=10
      expect(BugEntry.find().skip).toHaveBeenCalledWith(0); // (1-1) * 10
      expect(BugEntry.find().limit).toHaveBeenCalledWith(10);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          pagination: {
            page: 1,
            limit: 10,
            total: 15,
            totalPages: 2,
          },
        })
      );
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      req.query = { userId: '507f1f77bcf86cd799439011' };

      BugEntry.countDocuments = jest.fn().mockRejectedValue(new Error('Database error'));

      // Act
      await getBugHistory(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Internal Server Error',
        message: 'Database error',
      });
    });
  });

  describe('Test Case 4: Performance optimization and query efficiency', () => {
    it('should use lean() for optimal query performance', async () => {
      // Arrange
      req.query = { userId: '507f1f77bcf86cd799439011' };

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]),
      };

      BugEntry.countDocuments = jest.fn().mockResolvedValue(10);
      BugEntry.find = jest.fn().mockReturnValue(mockQuery);

      // Act
      await getBugHistory(req, res);

      // Assert - Verify lean() is called for better performance
      expect(mockQuery.lean).toHaveBeenCalled();
    });

    it('should correctly calculate skip and limit for pagination', async () => {
      // Arrange - Test different page/limit combinations
      const testCases = [
        { page: '1', limit: '10', expectedSkip: 0, expectedLimit: 10 },
        { page: '2', limit: '10', expectedSkip: 10, expectedLimit: 10 },
        { page: '3', limit: '5', expectedSkip: 10, expectedLimit: 5 },
        { page: '1', limit: '20', expectedSkip: 0, expectedLimit: 20 },
      ];

      for (const testCase of testCases) {
        jest.clearAllMocks();
        req.query = {
          userId: '507f1f77bcf86cd799439011',
          page: testCase.page,
          limit: testCase.limit,
        };

        const mockQuery = {
          sort: jest.fn().mockReturnThis(),
          skip: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          lean: jest.fn().mockResolvedValue([]),
        };

        BugEntry.countDocuments = jest.fn().mockResolvedValue(50);
        BugEntry.find = jest.fn().mockReturnValue(mockQuery);

        // Act
        await getBugHistory(req, res);

        // Assert - Verify correct pagination calculation
        expect(mockQuery.skip).toHaveBeenCalledWith(testCase.expectedSkip);
        expect(mockQuery.limit).toHaveBeenCalledWith(testCase.expectedLimit);
      }
    });

    it('should sort by timestamp descending for optimal data retrieval', async () => {
      // Arrange
      req.query = { userId: '507f1f77bcf86cd799439011' };

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]),
      };

      BugEntry.countDocuments = jest.fn().mockResolvedValue(10);
      BugEntry.find = jest.fn().mockReturnValue(mockQuery);

      // Act
      await getBugHistory(req, res);

      // Assert - Verify sorting is applied
      expect(mockQuery.sort).toHaveBeenCalledWith({ timestamp: -1 });
    });

    it('should calculate totalPages correctly for edge cases', async () => {
      // Arrange - Test edge cases for totalPages calculation
      const testCases = [
        { total: 0, limit: 10, expectedPages: 0 },
        { total: 10, limit: 10, expectedPages: 1 },
        { total: 11, limit: 10, expectedPages: 2 },
        { total: 25, limit: 10, expectedPages: 3 },
        { total: 100, limit: 7, expectedPages: 15 }, // Math.ceil(100/7) = 15
      ];

      for (const testCase of testCases) {
        jest.clearAllMocks();
        req.query = { userId: '507f1f77bcf86cd799439011', limit: testCase.limit.toString() };

        const mockQuery = {
          sort: jest.fn().mockReturnThis(),
          skip: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          lean: jest.fn().mockResolvedValue([]),
        };

        BugEntry.countDocuments = jest.fn().mockResolvedValue(testCase.total);
        BugEntry.find = jest.fn().mockReturnValue(mockQuery);

        // Act
        await getBugHistory(req, res);

        // Assert - Verify totalPages calculation
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            pagination: expect.objectContaining({
              totalPages: testCase.expectedPages,
            }),
          })
        );
      }
    });
  });
});

