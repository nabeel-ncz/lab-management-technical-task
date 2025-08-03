import { z } from 'zod';

export const PatientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().min(1).max(120, 'Age must be between 1 and 120'),
  gender: z.enum(['Male', 'Female', 'Other']),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  emergencyContact: z.string().min(10, 'Emergency contact must be at least 10 digits'),
});

export const DoctorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  specialization: z.string().min(2, 'Specialization is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Invalid email address'),
  hospital: z.string().min(2, 'Hospital name is required'),
  experience: z.number().min(0).max(50, 'Experience must be between 0 and 50 years'),
});

export const TestSchema = z.object({
  name: z.string().min(2, 'Test name is required'),
  category: z.string().min(2, 'Category is required'),
  price: z.number().min(1, 'Price must be greater than 0'),
  normalRange: z.string().min(1, 'Normal range is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  preparationInstructions: z.string().min(5, 'Preparation instructions are required'),
});

export const InvestigationSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  doctorId: z.string().min(1, 'Doctor is required'),
  testIds: z.array(z.string()).min(1, 'At least one test is required'),
  priority: z.enum(['Emergency', 'Normal', 'High']),
  notes: z.string().optional(),
});

export type PatientFormData = z.infer<typeof PatientSchema>;
export type DoctorFormData = z.infer<typeof DoctorSchema>;
export type TestFormData = z.infer<typeof TestSchema>;
export type InvestigationFormData = z.infer<typeof InvestigationSchema>;