import { z } from 'zod';

// Patient schema
export const PatientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().min(1).max(120, 'Age must be between 1 and 120'),
  gender: z.enum(['Male', 'Female', 'Other']),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  emergencyContact: z.string().min(10, 'Emergency contact must be at least 10 digits'),
});

// Doctor schema
export const DoctorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  specialization: z.string().min(2, 'Specialization is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Invalid email address'),
  hospital: z.string().min(2, 'Hospital name is required'),
  experience: z.number().min(0).max(50, 'Experience must be between 0 and 50 years'),
});

// Test schema
export const TestSchema = z.object({
  name: z.string().min(2, 'Test name is required'),
  category: z.string().min(2, 'Category is required'),
  price: z.number().min(1, 'Price must be greater than 0'),
  normalRange: z.string().min(1, 'Normal range is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  preparationInstructions: z.string().min(5, 'Preparation instructions are required'),
});

// Investigation schema
export const InvestigationSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  doctorId: z.string().min(1, 'Doctor is required'),
  testIds: z.array(z.string()).min(1, 'At least one test is required'),
  priority: z.enum(['Emergency', 'Normal', 'High']),
  notes: z.string().optional().default(''),
  totalAmount: z.number().optional(),
  order: z.number().optional()
});

// Update schemas (partial)
export const PatientUpdateSchema = PatientSchema.partial();
export const DoctorUpdateSchema = DoctorSchema.partial();
export const TestUpdateSchema = TestSchema.partial();
export const InvestigationUpdateSchema = z.object({
  patientId: z.string().optional(),
  doctorId: z.string().optional(),
  testIds: z.array(z.string()).optional(),
  status: z.enum(['Advised', 'Billing', 'New Investigations', 'In Progress', 'Under Review', 'Approved', 'Revision Required']).optional(),
  priority: z.enum(['Emergency', 'Normal', 'High']).optional(),
  notes: z.string().optional(),
  reportFile: z.string().optional(),
});

// Move investigation schema
export const MoveInvestigationSchema = z.object({
  newStatus: z.string().min(1, 'New status is required'),
  newIndex: z.number().min(0, 'Index must be non-negative'),
});

// Query schemas
export const InvestigationQuerySchema = z.object({
  status: z.array(z.string()).optional(),
  priority: z.array(z.string()).optional(),
  patientId: z.string().optional(),
  doctorId: z.string().optional(),
  testId: z.string().optional(),
  search: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

// Type inference
export type PatientInput = z.infer<typeof PatientSchema>;
export type DoctorInput = z.infer<typeof DoctorSchema>;
export type TestInput = z.infer<typeof TestSchema>;
export type InvestigationInput = z.infer<typeof InvestigationSchema>;
export type PatientUpdateInput = z.infer<typeof PatientUpdateSchema>;
export type DoctorUpdateInput = z.infer<typeof DoctorUpdateSchema>;
export type TestUpdateInput = z.infer<typeof TestUpdateSchema>;
export type InvestigationUpdateInput = z.infer<typeof InvestigationUpdateSchema>;
export type MoveInvestigationInput = z.infer<typeof MoveInvestigationSchema>;
export type InvestigationQuery = z.infer<typeof InvestigationQuerySchema>; 