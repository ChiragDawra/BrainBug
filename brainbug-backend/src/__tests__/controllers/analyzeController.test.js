import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Create mock functions
const mockRunMLModel = jest.fn();
const mockAnalyzeWithGemini = jest.fn();
const mockSaveBugEntry = jest.fn();
const mockUpdateUserAnalysisAsync = jest.fn();

// Mock modules before importing
jest.unstable_mockModule('../../services/mlService.js', () => ({
  runMLModel: mockRunMLModel,
}));

jest.unstable_mockModule('../../services/geminiService.js', () => ({
  analyzeWithGemini: mockAnalyzeWithGemini,
}));

jest.unstable_mockModule('../../services/dbService.js', () => ({
  saveBugEntry: mockSaveBugEntry,
  updateUserAnalysisAsync: mockUpdateUserAnalysisAsync,
}));

jest.unstable_mockModule('mongoose', () => ({
  default: {
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
  },
}));

// Now import the controller
const { analyzeCode } = await import('../../controllers/analyzeController.js');

describe('analyzeController - POST /api/analyze', () => {
  let req, res;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup request mock
    req = {
      body: {},
    };

    // Setup response mock
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('Test Case 1: Successful code analysis with optimal data flow', () => {
    it('should process code analysis end-to-end with all data transformations', async () => {
      // Arrange - Setup optimal data flow
      const testCode = 'function test() { return true; }';
      const testFilePath = 'my-project/src/utils/test.js';
      const testUserId = '507f1f77bcf86cd799439011';

      req.body = {
        code: testCode,
        filePath: testFilePath,
        userId: testUserId,
      };

      const mockMLOutput = {
        bug_count: 2,
        bugs: ['Unused variable', 'Potential infinite loop'],
        quality_score: 6.8,
      };

      const mockGeminiOutput = {
        analysis: JSON.stringify({
          bugType: 'Logic Error',
          rootCause: 'Missing null check before accessing property',
          recommendation: 'Always validate input before processing',
          suggestedFix: 'Add null check: if (data) { ... }',
        }),
        model: 'gemini-2.5-flash',
      };

      const mockBugEntry = {
        _id: '507f1f77bcf86cd799439012',
        userId: testUserId,
        projectName: 'my-project',
        language: 'JavaScript',
        filePath: testFilePath,
        bugType: 'Logic Error',
        rootCause: 'Missing null check before accessing property',
        recommendation: 'Always validate input before processing',
        suggestedFix: 'Add null check: if (data) { ... }',
      };

      // Mock service calls
      mockRunMLModel.mockResolvedValue(mockMLOutput);
      mockAnalyzeWithGemini.mockResolvedValue(mockGeminiOutput);
      mockSaveBugEntry.mockResolvedValue(mockBugEntry);
      mockUpdateUserAnalysisAsync.mockResolvedValue();

      // Act
      await analyzeCode(req, res);

      // Assert - Verify optimal data flow
      expect(mockRunMLModel).toHaveBeenCalledWith(testCode);
      expect(mockAnalyzeWithGemini).toHaveBeenCalledWith(
        testCode,
        mockMLOutput,
        testFilePath
      );
      expect(mockSaveBugEntry).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: expect.anything(),
          projectName: 'my-project',
          language: 'JavaScript',
          filePath: testFilePath,
          bugType: 'Logic Error',
          rootCause: 'Missing null check before accessing property',
          recommendation: 'Always validate input before processing',
          suggestedFix: 'Add null check: if (data) { ... }',
        })
      );
      expect(mockUpdateUserAnalysisAsync).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        ml: mockMLOutput,
        gemini: JSON.parse(mockGeminiOutput.analysis),
        bugEntry: {
          id: mockBugEntry._id,
          bugType: mockBugEntry.bugType,
          projectName: mockBugEntry.projectName,
          language: mockBugEntry.language,
        },
      });
    });
  });

  describe('Test Case 2: Data transformation and language detection', () => {
    it('should correctly extract project name and detect language from filePath', async () => {
      // Arrange - Test different file paths and languages
      const testCases = [
        { filePath: 'frontend/src/components/Button.tsx', expectedLang: 'TypeScript', expectedProject: 'frontend' },
        { filePath: 'backend/api/routes/user.py', expectedLang: 'Python', expectedProject: 'backend' },
        { filePath: 'mobile/android/MainActivity.java', expectedLang: 'Java', expectedProject: 'mobile' },
        { filePath: 'utils/helper.js', expectedLang: 'JavaScript', expectedProject: 'utils' },
      ];

      for (const testCase of testCases) {
        jest.clearAllMocks();
        req.body = {
          code: 'test code',
          filePath: testCase.filePath,
          userId: '507f1f77bcf86cd799439011',
        };

        const mockGeminiOutput = {
          analysis: JSON.stringify({
            bugType: 'Test',
            rootCause: 'Test',
            recommendation: 'Test',
            suggestedFix: 'Test',
          }),
        };

        mockRunMLModel.mockResolvedValue({ bug_count: 0 });
        mockAnalyzeWithGemini.mockResolvedValue(mockGeminiOutput);
        mockSaveBugEntry.mockResolvedValue({ _id: '123', bugType: 'Test', projectName: testCase.expectedProject, language: testCase.expectedLang });
        mockUpdateUserAnalysisAsync.mockResolvedValue();

        // Act
        await analyzeCode(req, res);

        // Assert - Verify correct language and project extraction
        expect(mockSaveBugEntry).toHaveBeenCalledWith(
          expect.objectContaining({
            projectName: testCase.expectedProject,
            language: testCase.expectedLang,
          })
        );
      }
    });
  });

  describe('Test Case 3: Error handling and fallback mechanisms', () => {
    it('should handle Gemini JSON parse errors gracefully with fallback data', async () => {
      // Arrange - Simulate invalid JSON from Gemini
      req.body = {
        code: 'test code',
        filePath: 'test.js',
        userId: '507f1f77bcf86cd799439011',
      };

      const mockMLOutput = { bug_count: 1 };
      const invalidGeminiOutput = {
        analysis: 'This is not valid JSON { incomplete',
        model: 'gemini-2.5-flash',
      };

      const mockBugEntry = {
        _id: '123',
        bugType: 'Unknown',
        projectName: 'test',
        language: 'Other',
      };

      mockRunMLModel.mockResolvedValue(mockMLOutput);
      mockAnalyzeWithGemini.mockResolvedValue(invalidGeminiOutput);
      mockSaveBugEntry.mockResolvedValue(mockBugEntry);
      mockUpdateUserAnalysisAsync.mockResolvedValue();

      // Act
      await analyzeCode(req, res);

      // Assert - Verify fallback structure is used
      expect(mockSaveBugEntry).toHaveBeenCalledWith(
        expect.objectContaining({
          bugType: 'Unknown',
          rootCause: expect.stringContaining('This is not valid JSON'),
          recommendation: 'Review the code carefully',
          suggestedFix: 'Please review the analysis above',
        })
      );
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          gemini: expect.objectContaining({
            bugType: 'Unknown',
          }),
        })
      );
    });

    it('should return 400 error when required fields are missing', async () => {
      // Test missing code
      req.body = { filePath: 'test.js', userId: '123' };
      await analyzeCode(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Code is required' });

      jest.clearAllMocks();
      res.status.mockReturnThis();

      // Test missing userId
      req.body = { code: 'test', filePath: 'test.js' };
      await analyzeCode(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'userId is required' });
    });
  });

  describe('Test Case 4: Performance and async operations optimization', () => {
    it('should not block response waiting for UserAnalysis update', async () => {
      // Arrange
      req.body = {
        code: 'test code',
        filePath: 'test.js',
        userId: '507f1f77bcf86cd799439011',
      };

      const mockBugEntry = { _id: '123', bugType: 'Test', projectName: 'test', language: 'Other' };

      mockRunMLModel.mockResolvedValue({ bug_count: 0 });
      mockAnalyzeWithGemini.mockResolvedValue({
        analysis: JSON.stringify({ bugType: 'Test', rootCause: 'Test', recommendation: 'Test', suggestedFix: 'Test' }),
      });
      mockSaveBugEntry.mockResolvedValue(mockBugEntry);

      // Mock updateUserAnalysisAsync to be slow
      let resolveUpdate;
      const slowUpdate = new Promise((resolve) => {
        resolveUpdate = resolve;
      });
      mockUpdateUserAnalysisAsync.mockReturnValue(slowUpdate);

      // Act
      const analyzePromise = analyzeCode(req, res);

      // Assert - Response should be sent before update completes
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(res.json).toHaveBeenCalled(); // Response sent
      expect(mockUpdateUserAnalysisAsync).toHaveBeenCalled(); // Update started

      // Complete the update
      resolveUpdate();
      await analyzePromise;

      // Verify response was sent with correct data
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });

    it('should handle UserAnalysis update errors without affecting response', async () => {
      // Arrange
      req.body = {
        code: 'test code',
        filePath: 'test.js',
        userId: '507f1f77bcf86cd799439011',
      };

      const mockBugEntry = { _id: '123', bugType: 'Test', projectName: 'test', language: 'Other' };

      mockRunMLModel.mockResolvedValue({ bug_count: 0 });
      mockAnalyzeWithGemini.mockResolvedValue({
        analysis: JSON.stringify({ bugType: 'Test', rootCause: 'Test', recommendation: 'Test', suggestedFix: 'Test' }),
      });
      mockSaveBugEntry.mockResolvedValue(mockBugEntry);
      mockUpdateUserAnalysisAsync.mockRejectedValue(new Error('Update failed'));

      // Act
      await analyzeCode(req, res);

      // Assert - Response should still be successful
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
      expect(res.status).not.toHaveBeenCalledWith(500);
    });
  });
});
