/**
 * Interview round controller - Create rounds and update student progression
 */
import InterviewRound from '../models/InterviewRound.js';
import Company from '../models/Company.js';

export const createRound = async (req, res, next) => {
  try {
    const company = await Company.findById(req.body.companyId);
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
    const round = await InterviewRound.create({
      company: req.body.companyId,
      roundName: req.body.roundName,
      roundIndex: req.body.roundIndex,
      date: req.body.date,
      createdBy: req.user.id,
    });
    await round.populate('company', 'name academicYear');
    res.status(201).json({ success: true, round });
  } catch (err) {
    next(err);
  }
};

export const getRoundsByCompany = async (req, res, next) => {
  try {
    const rounds = await InterviewRound.find({ company: req.params.companyId }).sort('roundIndex');
    res.json({ success: true, rounds });
  } catch (err) {
    next(err);
  }
};

export const updateRoundResult = async (req, res, next) => {
  try {
    const round = await InterviewRound.findOne({ _id: req.params.id, createdBy: req.user.id });
    if (!round) return res.status(404).json({ success: false, message: 'Round not found' });
    const { studentId, status, remarks } = req.body;
    const idx = round.results.findIndex((r) => r.student.toString() === studentId);
    if (idx >= 0) {
      round.results[idx].status = status;
      if (remarks != null) round.results[idx].remarks = remarks;
    } else {
      round.results.push({ student: studentId, roundIndex: round.roundIndex, status: status || 'pending', remarks });
    }
    await round.save();
    await round.populate('results.student', 'name email rollNo');
    res.json({ success: true, round });
  } catch (err) {
    next(err);
  }
};

export const addResultsBulk = async (req, res, next) => {
  try {
    const round = await InterviewRound.findOne({ _id: req.params.id, createdBy: req.user.id });
    if (!round) return res.status(404).json({ success: false, message: 'Round not found' });
    const { results } = req.body; // [{ studentId, status, remarks }]
    for (const r of results || []) {
      const idx = round.results.findIndex((x) => x.student.toString() === r.studentId);
      const entry = { student: r.studentId, roundIndex: round.roundIndex, status: r.status || 'pending', remarks: r.remarks };
      if (idx >= 0) round.results[idx] = entry;
      else round.results.push(entry);
    }
    await round.save();
    await round.populate('results.student', 'name email rollNo');
    res.json({ success: true, round });
  } catch (err) {
    next(err);
  }
};

export const deleteRound = async (req, res, next) => {
  try {
    const round = await InterviewRound.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!round) return res.status(404).json({ success: false, message: 'Round not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
