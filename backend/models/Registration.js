/**
 * Registration model - Student registration for company drives
 * Prevents duplicate registrations per student per company drive
 */
import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['registered', 'shortlisted', 'rejected', 'withdrawn'], default: 'registered' },
  },
  { timestamps: true }
);

// One registration per student per company (drive)
registrationSchema.index({ company: 1, student: 1 }, { unique: true });

export default mongoose.model('Registration', registrationSchema);
