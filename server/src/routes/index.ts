import { Router } from 'express';
import patientRoutes from './patientRoutes';
import doctorRoutes from './doctorRoutes';
import testRoutes from './testRoutes';
import investigationRoutes from './investigationRoutes';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Laboratory Management System API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
router.use('/patients', patientRoutes);
router.use('/doctors', doctorRoutes);
router.use('/tests', testRoutes);
router.use('/investigations', investigationRoutes);

export default router; 