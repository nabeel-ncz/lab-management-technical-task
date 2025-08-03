import { Router } from 'express';
import multer from 'multer';
import { InvestigationController } from '../controllers';
import { validateBody, validateParams, validateQuery } from '../middleware/validation';
import { 
  InvestigationSchema, 
  InvestigationUpdateSchema,
  MoveInvestigationSchema,
  InvestigationQuerySchema 
} from '../schemas/validation';
import { z } from 'zod';

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow PDF and text files
    if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and text files are allowed'));
    }
  },
});

// Parameter validation schema
const idParamSchema = z.object({
  id: z.string().min(1, 'Investigation ID is required'),
});

// GET /api/investigations - Get all investigations with optional filtering
router.get(
  '/',
  validateQuery(InvestigationQuerySchema),
  InvestigationController.getAllInvestigations
);

// GET /api/investigations/stats - Get investigation statistics
router.get('/stats', InvestigationController.getInvestigationStats);

// GET /api/investigations/:id - Get investigation by ID
router.get(
  '/:id',
  validateParams(idParamSchema),
  InvestigationController.getInvestigationById
);

// POST /api/investigations - Create new investigation
router.post(
  '/',
  validateBody(InvestigationSchema),
  InvestigationController.createInvestigation
);

// PUT /api/investigations/:id - Update investigation
router.put(
  '/:id',
  validateParams(idParamSchema),
  validateBody(InvestigationUpdateSchema),
  InvestigationController.updateInvestigation
);

// POST /api/investigations/:id/move - Move investigation (drag-and-drop)
// This matches the frontend moveInvestigation API call
router.post(
  '/:id/move',
  validateParams(idParamSchema),
  validateBody(MoveInvestigationSchema),
  InvestigationController.moveInvestigation
);

// POST /api/investigations/:id/upload-report - Upload report file
router.post(
  '/:id/upload-report',
  validateParams(idParamSchema),
  upload.single('reportFile'),
  InvestigationController.uploadReport
);

// DELETE /api/investigations/:id - Delete investigation
router.delete(
  '/:id',
  validateParams(idParamSchema),
  InvestigationController.deleteInvestigation
);

export default router; 