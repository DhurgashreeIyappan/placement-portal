/**
 * Student controller - Student-specific APIs (own data only)
 */
import Company from '../models/Company.js';
import Registration from '../models/Registration.js';
import InterviewRound from '../models/InterviewRound.js';
import Placement from '../models/Placement.js';

// Interview rounds cleared per company (for logged-in student)
export const getMyInterviewProgress = async (req, res, next) => {
  try {
    const regs = await Registration.find({ student: req.user.id }).populate('company', 'name academicYear');
    const progress = [];
    for (const reg of regs) {
      const rounds = await InterviewRound.find({ company: reg.company._id }).sort('roundIndex');
      const myResults = rounds.map((r) => {
        const result = r.results.find((x) => x.student.toString() === req.user.id);
        return { roundName: r.roundName, roundIndex: r.roundIndex, status: result?.status || 'pending' };
      });
      progress.push({ registration: reg, rounds: myResults });
    }
    res.json({ success: true, progress });
  } catch (err) {
    next(err);
  }
};

// Public company listing for students (published only)
export const getPublishedCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find({ isPublished: true }).sort('-createdAt');
    res.json({ success: true, companies });
  } catch (err) {
    next(err);
  }
};
