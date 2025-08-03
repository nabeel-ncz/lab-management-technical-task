import axios from 'axios';
import { Patient, Doctor, Test, Investigation } from '../types';
import { mockPatients, mockDoctors, mockTests, mockInvestigations } from '../data/mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockApi {
  private patients: Patient[] = [...mockPatients];
  private doctors: Doctor[] = [...mockDoctors];
  private tests: Test[] = [...mockTests];
  private investigations: Investigation[] = [...mockInvestigations];

  async getPatients(): Promise<Patient[]> {
    await delay(300);
    return this.patients;
  }

  async getPatient(id: string): Promise<Patient | null> {
    await delay(200);
    return this.patients.find(p => p.id === id) || null;
  }

  async createPatient(patient: Omit<Patient, 'id' | 'createdAt'>): Promise<Patient> {
    await delay(400);
    const newPatient: Patient = {
      ...patient,
      id: `P${String(this.patients.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString()
    };
    this.patients.push(newPatient);
    return newPatient;
  }

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient> {
    await delay(400);
    const index = this.patients.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Patient not found');
    
    this.patients[index] = { ...this.patients[index], ...updates };
    return this.patients[index];
  }

  async getDoctors(): Promise<Doctor[]> {
    await delay(300);
    return this.doctors;
  }

  async getDoctor(id: string): Promise<Doctor | null> {
    await delay(200);
    return this.doctors.find(d => d.id === id) || null;
  }

  async createDoctor(doctor: Omit<Doctor, 'id' | 'createdAt'>): Promise<Doctor> {
    await delay(400);
    const newDoctor: Doctor = {
      ...doctor,
      id: `D${String(this.doctors.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString()
    };
    this.doctors.push(newDoctor);
    return newDoctor;
  }

  async updateDoctor(id: string, updates: Partial<Doctor>): Promise<Doctor> {
    await delay(400);
    const index = this.doctors.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Doctor not found');
    
    this.doctors[index] = { ...this.doctors[index], ...updates };
    return this.doctors[index];
  }

  async getTests(): Promise<Test[]> {
    await delay(300);
    return this.tests;
  }

  async getTest(id: string): Promise<Test | null> {
    await delay(200);
    return this.tests.find(t => t.id === id) || null;
  }

  async createTest(test: Omit<Test, 'id' | 'createdAt'>): Promise<Test> {
    await delay(400);
    const newTest: Test = {
      ...test,
      id: `T${String(this.tests.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString()
    };
    this.tests.push(newTest);
    return newTest;
  }

  async updateTest(id: string, updates: Partial<Test>): Promise<Test> {
    await delay(400);
    const index = this.tests.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Test not found');
    
    this.tests[index] = { ...this.tests[index], ...updates };
    return this.tests[index];
  }

  async getInvestigations(): Promise<Investigation[]> {
    await delay(400);
    // Populate related data
    return this.investigations.map(inv => ({
      ...inv,
      patient: this.patients.find(p => p.id === inv.patientId),
      doctor: this.doctors.find(d => d.id === inv.doctorId),
      tests: this.tests.filter(t => inv.testIds.includes(t.id))
    }));
  }

  async getInvestigation(id: string): Promise<Investigation | null> {
    await delay(300);
    const investigation = this.investigations.find(i => i.id === id);
    if (!investigation) return null;

    return {
      ...investigation,
      patient: this.patients.find(p => p.id === investigation.patientId),
      doctor: this.doctors.find(d => d.id === investigation.doctorId),
      tests: this.tests.filter(t => investigation.testIds.includes(t.id))
    };
  }

  async createInvestigation(investigation: Omit<Investigation, 'id' | 'createdAt' | 'updatedAt' | 'totalAmount' | 'order'>): Promise<Investigation> {
    await delay(500);
    
    const tests = this.tests.filter(t => investigation.testIds.includes(t.id));
    const totalAmount = tests.reduce((sum, test) => sum + test.price, 0);
    
    // Calculate next order for the status
    const existingInvestigationsInStatus = this.investigations.filter(inv => inv.status === investigation.status);
    const maxOrder = existingInvestigationsInStatus.length > 0 
      ? Math.max(...existingInvestigationsInStatus.map(inv => inv.order || 0))
      : 0;
    
    const newInvestigation: Investigation = {
      ...investigation,
      id: `MHN${String(this.investigations.length + 1000).padStart(6, '0')}`,
      totalAmount,
      order: maxOrder + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.investigations.push(newInvestigation);
    
    return {
      ...newInvestigation,
      patient: this.patients.find(p => p.id === newInvestigation.patientId),
      doctor: this.doctors.find(d => d.id === newInvestigation.doctorId),
      tests: this.tests.filter(t => newInvestigation.testIds.includes(t.id))
    };
  }

  async updateInvestigation(id: string, updates: Partial<Investigation>): Promise<Investigation> {
    await delay(400);
    const index = this.investigations.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Investigation not found');
    
    this.investigations[index] = { 
      ...this.investigations[index], 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    const investigation = this.investigations[index];
    
    return {
      ...investigation,
      patient: this.patients.find(p => p.id === investigation.patientId),
      doctor: this.doctors.find(d => d.id === investigation.doctorId),
      tests: this.tests.filter(t => investigation.testIds.includes(t.id))
    };
  }

  async moveInvestigation(investigationId: string, newStatus: string, newIndex: number): Promise<Investigation> {
    await delay(200);
    const index = this.investigations.findIndex(i => i.id === investigationId);
    if (index === -1) throw new Error('Investigation not found');
    
    // Map column IDs to status strings
    const statusMap: Record<string, Investigation['status']> = {
      'advised': 'Advised',
      'billing': 'Billing',
      'new-investigations': 'New Investigations',
      'in-progress': 'In Progress',
      'under-review': 'Under Review',
      'approved': 'Approved',
      'revision-required': 'Revision Required'
    };
    
    const status = statusMap[newStatus] || newStatus as Investigation['status'];
    const currentInvestigation = this.investigations[index];
    const oldStatus = currentInvestigation.status;
    
    // Get all investigations in the target status
    const targetStatusInvestigations = this.investigations
      .filter(inv => inv.id !== investigationId && inv.status === status)
      .sort((a, b) => a.order - b.order);
    
    // Calculate new order based on position
    let newOrder: number;
    
    if (targetStatusInvestigations.length === 0) {
      // First item in the status
      newOrder = 1;
    } else if (newIndex === 0) {
      // Insert at the beginning
      newOrder = targetStatusInvestigations[0].order - 1;
    } else if (newIndex >= targetStatusInvestigations.length) {
      // Insert at the end
      newOrder = targetStatusInvestigations[targetStatusInvestigations.length - 1].order + 1;
    } else {
      // Insert between two items
      const prevOrder = targetStatusInvestigations[newIndex - 1].order;
      const nextOrder = targetStatusInvestigations[newIndex].order;
      newOrder = (prevOrder + nextOrder) / 2;
    }
    
    // Update the moved investigation
    this.investigations[index] = { 
      ...this.investigations[index], 
      status,
      order: newOrder,
      updatedAt: new Date().toISOString()
    };
    
    // If status changed, reorder investigations in the old status
    if (oldStatus !== status) {
      const oldStatusInvestigations = this.investigations
        .filter(inv => inv.status === oldStatus)
        .sort((a, b) => a.order - b.order);
      
      // Reassign order values sequentially for the old status
      oldStatusInvestigations.forEach((inv, idx) => {
        const invIndex = this.investigations.findIndex(i => i.id === inv.id);
        if (invIndex !== -1) {
          this.investigations[invIndex] = {
            ...this.investigations[invIndex],
            order: idx + 1,
            updatedAt: new Date().toISOString()
          };
        }
      });
    }
    
    const investigation = this.investigations[index];
    
    return {
      ...investigation,
      patient: this.patients.find(p => p.id === investigation.patientId),
      doctor: this.doctors.find(d => d.id === investigation.doctorId),
      tests: this.tests.filter(t => investigation.testIds.includes(t.id))
    };
  }
}

export const api = new MockApi();