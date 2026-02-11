/**
 * Analytics controller - Consolidated reports for coordinator
 */
import Registration from '../models/Registration.js';
import Placement from '../models/Placement.js';
import InterviewRound from '../models/InterviewRound.js';
import Company from '../models/Company.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

export const getDashboardStats = async (req, res, next) => {
  try {
    const { academicYear } = req.query;
    const companyFilter = academicYear ? { academicYear } : {};
    const companies = await Company.find(companyFilter);
    const companyIds = companies.map((c) => c._id);

    const totalCompanies = companies.length;
    const regCounts = await Registration.aggregate([
      { $match: { company: { $in: companyIds } } },
      { $group: { _id: '$company', count: { $sum: 1 } } },
    ]);
    const regMap = Object.fromEntries(regCounts.map((r) => [r._id.toString(), r.count]));

    const placedCount = await Placement.countDocuments(academicYear ? { academicYear } : {});
    const totalStudents = await User.countDocuments({ role: 'student' });

    const summary = {
      totalCompanies,
      totalRegistrations: regCounts.reduce((s, r) => s + r.count, 0),
      placedCount,
      totalStudents,
      companies: companies.map((c) => ({
        _id: c._id,
        name: c.name,
        academicYear: c.academicYear,
        isPublished: c.isPublished,
        registrationCount: regMap[c._id.toString()] || 0,
      })),
    };
    res.json({ success: true, summary });
  } catch (err) {
    next(err);
  }
};

export const getCompanyWiseReport = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const [company, registrations, rounds, placements] = await Promise.all([
      Company.findById(companyId),
      Registration.find({ company: companyId }).populate('student', 'name email rollNo batch branch cgpa'),
      InterviewRound.find({ company: companyId }).sort('roundIndex'),
      Placement.find({ company: companyId }).populate('student', 'name email rollNo batch'),
    ]);
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
    res.json({
      success: true,
      company,
      registrations,
      rounds,
      placedCount: placements.length,
      placedStudents: placements,
    });
  } catch (err) {
    next(err);
  }
};

export const getPlacedStudentsList = async (req, res, next) => {
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

export const getPlacementHistory = async (req, res, next) => {
  try {
    const placements = await Placement.find({ student: req.user.id })
      .populate('company', 'name academicYear')
      .sort('-placedAt');
    res.json({ success: true, placements });
  } catch (err) {
    next(err);
  }
};
