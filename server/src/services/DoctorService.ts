import { Doctor } from '../models';
import { DoctorInput, DoctorUpdateInput } from '../schemas/validation';
import { Doctor as DoctorType } from '../types';

export class DoctorService {
  async getAllDoctors(): Promise<DoctorType[]> {
    try {
      const doctors = await Doctor.find().sort({ createdAt: -1 });
      return doctors.map(doctor => doctor.toJSON());
    } catch (error) {
      throw new Error(`Failed to fetch doctors: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getDoctorById(id: string): Promise<DoctorType | null> {
    try {
      const doctor = await Doctor.findById(id);
      return doctor ? doctor.toJSON() : null;
    } catch (error) {
      throw new Error(`Failed to fetch doctor: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createDoctor(doctorData: DoctorInput): Promise<DoctorType> {
    try {
      const doctor = new Doctor(doctorData);
      const savedDoctor = await doctor.save();
      return savedDoctor.toJSON();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error('Doctor with this email already exists');
      }
      throw new Error(`Failed to create doctor: ${error.message || 'Unknown error'}`);
    }
  }

  async updateDoctor(id: string, updateData: DoctorUpdateInput): Promise<DoctorType> {
    try {
      const doctor = await Doctor.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { 
          new: true, 
          runValidators: true 
        }
      );

      if (!doctor) {
        throw new Error('Doctor not found');
      }

      return doctor.toJSON();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error('Doctor with this email already exists');
      }
      throw new Error(`Failed to update doctor: ${error.message || 'Unknown error'}`);
    }
  }

  async deleteDoctor(id: string): Promise<void> {
    try {
      const doctor = await Doctor.findByIdAndDelete(id);
      if (!doctor) {
        throw new Error('Doctor not found');
      }
    } catch (error) {
      throw new Error(`Failed to delete doctor: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async searchDoctors(searchTerm: string): Promise<DoctorType[]> {
    try {
      const doctors = await Doctor.find({
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { specialization: { $regex: searchTerm, $options: 'i' } },
          { hospital: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } }
        ]
      }).sort({ createdAt: -1 });

      return doctors.map(doctor => doctor.toJSON());
    } catch (error) {
      throw new Error(`Failed to search doctors: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getDoctorsBySpecialization(specialization: string): Promise<DoctorType[]> {
    try {
      const doctors = await Doctor.find({ 
        specialization: { $regex: specialization, $options: 'i' } 
      }).sort({ experience: -1 });

      return doctors.map(doctor => doctor.toJSON());
    } catch (error) {
      throw new Error(`Failed to fetch doctors by specialization: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export default new DoctorService(); 