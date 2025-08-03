export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  phone: string;
  email: string;
  hospital: string;
  experience: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Test {
  id: string;
  name: string;
  category: string;
  price: number;
  normalRange: string;
  description: string;
  preparationInstructions: string;
  createdAt: Date;
  updatedAt?: Date;
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
  order: number;
  createdAt: Date;
  updatedAt: Date;
  // Populated fields for API responses
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

// Request/Response types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Query types
export interface InvestigationQuery {
  status?: string[];
  priority?: string[];
  patientId?: string;
  doctorId?: string;
  testId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface MoveInvestigationRequest {
  newStatus: string;
  newIndex: number;
} 