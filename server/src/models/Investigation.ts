import mongoose, { Schema, Document } from "mongoose";
import { Investigation } from "../types";

export interface IInvestigation extends Omit<Investigation, "id" | "patient" | "doctor" | "tests" | "patientId" | "doctorId" | "testIds">, Document {
  id: string;
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  testIds: mongoose.Types.ObjectId[];
}

const InvestigationSchema = new Schema<IInvestigation>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient is required"],
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Doctor is required"],
    },
    testIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Test",
        required: true,
      },
    ],
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: {
        values: ["Advised", "Billing", "New Investigations", "In Progress", "Under Review", "Approved", "Revision Required"],
        message: "Invalid status value",
      },
      default: "New Investigations",
    },
    priority: {
      type: String,
      required: [true, "Priority is required"],
      enum: {
        values: ["Emergency", "Normal", "High"],
        message: "Priority must be Emergency, Normal, or High",
      },
      default: "Normal",
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    reportFile: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    order: {
      type: Number,
      required: [true, "Order is required"],
      min: [1, "Order must be at least 1"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = (ret._id as mongoose.Types.ObjectId).toString();
        if (ret._id !== undefined) delete ret._id;
        if (ret.__v !== undefined) delete (ret as any)?.__v;

        // Convert ObjectIds to strings for API response
        if (ret.patientId && typeof ret.patientId === "object") {
          ret.patientId = ret.patientId.toString() as unknown as mongoose.Types.ObjectId;
        }
        if (ret.doctorId && typeof ret.doctorId === "object") {
          ret.doctorId = ret.doctorId.toString() as unknown as mongoose.Types.ObjectId;
        }
        if (ret.testIds && Array.isArray(ret.testIds)) {
          ret.testIds = ret.testIds.map((id: any) => (typeof id === "object" ? id.toString() : id));
        }

        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = (ret._id as mongoose.Types.ObjectId).toString();
        if (ret._id !== undefined) delete ret._id;
        if (ret.__v !== undefined) delete (ret as any)?.__v;

        // Convert ObjectIds to strings
        if (ret.patientId && typeof ret.patientId === "object") {
          ret.patientId = ret.patientId.toString() as unknown as mongoose.Types.ObjectId;
        }
        if (ret.doctorId && typeof ret.doctorId === "object") {
          ret.doctorId = ret.doctorId.toString() as unknown as mongoose.Types.ObjectId;
        }
        if (ret.testIds && Array.isArray(ret.testIds)) {
          ret.testIds = ret.testIds.map((id: any) => (typeof id === "object" ? id.toString() : id));
        }

        return ret;
      },
    },
  },
);

// Add indexes for better performance
InvestigationSchema.index({ patientId: 1 });
InvestigationSchema.index({ doctorId: 1 });
InvestigationSchema.index({ status: 1 });
InvestigationSchema.index({ priority: 1 });
InvestigationSchema.index({ createdAt: -1 });
InvestigationSchema.index({ status: 1, order: 1 });

// Compound index for efficient querying
InvestigationSchema.index({
  status: 1,
  priority: 1,
  createdAt: -1,
});

// Virtual fields for populated data
InvestigationSchema.virtual('patient', {
  ref: 'Patient',
  localField: 'patientId',
  foreignField: '_id',
  justOne: true
});

InvestigationSchema.virtual('doctor', {
  ref: 'Doctor',
  localField: 'doctorId',
  foreignField: '_id',
  justOne: true
});

InvestigationSchema.virtual('tests', {
  ref: 'Test',
  localField: 'testIds',
  foreignField: '_id',
  justOne: false
});



// Pre-save middleware to auto-calculate total amount
InvestigationSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("testIds")) {
    try {
      const Test = mongoose.model("Test");
      const tests = await Test.find({ _id: { $in: this.testIds } });
      this.totalAmount = tests.reduce((total, test: any) => total + test.price, 0);
    } catch (error) {
      return next(error as Error);
    }
  }
  next();
});

// Pre-save middleware to auto-assign order within status
InvestigationSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const Investigation = mongoose.model("Investigation");
      const maxOrderInStatus = await Investigation.findOne({ status: this.status }).sort({ order: -1 }).select("order");

      this.order = maxOrderInStatus ? maxOrderInStatus.order + 1 : 1;
    } catch (error) {
      return next(error as Error);
    }
  }
  next();
});

export default mongoose.model<IInvestigation>("Investigation", InvestigationSchema);
