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
  status: 'New Requests' | 'In Progress' | 'Under Review' | 'Approved' | 'Revision required';
  priority: 'Emergency' | 'Normal' | 'High';
  totalAmount: number;
  reportFile?: string;
  notes: string;
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