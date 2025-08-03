import { Request, Response } from 'express';
import { TestService } from '../services';
import { sendSuccess, sendError, sendServerError } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';

export class TestController {
  getAllTests = asyncHandler(async (req: Request, res: Response) => {
    try {
      const tests = await TestService.getAllTests();
      return sendSuccess(res, tests);
    } catch (error) {
      console.error('Get all tests error:', error);
      return sendServerError(res, error instanceof Error ? error.message : 'Failed to fetch tests');
    }
  });

  getTestById = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const test = await TestService.getTestById(id);
      
      if (!test) {
        return sendError(res, 'Test not found', 404);
      }
      
      return sendSuccess(res, test);
    } catch (error) {
      console.error('Get test by ID error:', error);
      return sendServerError(res, error instanceof Error ? error.message : 'Failed to fetch test');
    }
  });

  createTest = asyncHandler(async (req: Request, res: Response) => {
    try {
      const test = await TestService.createTest(req.body);
      return sendSuccess(res, test, 'Test created successfully', 201);
    } catch (error) {
      console.error('Create test error:', error);
      if (error instanceof Error && error.message.includes('already exists')) {
        return sendError(res, error.message, 409);
      }
      return sendServerError(res, error instanceof Error ? error.message : 'Failed to create test');
    }
  });

  updateTest = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const test = await TestService.updateTest(id, req.body);
      return sendSuccess(res, test, 'Test updated successfully');
    } catch (error) {
      console.error('Update test error:', error);
      if (error instanceof Error && error.message.includes('not found')) {
        return sendError(res, error.message, 404);
      }
      if (error instanceof Error && error.message.includes('already exists')) {
        return sendError(res, error.message, 409);
      }
      return sendServerError(res, error instanceof Error ? error.message : 'Failed to update test');
    }
  });

  deleteTest = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await TestService.deleteTest(id);
      return sendSuccess(res, null, 'Test deleted successfully');
    } catch (error) {
      console.error('Delete test error:', error);
      if (error instanceof Error && error.message.includes('not found')) {
        return sendError(res, error.message, 404);
      }
      return sendServerError(res, error instanceof Error ? error.message : 'Failed to delete test');
    }
  });

  searchTests = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return sendError(res, 'Search query is required');
      }
      
      const tests = await TestService.searchTests(q);
      return sendSuccess(res, tests);
    } catch (error) {
      console.error('Search tests error:', error);
      return sendServerError(res, error instanceof Error ? error.message : 'Failed to search tests');
    }
  });

  getTestsByCategory = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      const tests = await TestService.getTestsByCategory(category);
      return sendSuccess(res, tests);
    } catch (error) {
      console.error('Get tests by category error:', error);
      return sendServerError(res, error instanceof Error ? error.message : 'Failed to fetch tests by category');
    }
  });

  getTestCategories = asyncHandler(async (req: Request, res: Response) => {
    try {
      const categories = await TestService.getTestCategories();
      return sendSuccess(res, categories);
    } catch (error) {
      console.error('Get test categories error:', error);
      return sendServerError(res, error instanceof Error ? error.message : 'Failed to fetch test categories');
    }
  });
}

export default new TestController(); 