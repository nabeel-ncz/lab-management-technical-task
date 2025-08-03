import { Request, Response } from 'express';
import { DoctorService } from '../services';
import { sendSuccess, sendError, sendServerError } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';

export class DoctorController {
  getAllDoctors = asyncHandler(async (req: Request, res: Response) => {
    try {
      const doctors = await DoctorService.getAllDoctors();
      return sendSuccess(res, doctors);
    } catch (error) {
      console.error('Get all doctors error:', error);
      return sendServerError(res, error instanceof Error ? error.message : 'Failed to fetch doctors');
    }
  });

  getDoctorById = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const doctor = await DoctorService.getDoctorById(id);
      
      if (!doctor) {
        return sendError(res, 'Doctor not found', 404);
      }
      
      return sendSuccess(res, doctor);
    } catch (error) {
      console.error('Get doctor by ID error:', error);
      return sendServerError(res, error instanceof Error ? error.message : 'Failed to fetch doctor');
    }
  });

  createDoctor = asyncHandler(async (req: Request, res: Response) => {
    try {
      const doctor = await DoctorService.createDoctor(req.body);
      return sendSuccess(res, doctor, 'Doctor created successfully', 201);
    } catch (error) {
      console.error('Create doctor error:', error);
      if (error instanceof Error && error.message.includes('already exists')) {
        return sendError(res, error.message, 409);
      }
      return sendServerError(res, error instanceof Error ? error.message : 'Failed to create doctor');
    }
  });

  updateDoctor = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const doctor = await DoctorService.updateDoctor(id, req.body);
      return sendSuccess(res, doctor, 'Doctor updated successfully');
    } catch (error) {
      console.error('Update doctor error:', error);
      if (error instanceof Error && error.message.includes('not found')) {
        return sendError(res, error.message, 404);
      }
      if (error instanceof Error && error.message.includes('already exists')) {
        return sendError(res, error.message, 409);
      }
      return sendServerError(res, error instanceof Error ? error.message : 'Failed to update doctor');
    }
  });

  deleteDoctor = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await DoctorService.deleteDoctor(id);
      return sendSuccess(res, null, 'Doctor deleted successfully');
    } catch (error) {
      console.error('Delete doctor error:', error);
      if (error instanceof Error && error.message.includes('not found')) {
        return sendError(res, error.message, 404);
      }
      return sendServerError(res, error instanceof Error ? error.message : 'Failed to delete doctor');
    }
  });

  searchDoctors = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return sendError(res, 'Search query is required');
      }
      
      const doctors = await DoctorService.searchDoctors(q);
      return sendSuccess(res, doctors);
    } catch (error) {
      console.error('Search doctors error:', error);
      return sendServerError(res, error instanceof Error ? error.message : 'Failed to search doctors');
    }
  });

  getDoctorsBySpecialization = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { specialization } = req.params;
      const doctors = await DoctorService.getDoctorsBySpecialization(specialization);
      return sendSuccess(res, doctors);
    } catch (error) {
      console.error('Get doctors by specialization error:', error);
      return sendServerError(res, error instanceof Error ? error.message : 'Failed to fetch doctors by specialization');
    }
  });
}

export default new DoctorController(); 