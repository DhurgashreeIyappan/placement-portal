/**
 * Experience controller - Placed students submit; others browse (approved only)
 */
import Experience from '../models/Experience.js';
import Company from '../models/Company.js';
import User from '../models/User.js';

export const submitExperience = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.isPlaced) {
      return res.status(403).json({ success: false, message: 'Only placed students can submit experiences' });
    }
    let companyName = req.body.companyName;
    if (req.body.companyId) {
      const company = await Company.findById(req.body.companyId).select('name');
          if (company) companyName = company.name;
    }
    const exp = await Experience.create({
      ...(req.body.companyId && { company: req.body.companyId }),
      companyName: companyName || req.body.companyName || 'Unknown',
      yearOfVisit: req.body.yearOfVisit,
      academicYear: req.body.academicYear,
      roundDetails: req.body.roundDetails || [],
      preparationTips: req.body.preparationTips,
      author: req.user.id,
      status: 'pending',
    });
    await exp.populate('company', 'name academicYear');
    res.status(201).json({ success: true, experience: exp });
  } catch (err) {
    next(err);
  }
};

export const getExperiences = async (req, res, next) => {
  try {
    const { companyId, year, status } = req.query;
    const filter = {};
    if (companyId) filter.company = companyId;
    if (year) filter.yearOfVisit = year;
    if (status) filter.status = status;
    else filter.status = 'approved'; // default: only approved for public browse
    const experiences = await Experience.find(filter)
      .populate('company', 'name academicYear')
      .populate('author', 'name')
      .sort('-createdAt');
    res.json({ success: true, experiences });
  } catch (err) {
    next(err);
  }
};

export const getExperiencesForModeration = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const experiences = await Experience.find(filter)
      .populate('company', 'name academicYear')
      .populate('author', 'name')
      .sort('-createdAt');
    res.json({ success: true, experiences });
  } catch (err) {
    next(err);
  }
};

export const getExperienceById = async (req, res, next) => {
  try {
    const exp = await Experience.findById(req.params.id)
      .populate('company', 'name academicYear')
      .populate('author', 'name');
    if (!exp) return res.status(404).json({ success: false, message: 'Experience not found' });
    const isAuthor = req.user && String(exp.author._id) === String(req.user.id);
    if (exp.status !== 'approved' && !isAuthor) {
      return res.status(403).json({ success: false, message: 'Not authorized to view' });
    }
    res.json({ success: true, experience: exp });
  } catch (err) {
    next(err);
  }
};

export const getMyExperiences = async (req, res, next) => {
  try {
    const experiences = await Experience.find({ author: req.user.id })
      .populate('company', 'name academicYear')
      .sort('-createdAt');
    res.json({ success: true, experiences });
  } catch (err) {
    next(err);
  }
};

export const moderateExperience = async (req, res, next) => {
  try {
    const exp = await Experience.findOneAndUpdate(
      { _id: req.params.id },
      { status: req.body.status, moderatedBy: req.user.id, moderatedAt: new Date() },
      { new: true }
    ).populate('company', 'name').populate('author', 'name');
    if (!exp) return res.status(404).json({ success: false, message: 'Experience not found' });
    res.json({ success: true, experience: exp });
  } catch (err) {
    next(err);
  }
};
