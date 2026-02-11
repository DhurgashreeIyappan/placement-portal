/**
 * InterviewRound model - Rounds per company drive and student progression
 * Tracks which round each student is in / cleared
 */
import mongoose from 'mongoose';

const roundResultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roundIndex: { type: Number, required: true }, // 0-based
  status: { type: String, enum: ['pending', 'cleared', 'rejected', 'absent'], default: 'pending' },
  scheduledAt: { type: Date },
  remarks: { type: String, trim: true },
}, { _id: false });

const interviewRoundSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    roundName: { type: String, required: true, trim: true }, // e.g. "Aptitude", "Technical", "HR"
    roundIndex: { type: Number, required: true, min: 0 },
    date: { type: Date },
    results: [roundResultSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

interviewRoundSchema.index({ company: 1, roundIndex: 1 }, { unique: true });

export default mongoose.model('InterviewRound', interviewRoundSchema);
