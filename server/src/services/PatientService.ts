import { Patient } from '../models';
import { PatientInput, PatientUpdateInput } from '../schemas/validation';
import { Patient as PatientType } from '../types';

export class PatientService {
  async getAllPatients(): Promise<PatientType[]> {
    try {
      const patients = await Patient.find().sort({ createdAt: -1 });
      return patients.map(patient => patient.toJSON());
    } catch (error) {
      throw new Error(`Failed to fetch patients: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getPatientById(id: string): Promise<PatientType | null> {
    try {
      const patient = await Patient.findById(id);
      return patient ? patient.toJSON() : null;
    } catch (error) {
      throw new Error(`Failed to fetch patient: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createPatient(patientData: PatientInput): Promise<PatientType> {
    try {
      const patient = new Patient(patientData);
      const savedPatient = await patient.save();
      return savedPatient.toJSON();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error('Patient with this email already exists');
      }
      throw new Error(`Failed to create patient: ${error.message || 'Unknown error'}`);
    }
  }

  async updatePatient(id: string, updateData: PatientUpdateInput): Promise<PatientType> {
    try {
      const patient = await Patient.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { 
          new: true, 
          runValidators: true 
        }
      );

      if (!patient) {
        throw new Error('Patient not found');
      }

      return patient.toJSON();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error('Patient with this email already exists');
      }
      throw new Error(`Failed to update patient: ${error.message || 'Unknown error'}`);
    }
  }

  async deletePatient(id: string): Promise<void> {
    try {
      const patient = await Patient.findByIdAndDelete(id);
      if (!patient) {
        throw new Error('Patient not found');
      }
    } catch (error) {
      throw new Error(`Failed to delete patient: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async searchPatients(searchTerm: string): Promise<PatientType[]> {
    try {
      const patients = await Patient.find({
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } },
          { phone: { $regex: searchTerm, $options: 'i' } }
        ]
      }).sort({ createdAt: -1 });

      return patients.map(patient => patient.toJSON());
    } catch (error) {
      throw new Error(`Failed to search patients: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export default new PatientService(); 