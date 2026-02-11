/**
 * CalendarEvent model - Company visit schedules for placement calendar
 */
import mongoose from 'mongoose';

const calendarEventSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    eventDate: { type: Date, required: true },
    endDate: { type: Date },
    type: { type: String, enum: ['pre_placement_talk', 'aptitude', 'technical', 'hr', 'result', 'other'], default: 'other' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model('CalendarEvent', calendarEventSchema);
