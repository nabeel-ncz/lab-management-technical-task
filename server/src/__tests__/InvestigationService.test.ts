import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { InvestigationService } from '../services';
import { Patient, Doctor, Test, Investigation } from '../models';

describe('InvestigationService', () => {
  let mongoServer: MongoMemoryServer;
  let patientId: string;
  let doctorId: string;
  let testId: string;

  beforeEach(async () => {
    // Create in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Create test data
    const patient = await Patient.create({
      name: 'Test Patient',
      age: 30,
      gender: 'Male',
      phone: '+91 9876543210',
      email: 'test.patient@email.com',
      address: 'Test Address',
      emergencyContact: '+91 9876543211',
    });
    patientId = (patient._id as mongoose.Types.ObjectId).toString();

    const doctor = await Doctor.create({
      name: 'Dr. Test Doctor',
      specialization: 'Cardiology',
      phone: '+91 9876540001',
      email: 'test.doctor@hospital.com',
      hospital: 'Test Hospital',
      experience: 10,
    });
    doctorId = (doctor._id as mongoose.Types.ObjectId).toString();

    const test = await Test.create({
      name: 'Test Blood Work',
      category: 'Hematology',
      price: 500,
      normalRange: 'Normal range',
      description: 'Test blood work description',
      preparationInstructions: 'No preparation required',
    });
    testId = (test._id as mongoose.Types.ObjectId).toString();
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  describe('createInvestigation', () => {
    it('should create an investigation successfully', async () => {
      const investigationData = {
        patientId,
        doctorId,
        testIds: [testId],
        priority: 'Normal' as const,
        notes: 'Test investigation notes',
        totalAmount: 500,
        order: 1,
      };

      const result = await InvestigationService.createInvestigation(investigationData);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.patientId).toBe(patientId);
      expect(result.doctorId).toBe(doctorId);
      expect(result.testIds).toEqual([testId]);
      expect(result.status).toBe('New Investigations');
      expect(result.priority).toBe('Normal');
      expect(result.notes).toBe('Test investigation notes');
      expect(result.totalAmount).toBe(500); // Price of the test
      expect(result.order).toBe(1); // First investigation in status
      expect(result.patient).toBeDefined();
      expect(result.doctor).toBeDefined();
      expect(result.tests).toBeDefined();
      expect(result.tests).toHaveLength(1);
    });

    it('should throw error when patient is not found', async () => {
      const investigationData = {
        patientId: new mongoose.Types.ObjectId().toString(),
        doctorId,
        testIds: [testId],
        priority: 'Normal' as const,
        notes: 'Test investigation notes',
        totalAmount: 500,
        order: 1,
      };

      await expect(InvestigationService.createInvestigation(investigationData))
        .rejects
        .toThrow('Patient not found');
    });

    it('should throw error when doctor is not found', async () => {
      const investigationData = {
        patientId,
        doctorId: new mongoose.Types.ObjectId().toString(),
        testIds: [testId],
        priority: 'Normal' as const,
        notes: 'Test investigation notes',
        totalAmount: 500,
        order: 1,
      };

      await expect(InvestigationService.createInvestigation(investigationData))
        .rejects
        .toThrow('Doctor not found');
    });

    it('should throw error when test is not found', async () => {
      const investigationData = {
        patientId,
        doctorId,
        testIds: [new mongoose.Types.ObjectId().toString()],
        priority: 'Normal' as const,
        notes: 'Test investigation notes',
        totalAmount: 500,
        order: 1,
      };

      await expect(InvestigationService.createInvestigation(investigationData))
        .rejects
        .toThrow('One or more tests not found');
    });

    it('should calculate correct total amount for multiple tests', async () => {
      // Create another test
      const test2 = await Test.create({
        name: 'Test Blood Work 2',
        category: 'Hematology',
        price: 300,
        normalRange: 'Normal range',
        description: 'Test blood work description 2',
        preparationInstructions: 'No preparation required',
      });

      const investigationData = {
        patientId,
        doctorId,
        testIds: [testId, (test2._id as mongoose.Types.ObjectId).toString()],
        priority: 'High' as const,
        notes: 'Multiple tests investigation',
        totalAmount: 800,
        order: 1,
      };

      const result = await InvestigationService.createInvestigation(investigationData);

      expect(result.totalAmount).toBe(800); // 500 + 300
      expect(result.testIds).toHaveLength(2);
      expect(result.tests).toHaveLength(2);
    });
  });
}); 