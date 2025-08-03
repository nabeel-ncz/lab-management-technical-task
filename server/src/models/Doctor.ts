import mongoose, { Schema, Document } from 'mongoose';
import { Doctor } from '../types';

export interface IDoctor extends Omit<Doctor, 'id'>, Document {
  id: string;
}

const DoctorSchema = new Schema<IDoctor>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    trim: true,
    minlength: [2, 'Specialization must be at least 2 characters'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    minlength: [10, 'Phone number must be at least 10 digits'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  hospital: {
    type: String,
    required: [true, 'Hospital name is required'],
    trim: true,
    minlength: [2, 'Hospital name must be at least 2 characters'],
  },
  experience: {
    type: Number,
    required: [true, 'Experience is required'],
    min: [0, 'Experience cannot be negative'],
    max: [50, 'Experience must not exceed 50 years'],
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
  toObject: {
    transform: function(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
});

// Add indexes for better performance
DoctorSchema.index({ email: 1 }, { unique: true });
DoctorSchema.index({ specialization: 1 });
DoctorSchema.index({ hospital: 1 });
DoctorSchema.index({ name: 'text', specialization: 'text', hospital: 'text' });

export default mongoose.model<IDoctor>('Doctor', DoctorSchema); 