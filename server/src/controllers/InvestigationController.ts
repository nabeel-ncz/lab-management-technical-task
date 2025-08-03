import { Request, Response } from 'express';
import { InvestigationService } from '../services';
import { sendSuccess, sendError, sendServerError } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';
import { InvestigationQuery } from '../schemas/validation';

export class InvestigationController {
  getAllInvestigations = asyncHandler(async (req: Request, res: Response) => {
    try {
      // Parse query parameters for filtering
      const query: InvestigationQuery = {
        status: req.query.status ? (Array.isArray(req.query.status) ? req.query.status as string[] : [req.query.status as string]) : undefined,
        priority: req.query.priority ? (Array.isArray(req.query.priority) ? req.query.priority as string[] : [req.query.priority as string]) : undefined,
        patientId: req.query.patientId as string,
        doctorId: req.query.doctorId as string,
        testId: req.query.testId as string,
        search: req.query.search as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      };

      const investigations = await InvestigationService.getAllInvestigations(query);
      return sendSuccess(res, investigations);
    } catch (error) {
      console.error('Get all investigations error:', error);
      return sendServerError(res, error instanceof Error ? error.message : 'Failed to fetch investigations');
    }
  });

  getInvestigationById = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const investigation = await InvestigationService.getInvestigationById(id);
      
      if (!investigation) {
        return sendError(res, 'Investigation not found', 404);
      }
      
      return sendSuccess(res, investigation);
    } catch (error) {
      console.error('Get investigation by ID error:', error);
      return sendServerError(res, error instanceof Error ? error.message : 'Failed to fetch investigation');
    }
  });

  createInvestigation = asyncHandler(async (req: Request, res: Response) => {
    try {
      const investigation = await InvestigationService.createInvestigation(req.body);
      return sendSuccess(res, investigation, 'Investigation created successfully', 201);
    } catch (error) {
      console.error('Create investigation error:', error);
      if (error instanceof Error && (error.message.includes('not found') || error.message.includes('Patient not found') || error.message.includes('Doctor not found'))) {
        return sendError(res, error.message, 404);
      }
      return sendServerError(res, error instanceof Error ? error.message : 'Failed to create investigation');
    }
  });

  updateInvestigation = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const investigation = await InvestigationService.updateInvestigation(id, req.body);
      return sendSuccess(res, investigation, 'Investigation updated successfully');
    } catch (error) {
      console.error('Update investigation error:', error);
      if (error instanceof Error && error.message.includes('not found')) {
        return sendError(res, error.message, 404);
      }
      return sendServerError(res, error instanceof Error ? error.message : 'Failed to update investigation');
    }
  });

  deleteInvestigation = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await InvestigationService.deleteInvestigation(id);
      return sendSuccess(res, null, 'Investigation deleted successfully');
    } catch (error) {
      console.error('Delete investigation error:', error);
      if (error instanceof Error && error.message.includes('not found')) {
        return sendError(res, error.message, 404);
      }
      return sendServerError(res, error instanceof Error ? error.message : 'Failed to delete investigation');
    }
  });

  // Special endpoint for drag-and-drop functionality (matches frontend moveInvestigation API)
  moveInvestigation = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { newStatus, newIndex } = req.body;

      if (!newStatus || typeof newIndex !== 'number') {
        return sendError(res, 'newStatus and newIndex are required');
      }

      const investigation = await InvestigationService.moveInvestigation(id, {
        newStatus,
        newIndex
      });

      return sendSuccess(res, investigation, 'Investigation moved successfully');
    } catch (error) {
      console.error('Move investigation error:', error);
      if (error instanceof Error && error.message.includes('not found')) {
        return sendError(res, error.message, 404);
      }
      return sendServerError(res, error instanceof Error ? error.message : 'Failed to move investigation');
    }
  });

  // Statistics endpoint for dashboard cards
  getInvestigationStats = asyncHandler(async (req: Request, res: Response) => {
    try {
      const stats = await InvestigationService.getInvestigationStats();
      return sendSuccess(res, stats);
    } catch (error) {
      console.error('Get investigation stats error:', error);
      return sendServerError(res, error instanceof Error ? error.message : 'Failed to fetch investigation statistics');
    }
  });

  // Upload report file endpoint (using multer middleware)
  uploadReport = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const file = req.file;

      if (!file) {
        return sendError(res, 'No file uploaded');
      }

      // This would typically involve uploading to S3 and getting the URL
      // For now, we'll simulate this with a placeholder implementation
      const reportUrl = `https://example-bucket.s3.amazonaws.com/reports/${Date.now()}-${file.originalname}`;

      const investigation = await InvestigationService.updateInvestigation(id, {
        reportFile: reportUrl
      });

      return sendSuccess(res, investigation, 'Report uploaded successfully');
    } catch (error) {
      console.error('Upload report error:', error);
      if (error instanceof Error && error.message.includes('not found')) {
        return sendError(res, error.message, 404);
      }
      return sendServerError(res, error instanceof Error ? error.message : 'Failed to upload report');
    }
  });
}

export default new InvestigationController(); 