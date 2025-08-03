import { Router } from 'express';
import { DoctorController } from '../controllers';
import { validateBody, validateParams } from '../middleware/validation';
import { DoctorSchema, DoctorUpdateSchema } from '../schemas/validation';
import { z } from 'zod';

const router = Router();

// Parameter validation schema
const idParamSchema = z.object({
  id: z.string().min(1, 'Doctor ID is required'),
});

const specializationParamSchema = z.object({
  specialization: z.string().min(1, 'Specialization is required'),
});

// GET /api/doctors - Get all doctors
router.get('/', DoctorController.getAllDoctors);

// GET /api/doctors/search?q=searchTerm - Search doctors
router.get('/search', DoctorController.searchDoctors);

// GET /api/doctors/specialization/:specialization - Get doctors by specialization
router.get(
  '/specialization/:specialization',
  validateParams(specializationParamSchema),
  DoctorController.getDoctorsBySpecialization
);

// GET /api/doctors/:id - Get doctor by ID
router.get(
  '/:id',
  validateParams(idParamSchema),
  DoctorController.getDoctorById
);

// POST /api/doctors - Create new doctor
router.post(
  '/',
  validateBody(DoctorSchema),
  DoctorController.createDoctor
);

// PUT /api/doctors/:id - Update doctor
router.put(
  '/:id',
  validateParams(idParamSchema),
  validateBody(DoctorUpdateSchema),
  DoctorController.updateDoctor
);

// DELETE /api/doctors/:id - Delete doctor
router.delete(
  '/:id',
  validateParams(idParamSchema),
  DoctorController.deleteDoctor
);

export default router; 