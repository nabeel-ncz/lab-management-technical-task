import mongoose, { Schema, Document } from "mongoose";
import { Patient } from "../types";

export interface IPatient extends Omit<Patient, "id">, Document {
  id: string;
}

const PatientSchema = new Schema<IPatient>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [1, "Age must be at least 1"],
      max: [120, "Age must not exceed 120"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: {
        values: ["Male", "Female", "Other"],
        message: "Gender must be Male, Female, or Other",
      },
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      minlength: [10, "Phone number must be at least 10 digits"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      minlength: [5, "Address must be at least 5 characters"],
    },
    emergencyContact: {
      type: String,
      required: [true, "Emergency contact is required"],
      trim: true,
      minlength: [10, "Emergency contact must be at least 10 digits"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        const { _id, __v, ...cleanRet } = ret;
        return {
          ...cleanRet,
          id: (_id as mongoose.Types.ObjectId).toString(),
        };
      },
    },
    toObject: {
      transform: function (doc, ret) {
        const { _id, __v, ...cleanRet } = ret;
        return {
          ...cleanRet,
          id: (_id as mongoose.Types.ObjectId).toString(),
        };
      },
    },
  },
);

// Add indexes for better performance
PatientSchema.index({ email: 1 }, { unique: true });
PatientSchema.index({ phone: 1 });
PatientSchema.index({ name: "text", email: "text" });

export default mongoose.model<IPatient>("Patient", PatientSchema);
