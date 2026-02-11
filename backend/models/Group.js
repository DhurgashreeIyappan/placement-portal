/**
 * Group model - Company-wise or batch-wise student groups
 * Used for announcements and tracking
 */
import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['company', 'batch'], required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }, // for type: company
    batchYear: { type: String, trim: true }, // for type: batch, e.g. "2022"
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Group', groupSchema);
