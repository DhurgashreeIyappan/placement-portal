import express from 'express';
import * as analyticsController from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';
import { coordinatorOnly, studentOnly } from '../middleware/roleCheck.js';

const router = express.Router();

router.use(protect);

// Coordinator: dashboard stats and reports
router.get('/dashboard', coordinatorOnly, analyticsController.getDashboardStats);
router.get('/company/:companyId', coordinatorOnly, analyticsController.getCompanyWiseReport);
router.get('/placed-students', coordinatorOnly, analyticsController.getPlacedStudentsList);

// Student: own placement history
router.get('/my-placement-history', studentOnly, analyticsController.getPlacementHistory);

export default router;
