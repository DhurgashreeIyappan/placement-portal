import express from 'express';
import * as studentController from '../controllers/studentController.js';
import { protect } from '../middleware/auth.js';
import { studentOnly } from '../middleware/roleCheck.js';

const router = express.Router();

router.use(protect);
router.use(studentOnly);

// Published company drives (for registration page)
router.get('/companies', studentController.getPublishedCompanies);
// My interview progress per company
router.get('/interview-progress', studentController.getMyInterviewProgress);

export default router;
