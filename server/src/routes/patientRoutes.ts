import { Router } from 'express';
import { PatientController } from '../controllers';
import { validateBody, validateParams } from '../middleware/validation';
import { PatientSchema, PatientUpdateSchema } from '../schemas/validation';
import { z } from 'zod';

const router = Router();

// Parameter validation schema
const idParamSchema = z.object({
  id: z.string().min(1, 'Patient ID is required'),
});

// GET /api/patients - Get all patients
router.get('/', PatientController.getAllPatients);

// GET /api/patients/search?q=searchTerm - Search patients
router.get('/search', PatientController.searchPatients);

// GET /api/patients/:id - Get patient by ID
router.get(
  '/:id',
  validateParams(idParamSchema),
  PatientController.getPatientById
);

// POST /api/patients - Create new patient
router.post(
  '/',
  validateBody(PatientSchema),
  PatientController.createPatient
);

// PUT /api/patients/:id - Update patient
router.put(
  '/:id',
  validateParams(idParamSchema),
  validateBody(PatientUpdateSchema),
  PatientController.updatePatient
);

// DELETE /api/patients/:id - Delete patient
router.delete(
  '/:id',
  validateParams(idParamSchema),
  PatientController.deletePatient
);

export default router; 