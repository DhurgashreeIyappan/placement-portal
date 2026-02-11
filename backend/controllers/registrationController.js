/**
 * Registration controller - Student registration and coordinator view
 */
import Registration from '../models/Registration.js';
import Company from '../models/Company.js';
import User from '../models/User.js';

// Check eligibility for a student against company criteria
const checkEligibility = (student, company) => {
  const e = company.eligibility || {};
  if (e.minCgpa != null && (student.cgpa == null || student.cgpa < e.minCgpa)) return false;
  if (e.maxBacklog != null && (student.backlogCount ?? 0) > e.maxBacklog) return false;
  if (e.minTenthPercent != null && (student.tenthPercent == null || student.tenthPercent < e.minTenthPercent)) return false;
  if (e.minTwelfthPercent != null && (student.twelfthPercent == null || student.twelfthPercent < e.minTwelfthPercent)) return false;
  if (e.allowedBranches?.length && student.branch && !e.allowedBranches.includes(student.branch)) return false;
  if (e.batchYears?.length && student.batch && !e.batchYears.includes(student.batch)) return false;
  return true;
};

// Student: register for a company drive (with eligibility check and duplicate prevention)
export const registerForCompany = async (req, res, next) => {
  try {
    const { companyId } = req.body;
    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
    if (!company.isPublished) return res.status(400).json({ success: false, message: 'Registration is not open' });
    const student = await User.findById(req.user.id);
    if (!checkEligibility(student, company)) {
      return res.status(400).json({ success: false, message: 'You do not meet eligibility criteria' });
    }
    const existing = await Registration.findOne({ company: companyId, student: req.user.id });
    if (existing) return res.status(400).json({ success: false, message: 'Already registered for this drive' });
    const reg = await Registration.create({ company: companyId, student: req.user.id });
    res.status(201).json({ success: true, registration: reg });
  } catch (err) {
    next(err);
  }
};

// Student: get my registrations
export const getMyRegistrations = async (req, res, next) => {
  try {
    const regs = await Registration.find({ student: req.user.id })
      .populate('company')
      .sort('-createdAt');
    res.json({ success: true, registrations: regs });
  } catch (err) {
    next(err);
  }
};

// Coordinator: get registrations for a company
export const getRegistrationsByCompany = async (req, res, next) => {
  try {
    const regs = await Registration.find({ company: req.params.companyId })
      .populate('student', 'name email rollNo batch branch cgpa')
      .sort('-createdAt');
    res.json({ success: true, registrations: regs });
  } catch (err) {
    next(err);
  }
};

// Coordinator: update registration status (e.g. shortlisted/rejected)
export const updateRegistrationStatus = async (req, res, next) => {
  try {
    const reg = await Registration.findOneAndUpdate(
      { _id: req.params.id, company: req.body.companyId },
      { status: req.body.status },
      { new: true }
    ).populate('student', 'name email');
    if (!reg) return res.status(404).json({ success: false, message: 'Registration not found' });
    res.json({ success: true, registration: reg });
  } catch (err) {
    next(err);
  }
};

// Check eligibility for a company (student)
export const checkEligibilityForCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.companyId);
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
    const student = await User.findById(req.user.id);
    const eligible = checkEligibility(student, company);
    const alreadyRegistered = await Registration.exists({ company: company._id, student: req.user.id });
    res.json({ success: true, eligible, alreadyRegistered, company: { name: company.name, eligibility: company.eligibility } });
  } catch (err) {
    next(err);
  }
};
