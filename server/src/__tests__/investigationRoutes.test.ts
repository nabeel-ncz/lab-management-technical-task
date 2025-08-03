import { describe, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import express from "express";
import cors from "cors";
import routes from "../routes";
import { errorHandler } from "../middleware/errorHandler";
import { Patient, Doctor, Test, Investigation } from "../models";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", routes);
app.use(errorHandler);

describe("Investigation Routes", () => {
  let mongoServer: MongoMemoryServer;
  let patientId: string;
  let doctorId: string;
  let testId: string;
  let investigationId: string;

  beforeEach(async () => {
    // Create in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Create test data
    const patient = await Patient.create({
      name: "Test Patient",
      age: 30,
      gender: "Male",
      phone: "+91 9876543210",
      email: "test.patient@email.com",
      address: "Test Address",
      emergencyContact: "+91 9876543211",
    });
    patientId = (patient._id as mongoose.Types.ObjectId).toString();

    const doctor = await Doctor.create({
      name: "Dr. Test Doctor",
      specialization: "Cardiology",
      phone: "+91 9876540001",
      email: "test.doctor@hospital.com",
      hospital: "Test Hospital",
      experience: 10,
    });
    doctorId = (doctor._id as mongoose.Types.ObjectId).toString();

    const test = await Test.create({
      name: "Test Blood Work",
      category: "Hematology",
      price: 500,
      normalRange: "Normal range",
      description: "Test blood work description",
      preparationInstructions: "No preparation required",
    });
    testId = (test._id as mongoose.Types.ObjectId).toString();

    // Create a test investigation
    const investigation = await Investigation.create({
      patientId: patient._id,
      doctorId: doctor._id,
      testIds: [test._id],
      status: "New Investigations",
      priority: "Normal",
      notes: "Test investigation",
      totalAmount: 500,
      order: 1,
    });
    investigationId = (investigation._id as mongoose.Types.ObjectId).toString();
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  describe("GET /api/investigations", () => {
    it("should return all investigations with populated data", async () => {
      const response = await request(app).get("/api/investigations").expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: expect.any(Array),
      });

      expect(response.body.data).toHaveLength(1);

      const investigation = response.body.data[0];
      expect(investigation).toMatchObject({
        id: investigationId,
        patientId,
        doctorId,
        testIds: [testId],
        status: "New Investigations",
        priority: "Normal",
        notes: "Test investigation",
        order: 1,
        totalAmount: 500,
      });

      // Check populated data
      expect(investigation.patient).toBeDefined();
      expect(investigation.patient.name).toBe("Test Patient");
      expect(investigation.doctor).toBeDefined();
      expect(investigation.doctor.name).toBe("Dr. Test Doctor");
      expect(investigation.tests).toBeDefined();
      expect(investigation.tests).toHaveLength(1);
      expect(investigation.tests[0].name).toBe("Test Blood Work");
    });

    it("should filter investigations by status", async () => {
      // Create another investigation with different status
      await Investigation.create({
        patientId,
        doctorId,
        testIds: [testId],
        status: "In Progress",
        priority: "High",
        notes: "In progress investigation",
        totalAmount: 500,
        order: 1,
      });

      const response = await request(app)
        .get("/api/investigations")
        .query({ status: ["In Progress", "Advised"] })
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].status).toBe("In Progress");
    });

    it("should filter investigations by priority", async () => {
      // Create another investigation with different priority
      await Investigation.create({
        patientId,
        doctorId,
        testIds: [testId],
        status: "New Investigations",
        priority: "Emergency",
        notes: "Emergency investigation",
        totalAmount: 500,
        order: 2,
      });

      const response = await request(app).get("/api/investigations").query({ priority: ["Emergency"] }).expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].priority).toBe("Emergency");
    });

    it("should search investigations by patient name", async () => {
      const response = await request(app).get("/api/investigations?search=Test Patient").expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].patient.name).toBe("Test Patient");
    });

    it("should return empty array when no investigations match filter", async () => {
      const response = await request(app).get("/api/investigations").query({ status: ["Approved"] }).expect(200);

      expect(response.body.data).toHaveLength(0);
    });
  });

  describe("GET /api/investigations/:id", () => {
    it("should return investigation by ID with populated data", async () => {
      const response = await request(app).get(`/api/investigations/${investigationId}`).expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: expect.objectContaining({
          id: investigationId,
          status: "New Investigations",
          priority: "Normal",
        }),
      });

      expect(response.body.data.patient).toBeDefined();
      expect(response.body.data.doctor).toBeDefined();
      expect(response.body.data.tests).toBeDefined();
    });

    it("should return 404 for non-existent investigation", async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();

      const response = await request(app).get(`/api/investigations/${nonExistentId}`).expect(404);

      expect(response.body).toMatchObject({
        success: false,
        error: "Investigation not found",
      });
    });

    it("should return 400 for invalid ID format", async () => {
      const response = await request(app).get("/api/investigations/invalid-id").expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.stringContaining("validation"),
      });
    });
  });
});
