import mongoose, { Schema, models, model } from "mongoose";

const JobSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },

    companyName: { type: String, required: true },
    jobTitle: { type: String, required: true },
    jobDescription: { type: String },
    jobLink: { type: String },
    notes: { type: String },

    status: {
      type: String,
      enum: ["applied", "interviewing", "rejected", "selected"],
      default: "applied",
      index: true,
    },
  },
  { timestamps: true }
);

export const Job = models.Job || model("Job", JobSchema);
