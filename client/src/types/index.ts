export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  createdAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  phone: string;
  email: string;
  hospital: string;
  experience: number;
  createdAt: string;
}

export interface Test {
  id: string;
  name: string;
  category: string;
  price: number;
  normalRange: string;
  description: string;
  preparationInstructions: string;
  createdAt: string;
}

export interface Investigation {
  id: string;
  patientId: string;
  doctorId: string;
  testIds: string[];
  status: 'Advised' | 'Billing' | 'New Investigations' | 'In Progress' | 'Under Review' | 'Approved' | 'Revision Required';
  priority: 'Emergency' | 'Normal' | 'High';
  totalAmount: number;
  reportFile?: string;
  notes: string;
  order: number; // For ordering within status columns
  createdAt: string;
  updatedAt: string;
  patient?: Patient;
  doctor?: Doctor;
  tests?: Test[];
}

export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  bgColor: string;
  investigations: Investigation[];
  count: number;
  totalAmount: number;
}