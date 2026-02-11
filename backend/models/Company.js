/**
 * Company model - Drive details and eligibility criteria
 * Supports multiple drives per company across academic years
 */
import mongoose from 'mongoose';

const eligibilitySchema = new mongoose.Schema({
  minCgpa: { type: Number, min: 0, max: 10 },
  maxBacklog: { type: Number, default: 0, min: 0 },
  minTenthPercent: { type: Number, min: 0, max: 100 },
  minTwelfthPercent: { type: Number, min: 0, max: 100 },
  allowedBranches: [{ type: String, trim: true }], // empty = all branches
  batchYears: [{ type: String, trim: true }], // e.g. ["2021","2022"]
});

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    // Drive for a specific academic year
    academicYear: { type: String, required: true, trim: true }, // e.g. "2024-25"
    eligibility: { type: eligibilitySchema, default: () => ({}) },
    registrationDeadline: { type: Date },
    isPublished: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Compound index: one drive per company per academic year (conceptual uniqueness)
companySchema.index({ name: 1, academicYear: 1 });

export default mongoose.model('Company', companySchema);
