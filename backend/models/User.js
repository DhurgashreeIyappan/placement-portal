/**
 * User model - Coordinator and Student roles
 * Supports authentication and role-based access
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ['coordinator', 'student'], required: true },
    // Student-specific fields (preserved across academic years)
    rollNo: { type: String, trim: true, sparse: true },
    batch: { type: String, trim: true }, // e.g. "2021", "2022"
    branch: { type: String, trim: true },
    cgpa: { type: Number, min: 0, max: 10 },
    tenthPercent: { type: Number, min: 0, max: 100 },
    twelfthPercent: { type: Number, min: 0, max: 100 },
    backlogCount: { type: Number, default: 0, min: 0 },
    isPlaced: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
