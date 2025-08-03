import mongoose, { Schema, Document } from "mongoose";
import { Test } from "../types";

export interface ITest extends Omit<Test, "id">, Document {
  id: string;
}

const TestSchema = new Schema<ITest>(
  {
    name: {
      type: String,
      required: [true, "Test name is required"],
      trim: true,
      minlength: [2, "Test name must be at least 2 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      minlength: [2, "Category must be at least 2 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [1, "Price must be greater than 0"],
    },
    normalRange: {
      type: String,
      required: [true, "Normal range is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
    },
    preparationInstructions: {
      type: String,
      required: [true, "Preparation instructions are required"],
      trim: true,
      minlength: [5, "Preparation instructions must be at least 5 characters"],
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
TestSchema.index({ name: 1 }, { unique: true });
TestSchema.index({ category: 1 });
TestSchema.index({ price: 1 });
TestSchema.index({ name: "text", category: "text", description: "text" });

export default mongoose.model<ITest>("Test", TestSchema);
