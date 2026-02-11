/**
 * Placement model - Historical placement records
 * Preserves data across academic years; one placement per student (final company)
 */
import mongoose from 'mongoose';

const placementSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    ctc: { type: Number },
    role: { type: String, trim: true },
    academicYear: { type: String, required: true, trim: true },
    placedAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// A student should have one placement record per academic year (final)
placementSchema.index({ student: 1, academicYear: 1 }, { unique: true });

export default mongoose.model('Placement', placementSchema);
