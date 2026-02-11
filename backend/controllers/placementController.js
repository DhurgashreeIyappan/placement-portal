/**
 * Placement controller - Record placements (Coordinator) and view history
 */
import Placement from '../models/Placement.js';
import User from '../models/User.js';

export const createPlacement = async (req, res, next) => {
  try {
    const { studentId, companyId, ctc, role, academicYear } = req.body;
    const placement = await Placement.create({
      student: studentId,
      company: companyId,
      ctc,
      role,
      academicYear: academicYear || new Date().getFullYear() + '-' + (new Date().getFullYear() % 100 + 1),
      createdBy: req.user.id,
    });
    await User.findByIdAndUpdate(studentId, { isPlaced: true });
    await placement.populate('student', 'name email rollNo batch').populate('company', 'name academicYear');
    res.status(201).json({ success: true, placement });
  } catch (err) {
    next(err);
  }
};

export const getPlacements = async (req, res, next) => {
  try {
    const { academicYear } = req.query;
    const filter = academicYear ? { academicYear } : {};
    const placements = await Placement.find(filter)
      .populate('student', 'name email rollNo batch branch')
      .populate('company', 'name academicYear')
      .sort('-placedAt');
    res.json({ success: true, placements });
  } catch (err) {
    next(err);
  }
};
