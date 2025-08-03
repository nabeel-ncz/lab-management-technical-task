import { Patient, Doctor, Test, Investigation } from '../types';

export const mockPatients: Patient[] = [
  {
    id: 'P001',
    name: 'Michael Brown',
    age: 35,
    gender: 'Male',
    phone: '+91 9876543210',
    email: 'michael.brown@email.com',
    address: '123 Healthcare St, Mumbai',
    emergencyContact: '+91 9876543211',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'P002',
    name: 'Emily Davis',
    age: 28,
    gender: 'Female',
    phone: '+91 9876543212',
    email: 'emily.davis@email.com',
    address: '456 Medical Ave, Delhi',
    emergencyContact: '+91 9876543213',
    createdAt: '2024-01-16T11:45:00Z'
  },
  {
    id: 'P003',
    name: 'David Park',
    age: 42,
    gender: 'Male',
    phone: '+91 9876543214',
    email: 'david.park@email.com',
    address: '789 Health Blvd, Bangalore',
    emergencyContact: '+91 9876543215',
    createdAt: '2024-01-17T09:15:00Z'
  },
  {
    id: 'P004',
    name: 'Sarah Johnson',
    age: 31,
    gender: 'Female',
    phone: '+91 9876543216',
    email: 'sarah.johnson@email.com',
    address: '321 Care St, Chennai',
    emergencyContact: '+91 9876543217',
    createdAt: '2024-01-18T14:20:00Z'
  },
  {
    id: 'P005',
    name: 'John Smith',
    age: 45,
    gender: 'Male',
    phone: '+91 9876543218',
    email: 'john.smith@email.com',
    address: '654 Wellness Rd, Hyderabad',
    emergencyContact: '+91 9876543219',
    createdAt: '2024-01-19T16:30:00Z'
  }
];

export const mockDoctors: Doctor[] = [
  {
    id: 'D001',
    name: 'Dr. Lisa Thompson',
    specialization: 'Endocrinology',
    phone: '+91 9876540001',
    email: 'lisa.thompson@hospital.com',
    hospital: 'City General Hospital',
    experience: 12,
    createdAt: '2024-01-10T08:00:00Z'
  },
  {
    id: 'D002',
    name: 'Dr. James Rodriguez',
    specialization: 'Cardiology',
    phone: '+91 9876540002',
    email: 'james.rodriguez@hospital.com',
    hospital: 'Metro Medical Center',
    experience: 8,
    createdAt: '2024-01-11T09:30:00Z'
  },
  {
    id: 'D003',
    name: 'Dr. Amanda Chen',
    specialization: 'Pathology',
    phone: '+91 9876540003',
    email: 'amanda.chen@hospital.com',
    hospital: 'Advanced Diagnostics',
    experience: 15,
    createdAt: '2024-01-12T10:45:00Z'
  },
  {
    id: 'D004',
    name: 'Dr. Maria Garcia',
    specialization: 'Internal Medicine',
    phone: '+91 9876540004',
    email: 'maria.garcia@hospital.com',
    hospital: 'Community Health Center',
    experience: 10,
    createdAt: '2024-01-13T11:20:00Z'
  },
  {
    id: 'D005',
    name: 'Dr. David Park',
    specialization: 'Nephrology',
    phone: '+91 9876540005',
    email: 'david.park@hospital.com',
    hospital: 'Specialty Medical Group',
    experience: 18,
    createdAt: '2024-01-14T12:15:00Z'
  }
];

export const mockTests: Test[] = [
  {
    id: 'T001',
    name: 'Thyroid Function Test',
    category: 'Endocrinology',
    price: 1200,
    normalRange: 'TSH: 0.4-4.0 mIU/L, T3: 80-200 ng/dL, T4: 5.0-12.0 μg/dL',
    description: 'Comprehensive thyroid function assessment including TSH, T3, and T4 levels',
    preparationInstructions: 'No special preparation required. Can be done at any time.',
    createdAt: '2024-01-05T00:00:00Z'
  },
  {
    id: 'T002',
    name: 'Liver Function Test',
    category: 'Hepatology',
    price: 800,
    normalRange: 'ALT: 7-56 U/L, AST: 10-40 U/L, Bilirubin: 0.2-1.2 mg/dL',
    description: 'Assessment of liver enzymes and function',
    preparationInstructions: 'Fasting for 8-12 hours recommended',
    createdAt: '2024-01-06T00:00:00Z'
  },
  {
    id: 'T003',
    name: 'Complete Blood Count',
    category: 'Hematology',
    price: 500,
    normalRange: 'WBC: 4.5-11.0 x10³/μL, RBC: 4.5-5.5 x10⁶/μL, Platelets: 150-450 x10³/μL',
    description: 'Comprehensive blood cell analysis',
    preparationInstructions: 'No special preparation required',
    createdAt: '2024-01-07T00:00:00Z'
  },
  {
    id: 'T004',
    name: 'Kidney Function Test',
    category: 'Nephrology',
    price: 600,
    normalRange: 'Creatinine: 0.6-1.2 mg/dL, BUN: 7-20 mg/dL',
    description: 'Assessment of kidney function and health',
    preparationInstructions: 'Normal water intake, avoid excessive protein before test',
    createdAt: '2024-01-08T00:00:00Z'
  },
  {
    id: 'T005',
    name: 'Lipid Profile',
    category: 'Cardiology',
    price: 700,
    normalRange: 'Total Cholesterol: <200 mg/dL, LDL: <100 mg/dL, HDL: >40 mg/dL',
    description: 'Comprehensive cholesterol and lipid analysis',
    preparationInstructions: 'Fasting for 9-12 hours required',
    createdAt: '2024-01-09T00:00:00Z'
  },
  {
    id: 'T006',
    name: 'Blood Sugar Test',
    category: 'Endocrinology',
    price: 300,
    normalRange: 'Fasting: 70-100 mg/dL, Random: <140 mg/dL',
    description: 'Blood glucose level assessment',
    preparationInstructions: 'Fasting for 8 hours for fasting glucose test',
    createdAt: '2024-01-10T00:00:00Z'
  }
];

export const mockInvestigations: Investigation[] = [
  {
    id: 'MHN001236',
    patientId: 'P001',
    doctorId: 'D001',
    testIds: ['T001'],
    status: 'New Requests',
    priority: 'Normal',
    totalAmount: 1200,
    notes: 'Routine thyroid check-up',
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-20T10:30:00Z'
  },
  {
    id: 'MHN001238',
    patientId: 'P002',
    doctorId: 'D002',
    testIds: ['T002'],
    status: 'New Requests',
    priority: 'Normal',
    totalAmount: 800,
    notes: 'Follow-up liver function assessment',
    createdAt: '2024-01-20T11:45:00Z',
    updatedAt: '2024-01-20T11:45:00Z'
  },
  {
    id: 'MHN001234',
    patientId: 'P003',
    doctorId: 'D003',
    testIds: ['T004'],
    status: 'New Requests',
    priority: 'Emergency',
    totalAmount: 600,
    notes: 'Urgent kidney function check',
    createdAt: '2024-01-20T12:15:00Z',
    updatedAt: '2024-01-20T12:15:00Z'
  },
  {
    id: 'QC-001',
    patientId: 'P004',
    doctorId: 'D004',
    testIds: ['T003', 'T005'],
    status: 'New Requests',
    priority: 'Normal',
    totalAmount: 1200,
    notes: 'Complete health check-up',
    createdAt: '2024-01-20T13:30:00Z',
    updatedAt: '2024-01-20T13:30:00Z'
  },
  {
    id: 'MHN001237',
    patientId: 'P001',
    doctorId: 'D002',
    testIds: ['T003'],
    status: 'In Progress',
    priority: 'Emergency',
    totalAmount: 500,
    notes: 'Blood work in progress',
    createdAt: '2024-01-19T09:00:00Z',
    updatedAt: '2024-01-20T14:00:00Z'
  },
  {
    id: 'MHN001239',
    patientId: 'P002',
    doctorId: 'D003',
    testIds: ['T005'],
    status: 'In Progress',
    priority: 'Normal',
    totalAmount: 700,
    notes: 'Lipid profile analysis',
    createdAt: '2024-01-19T10:30:00Z',
    updatedAt: '2024-01-20T15:30:00Z'
  },
  {
    id: 'MHN001235',
    patientId: 'P003',
    doctorId: 'D001',
    testIds: ['T006'],
    status: 'In Progress',
    priority: 'High',
    totalAmount: 300,
    notes: 'Diabetes monitoring',
    createdAt: '2024-01-19T11:15:00Z',
    updatedAt: '2024-01-20T16:15:00Z'
  },
  {
    id: 'QC-002',
    patientId: 'P004',
    doctorId: 'D005',
    testIds: ['T004', 'T006'],
    status: 'In Progress',
    priority: 'Normal',
    totalAmount: 900,
    notes: 'Kidney and glucose assessment',
    createdAt: '2024-01-19T12:00:00Z',
    updatedAt: '2024-01-20T17:00:00Z'
  },
  {
    id: 'MHN001240',
    patientId: 'P005',
    doctorId: 'D001',
    testIds: ['T001', 'T002'],
    status: 'Under Review',
    priority: 'High',
    totalAmount: 2000,
    notes: 'Comprehensive endocrine panel',
    createdAt: '2024-01-18T08:30:00Z',
    updatedAt: '2024-01-20T18:00:00Z'
  },
  {
    id: 'MHN001241',
    patientId: 'P001',
    doctorId: 'D004',
    testIds: ['T003'],
    status: 'Under Review',
    priority: 'Normal',
    totalAmount: 500,
    notes: 'CBC review pending',
    createdAt: '2024-01-18T09:45:00Z',
    updatedAt: '2024-01-20T19:00:00Z'
  },
  {
    id: 'MHN001242',
    patientId: 'P002',
    doctorId: 'D005',
    testIds: ['T004'],
    status: 'Under Review',
    priority: 'Normal',
    totalAmount: 600,
    notes: 'Kidney function review',
    createdAt: '2024-01-18T10:20:00Z',
    updatedAt: '2024-01-20T20:00:00Z'
  },
  {
    id: 'MHN001243',
    patientId: 'P003',
    doctorId: 'D002',
    testIds: ['T005'],
    status: 'Approved',
    priority: 'Normal',
    totalAmount: 700,
    notes: 'Lipid profile approved',
    createdAt: '2024-01-17T11:30:00Z',
    updatedAt: '2024-01-20T21:00:00Z'
  },
  {
    id: 'MHN001244',
    patientId: 'P004',
    doctorId: 'D003',
    testIds: ['T006'],
    status: 'Approved',
    priority: 'Normal',
    totalAmount: 300,
    notes: 'Blood sugar test completed',
    createdAt: '2024-01-17T12:15:00Z',
    updatedAt: '2024-01-20T22:00:00Z'
  },
  {
    id: 'MHN001245',
    patientId: 'P005',
    doctorId: 'D001',
    testIds: ['T002'],
    status: 'Revision required',
    priority: 'High',
    totalAmount: 800,
    notes: 'Liver function needs retest',
    createdAt: '2024-01-16T13:00:00Z',
    updatedAt: '2024-01-20T23:00:00Z'
  },
  {
    id: 'MHN001246',
    patientId: 'P001',
    doctorId: 'D004',
    testIds: ['T003'],
    status: 'Revision required',
    priority: 'Normal',
    totalAmount: 500,
    notes: 'Sample quality issues',
    createdAt: '2024-01-16T14:30:00Z',
    updatedAt: '2024-01-20T23:30:00Z'
  }
];