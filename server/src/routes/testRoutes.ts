import { Router } from 'express';
import { TestController } from '../controllers';
import { validateBody, validateParams } from '../middleware/validation';
import { TestSchema, TestUpdateSchema } from '../schemas/validation';
import { z } from 'zod';

const router = Router();

// Parameter validation schema
const idParamSchema = z.object({
  id: z.string().min(1, 'Test ID is required'),
});

const categoryParamSchema = z.object({
  category: z.string().min(1, 'Category is required'),
});

// GET /api/tests - Get all tests
router.get('/', TestController.getAllTests);

// GET /api/tests/search?q=searchTerm - Search tests
router.get('/search', TestController.searchTests);

// GET /api/tests/categories - Get all test categories
router.get('/categories', TestController.getTestCategories);

// GET /api/tests/category/:category - Get tests by category
router.get(
  '/category/:category',
  validateParams(categoryParamSchema),
  TestController.getTestsByCategory
);

// GET /api/tests/:id - Get test by ID
router.get(
  '/:id',
  validateParams(idParamSchema),
  TestController.getTestById
);

// POST /api/tests - Create new test
router.post(
  '/',
  validateBody(TestSchema),
  TestController.createTest
);

// PUT /api/tests/:id - Update test
router.put(
  '/:id',
  validateParams(idParamSchema),
  validateBody(TestUpdateSchema),
  TestController.updateTest
);

// DELETE /api/tests/:id - Delete test
router.delete(
  '/:id',
  validateParams(idParamSchema),
  TestController.deleteTest
);

export default router; 