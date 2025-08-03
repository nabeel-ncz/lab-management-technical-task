import { Request, Response } from 'express';
import { PatientService } from '../services';
import { sendSuccess, sendError, sendServerError } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';

export class PatientController {
  getAllPatients = asyncHandler(async (req: Request, res: Response) => {
    try {
      const patients = await PatientService.getAllPatients();
      return sendSuccess(res, patients);
    } catch (error) {
      console.error('Get all patients error:', error);
      return sendServerError(res, error instanceof Error ? error.message : 'Failed to fetch patients');
    }
  });

  getPatientById = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const patient = await PatientService.getPatientById(id);
      
      if (!patient) {
        return sendError(res, 'Patient not found', 404);
      }
      
      return sendSuccess(res, patient);
    } catch (error) {
      console.error('Get patient by ID error:', error);
      return sendServerError(res, error instanceof Error ? error.message : 'Failed to fetch patient');
    }
  });

  createPatient = asyncHandler(async (req: Request, res: Response) => {
    try {
      const patient = await PatientService.createPatient(req.body);
      return sendSuccess(res, patient, 'Patient created successfully', 201);
    } catch (error) {
      console.error('Create patient error:', error);
      if (error instanceof Error && error.message.includes('already exists')) {
        return sendError(res, error.message, 409);
      }
      return sendServerError(res, error instanceof Error ? error.message : 'Failed to create patient');
    }
  });

  updatePatient = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const patient = await PatientService.updatePatient(id, req.body);
      return sendSuccess(res, patient, 'Patient updated successfully');
    } catch (error) {
      console.error('Update patient error:', error);
      if (error instanceof Error && error.message.includes('not found')) {
        return sendError(res, error.message, 404);
      }
      if (error instanceof Error && error.message.includes('already exists')) {
        return sendError(res, error.message, 409);
      }
      return sendServerError(res, error instanceof Error ? error.message : 'Failed to update patient');
    }
  });

  deletePatient = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await PatientService.deletePatient(id);
      return sendSuccess(res, null, 'Patient deleted successfully');
    } catch (error) {
      console.error('Delete patient error:', error);
      if (error instanceof Error && error.message.includes('not found')) {
        return sendError(res, error.message, 404);
      }
      return sendServerError(res, error instanceof Error ? error.message : 'Failed to delete patient');
    }
  });

  searchPatients = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return sendError(res, 'Search query is required');
      }
      
      const patients = await PatientService.searchPatients(q);
      return sendSuccess(res, patients);
    } catch (error) {
      console.error('Search patients error:', error);
      return sendServerError(res, error instanceof Error ? error.message : 'Failed to search patients');
    }
  });
}

export default new PatientController(); 