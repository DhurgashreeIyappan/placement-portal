/**
 * Experience model - Interview experiences from placed students
 * Company-wise and year-wise; supports moderation
 */
import mongoose from 'mongoose';

const roundExperienceSchema = new mongoose.Schema({
  roundName: { type: String, trim: true },
  roundIndex: { type: Number, min: 0 },
  experience: { type: String },
  questions: [{ type: String }],
  tips: { type: String },
}, { _id: false });

const experienceSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }, // optional if company not in system
    companyName: { type: String, required: true, trim: true }, // denormalized for display
    yearOfVisit: { type: String, required: true, trim: true }, // e.g. "2024"
    academicYear: { type: String, trim: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    roundDetails: [roundExperienceSchema],
    preparationTips: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    moderatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    moderatedAt: { type: Date },
  },
  { timestamps: true }
);

experienceSchema.index({ company: 1, yearOfVisit: 1 });
experienceSchema.index({ status: 1 });

export default mongoose.model('Experience', experienceSchema);
