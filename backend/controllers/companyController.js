/**
 * Company controller - CRUD for company drives (Coordinator only)
 */
import Company from '../models/Company.js';

export const createCompany = async (req, res, next) => {
  try {
    const company = await Company.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ success: true, company });
  } catch (err) {
    next(err);
  }
};

export const updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
    res.json({ success: true, company });
  } catch (err) {
    next(err);
  }
};

export const getCompanies = async (req, res, next) => {
  try {
    const { academicYear, isPublished } = req.query;
    const filter = {};
    if (academicYear) filter.academicYear = academicYear;
    if (isPublished !== undefined) filter.isPublished = isPublished === 'true';
    const companies = await Company.find(filter).populate('createdBy', 'name email').sort('-createdAt');
    res.json({ success: true, companies });
  } catch (err) {
    next(err);
  }
};

export const getPublishedCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find({ isPublished: true }).select('name academicYear _id').sort('name');
    res.json({ success: true, companies });
  } catch (err) {
    next(err);
  }
};

export const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id).populate('createdBy', 'name email');
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
    res.json({ success: true, company });
  } catch (err) {
    next(err);
  }
};

export const publishCompany = async (req, res, next) => {
  try {
    const company = await Company.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      { isPublished: true },
      { new: true }
    );
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
    res.json({ success: true, company });
  } catch (err) {
    next(err);
  }
};

export const deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
    res.json({ success: true, message: 'Company deleted' });
  } catch (err) {
    next(err);
  }
};
