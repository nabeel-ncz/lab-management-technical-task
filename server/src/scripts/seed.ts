import mongoose from 'mongoose';
import connectDB from '../config/database';
import { Patient, Doctor, Test, Investigation } from '../models';

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Patient.deleteMany({});
    await Doctor.deleteMany({});
    await Test.deleteMany({});
    await Investigation.deleteMany({});

    // Seed Patients (matching frontend mock data)
    console.log('👥 Seeding patients...');
    const patients = await Patient.create([
      {
        name: 'Michael Brown',
        age: 35,
        gender: 'Male',
        phone: '+91 9876543210',
        email: 'michael.brown@email.com',
        address: '123 Healthcare St, Mumbai',
        emergencyContact: '+91 9876543211',
      },
      {
        name: 'Emily Davis',
        age: 28,
        gender: 'Female',
        phone: '+91 9876543212',
        email: 'emily.davis@email.com',
        address: '456 Medical Ave, Delhi',
        emergencyContact: '+91 9876543213',
      },
      {
        name: 'David Park',
        age: 42,
        gender: 'Male',
        phone: '+91 9876543214',
        email: 'david.park@email.com',
        address: '789 Health Blvd, Bangalore',
        emergencyContact: '+91 9876543215',
      },
      {
        name: 'Sarah Johnson',
        age: 31,
        gender: 'Female',
        phone: '+91 9876543216',
        email: 'sarah.johnson@email.com',
        address: '321 Care St, Chennai',
        emergencyContact: '+91 9876543217',
      },
      {
        name: 'John Smith',
        age: 45,
        gender: 'Male',
        phone: '+91 9876543218',
        email: 'john.smith@email.com',
        address: '654 Wellness Rd, Hyderabad',
        emergencyContact: '+91 9876543219',
      }
    ]);

    // Seed Doctors (matching frontend mock data)
    console.log('👨‍⚕️ Seeding doctors...');
    const doctors = await Doctor.create([
      {
        name: 'Dr. Lisa Thompson',
        specialization: 'Endocrinology',
        phone: '+91 9876540001',
        email: 'lisa.thompson@hospital.com',
        hospital: 'City General Hospital',
        experience: 12,
      },
      {
        name: 'Dr. James Rodriguez',
        specialization: 'Cardiology',
        phone: '+91 9876540002',
        email: 'james.rodriguez@hospital.com',
        hospital: 'Metro Medical Center',
        experience: 8,
      },
      {
        name: 'Dr. Amanda Chen',
        specialization: 'Pathology',
        phone: '+91 9876540003',
        email: 'amanda.chen@hospital.com',
        hospital: 'Advanced Diagnostics',
        experience: 15,
      },
      {
        name: 'Dr. Maria Garcia',
        specialization: 'Internal Medicine',
        phone: '+91 9876540004',
        email: 'maria.garcia@hospital.com',
        hospital: 'Community Health Center',
        experience: 10,
      },
      {
        name: 'Dr. David Park',
        specialization: 'Nephrology',
        phone: '+91 9876540005',
        email: 'david.park@hospital.com',
        hospital: 'Specialty Medical Group',
        experience: 18,
      }
    ]);

    // Seed Tests (matching frontend mock data)
    console.log('🧪 Seeding tests...');
    const tests = await Test.create([
      {
        name: 'Thyroid Function Test',
        category: 'Endocrinology',
        price: 1200,
        normalRange: 'TSH: 0.4-4.0 mIU/L, T3: 80-200 ng/dL, T4: 5.0-12.0 μg/dL',
        description: 'Comprehensive thyroid function assessment including TSH, T3, and T4 levels',
        preparationInstructions: 'No special preparation required. Can be done at any time.',
      },
      {
        name: 'Liver Function Test',
        category: 'Hepatology',
        price: 800,
        normalRange: 'ALT: 7-56 U/L, AST: 10-40 U/L, Bilirubin: 0.2-1.2 mg/dL',
        description: 'Assessment of liver enzymes and function',
        preparationInstructions: 'Fasting for 8-12 hours recommended',
      },
      {
        name: 'Complete Blood Count',
        category: 'Hematology',
        price: 500,
        normalRange: 'WBC: 4.5-11.0 x10³/μL, RBC: 4.5-5.5 x10⁶/μL, Platelets: 150-450 x10³/μL',
        description: 'Comprehensive blood cell analysis',
        preparationInstructions: 'No special preparation required',
      },
      {
        name: 'Kidney Function Test',
        category: 'Nephrology',
        price: 600,
        normalRange: 'Creatinine: 0.6-1.2 mg/dL, BUN: 7-20 mg/dL',
        description: 'Assessment of kidney function and health',
        preparationInstructions: 'Normal water intake, avoid excessive protein before test',
      },
      {
        name: 'Lipid Profile',
        category: 'Cardiology',
        price: 700,
        normalRange: 'Total Cholesterol: <200 mg/dL, LDL: <100 mg/dL, HDL: >40 mg/dL',
        description: 'Comprehensive cholesterol and lipid analysis',
        preparationInstructions: 'Fasting for 9-12 hours required',
      },
      {
        name: 'Blood Sugar Test',
        category: 'Endocrinology',
        price: 300,
        normalRange: 'Fasting: 70-100 mg/dL, Random: <140 mg/dL',
        description: 'Blood glucose level assessment',
        preparationInstructions: 'Fasting for 8 hours for fasting glucose test',
      }
    ]);

    // Seed Investigations (matching frontend mock data with different statuses and orders)
    console.log('🔬 Seeding investigations...');
    const investigations = [
      // Advised - order 1-2
      {
        patientId: patients[0]._id,
        doctorId: doctors[0]._id,
        testIds: [tests[0]._id],
        status: 'Advised',
        priority: 'Normal',
        totalAmount: 1200,
        notes: 'Doctor advised thyroid function test',
        order: 1,
      },
      {
        patientId: patients[1]._id,
        doctorId: doctors[1]._id,
        testIds: [tests[1]._id],
        status: 'Advised',
        priority: 'High',
        totalAmount: 800,
        notes: 'Follow-up liver function advised',
        order: 2,
      },
      // Billing - order 1-2
      {
        patientId: patients[2]._id,
        doctorId: doctors[2]._id,
        testIds: [tests[2]._id],
        status: 'Billing',
        priority: 'Normal',
        totalAmount: 500,
        notes: 'Ready for billing process',
        order: 1,
      },
      {
        patientId: patients[3]._id,
        doctorId: doctors[3]._id,
        testIds: [tests[3]._id, tests[4]._id],
        status: 'Billing',
        priority: 'Normal',
        totalAmount: 1300,
        notes: 'Multiple tests for billing',
        order: 2,
      },
      // New Investigations - order 1-4
      {
        patientId: patients[0]._id,
        doctorId: doctors[0]._id,
        testIds: [tests[0]._id],
        status: 'New Investigations',
        priority: 'Normal',
        totalAmount: 1200,
        notes: 'Routine thyroid check-up',
        order: 1,
      },
      {
        patientId: patients[1]._id,
        doctorId: doctors[1]._id,
        testIds: [tests[1]._id],
        status: 'New Investigations',
        priority: 'Normal',
        totalAmount: 800,
        notes: 'Follow-up liver function assessment',
        order: 2,
      },
      {
        patientId: patients[2]._id,
        doctorId: doctors[2]._id,
        testIds: [tests[3]._id],
        status: 'New Investigations',
        priority: 'Emergency',
        totalAmount: 600,
        notes: 'Urgent kidney function check',
        order: 3,
      },
      {
        patientId: patients[3]._id,
        doctorId: doctors[3]._id,
        testIds: [tests[2]._id, tests[4]._id],
        status: 'New Investigations',
        priority: 'Normal',
        totalAmount: 1200,
        notes: 'Complete health check-up',
        order: 4,
      },
      // In Progress - order 1-4
      {
        patientId: patients[0]._id,
        doctorId: doctors[1]._id,
        testIds: [tests[2]._id],
        status: 'In Progress',
        priority: 'Emergency',
        totalAmount: 500,
        notes: 'Blood work in progress',
        order: 1,
      },
      {
        patientId: patients[1]._id,
        doctorId: doctors[2]._id,
        testIds: [tests[4]._id],
        status: 'In Progress',
        priority: 'Normal',
        totalAmount: 700,
        notes: 'Lipid profile analysis',
        order: 2,
      },
      {
        patientId: patients[2]._id,
        doctorId: doctors[0]._id,
        testIds: [tests[5]._id],
        status: 'In Progress',
        priority: 'High',
        totalAmount: 300,
        notes: 'Diabetes monitoring',
        order: 3,
      },
      {
        patientId: patients[3]._id,
        doctorId: doctors[4]._id,
        testIds: [tests[3]._id, tests[5]._id],
        status: 'In Progress',
        priority: 'Normal',
        totalAmount: 900,
        notes: 'Kidney and glucose assessment',
        order: 4,
      },
      // Under Review - order 1-3
      {
        patientId: patients[4]._id,
        doctorId: doctors[0]._id,
        testIds: [tests[0]._id, tests[1]._id],
        status: 'Under Review',
        priority: 'High',
        totalAmount: 2000,
        notes: 'Comprehensive endocrine panel',
        order: 1,
      },
      {
        patientId: patients[0]._id,
        doctorId: doctors[3]._id,
        testIds: [tests[4]._id],
        status: 'Under Review',
        priority: 'Normal',
        totalAmount: 700,
        notes: 'Lipid profile review',
        order: 2,
      },
      {
        patientId: patients[1]._id,
        doctorId: doctors[4]._id,
        testIds: [tests[3]._id],
        status: 'Under Review',
        priority: 'Normal',
        totalAmount: 600,
        notes: 'Kidney function review',
        order: 3,
      },
      // Approved - order 1-2
      {
        patientId: patients[2]._id,
        doctorId: doctors[1]._id,
        testIds: [tests[4]._id],
        status: 'Approved',
        priority: 'Normal',
        totalAmount: 700,
        notes: 'Lipid profile approved',
        order: 1,
      },
      {
        patientId: patients[3]._id,
        doctorId: doctors[2]._id,
        testIds: [tests[5]._id],
        status: 'Approved',
        priority: 'Normal',
        totalAmount: 300,
        notes: 'Blood sugar test completed',
        order: 2,
      },
      // Revision Required - order 1-2
      {
        patientId: patients[4]._id,
        doctorId: doctors[0]._id,
        testIds: [tests[1]._id],
        status: 'Revision Required',
        priority: 'High',
        totalAmount: 800,
        notes: 'Liver function needs retest',
        order: 1,
      },
      {
        patientId: patients[0]._id,
        doctorId: doctors[3]._id,
        testIds: [tests[2]._id],
        status: 'Revision Required',
        priority: 'Normal',
        totalAmount: 500,
        notes: 'Sample quality issues',
        order: 2,
      }
    ];

    await Investigation.create(investigations);

    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Seeded:
    - ${patients.length} patients
    - ${doctors.length} doctors  
    - ${tests.length} tests
    - ${investigations.length} investigations`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding
seedData(); 