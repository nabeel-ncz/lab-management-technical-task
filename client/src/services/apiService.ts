import httpClient from './httpClient';
import { Patient, Doctor, Test, Investigation } from '../types';

type CreatePatientRequest = Omit<Patient, 'id' | 'createdAt'>;
type CreateDoctorRequest = Omit<Doctor, 'id' | 'createdAt'>;
type CreateTestRequest = Omit<Test, 'id' | 'createdAt'>;
type CreateInvestigationRequest = Omit<Investigation, 'id' | 'createdAt' | 'updatedAt' | 'totalAmount' | 'order' | 'patient' | 'doctor' | 'tests'>;

export class ApiService {
  async getPatients(): Promise<Patient[]> {
    return httpClient.get('/patients');
  }

  async getPatient(id: string): Promise<Patient | null> {
    try {
      return await httpClient.get(`/patients/${id}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async createPatient(patient: CreatePatientRequest): Promise<Patient> {
    return httpClient.post('/patients', patient);
  }

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient> {
    return httpClient.put(`/patients/${id}`, updates);
  }

  async deletePatient(id: string): Promise<void> {
    return httpClient.delete(`/patients/${id}`);
  }

  async searchPatients(query: string): Promise<Patient[]> {
    return httpClient.get(`/patients/search?q=${encodeURIComponent(query)}`);
  }

  // Doctor APIs
  async getDoctors(): Promise<Doctor[]> {
    return httpClient.get('/doctors');
  }

  async getDoctor(id: string): Promise<Doctor | null> {
    try {
      return await httpClient.get(`/doctors/${id}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async createDoctor(doctor: CreateDoctorRequest): Promise<Doctor> {
    return httpClient.post('/doctors', doctor);
  }

  async updateDoctor(id: string, updates: Partial<Doctor>): Promise<Doctor> {
    return httpClient.put(`/doctors/${id}`, updates);
  }

  async deleteDoctor(id: string): Promise<void> {
    return httpClient.delete(`/doctors/${id}`);
  }

  async searchDoctors(query: string): Promise<Doctor[]> {
    return httpClient.get(`/doctors/search?q=${encodeURIComponent(query)}`);
  }

  async getDoctorsBySpecialization(specialization: string): Promise<Doctor[]> {
    return httpClient.get(`/doctors/specialization/${encodeURIComponent(specialization)}`);
  }

  // Test APIs
  async getTests(): Promise<Test[]> {
    return httpClient.get('/tests');
  }

  async getTest(id: string): Promise<Test | null> {
    try {
      return await httpClient.get(`/tests/${id}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async createTest(test: CreateTestRequest): Promise<Test> {
    return httpClient.post('/tests', test);
  }

  async updateTest(id: string, updates: Partial<Test>): Promise<Test> {
    return httpClient.put(`/tests/${id}`, updates);
  }

  async deleteTest(id: string): Promise<void> {
    return httpClient.delete(`/tests/${id}`);
  }

  async searchTests(query: string): Promise<Test[]> {
    return httpClient.get(`/tests/search?q=${encodeURIComponent(query)}`);
  }

  async getTestCategories(): Promise<string[]> {
    return httpClient.get('/tests/categories');
  }

  async getTestsByCategory(category: string): Promise<Test[]> {
    return httpClient.get(`/tests/category/${encodeURIComponent(category)}`);
  }

  // Investigation APIs
  async getInvestigations(filters?: {
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
  }): Promise<Investigation[]> {
    const params = new URLSearchParams();

    if (filters) {
      // Handle array parameters
      if (filters.status?.length) {
        filters.status.forEach(s => params.append('status', s));
      }
      if (filters.priority?.length) {
        filters.priority.forEach(p => params.append('priority', p));
      }

      // Handle single parameters
      if (filters.patientId) params.append('patientId', filters.patientId);
      if (filters.doctorId) params.append('doctorId', filters.doctorId);
      if (filters.testId) params.append('testId', filters.testId);
      if (filters.search) params.append('search', filters.search);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
    }

    const queryString = params.toString();
    const url = queryString ? `/investigations?${queryString}` : '/investigations';
    
    return httpClient.get(url);
  }

  async getInvestigation(id: string): Promise<Investigation | null> {
    try {
      return await httpClient.get(`/investigations/${id}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async createInvestigation(investigation: CreateInvestigationRequest): Promise<Investigation> {
    return httpClient.post('/investigations', investigation);
  }

  async updateInvestigation(id: string, updates: Partial<Investigation>): Promise<Investigation> {
    return httpClient.put(`/investigations/${id}`, updates);
  }

  async deleteInvestigation(id: string): Promise<void> {
    return httpClient.delete(`/investigations/${id}`);
  }

  async moveInvestigation(investigationId: string, newStatus: string, newIndex: number): Promise<Investigation> {
    // Map column IDs to status strings (same mapping as MockApi)
    const statusMap: Record<string, Investigation['status']> = {
      'advised': 'Advised',
      'billing': 'Billing',
      'new-investigations': 'New Investigations',
      'in-progress': 'In Progress',
      'under-review': 'Under Review',
      'approved': 'Approved',
      'revision-required': 'Revision Required'
    };
    
    const mappedStatus = statusMap[newStatus] || newStatus as Investigation['status'];
    
    return httpClient.post(`/investigations/${investigationId}/move`, {
      newStatus: mappedStatus,
      newIndex
    });
  }

  async uploadInvestigationReport(id: string, file: File): Promise<Investigation> {
    const formData = new FormData();
    formData.append('reportFile', file);
    
    return httpClient.post(`/investigations/${id}/upload-report`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  async getInvestigationStats(): Promise<{
    totalInvestigations: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    totalRevenue: number;
    avgAmount: number;
  }> {
    return httpClient.get('/investigations/stats');
  }

  // Health check
  async healthCheck(): Promise<{
    success: boolean;
    message: string;
    timestamp: string;
    version: string;
  }> {
    return httpClient.get('/health');
  }
}

// Create and export singleton instance
export const apiService = new ApiService(); 