import express from 'express';
import { body } from 'express-validator';
import * as registrationController from '../controllers/registrationController.js';
import { protect } from '../middleware/auth.js';
import { coordinatorOnly, studentOnly } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Student: register for company
router.post(
  '/',
  protect,
  studentOnly,
  [body('companyId').isMongoId()],
  validate,
  registrationController.registerForCompany
);

// Student: my registrations
router.get('/my', protect, studentOnly, registrationController.getMyRegistrations);

// Student: check eligibility for a company
router.get('/check-eligibility/:companyId', protect, studentOnly, registrationController.checkEligibilityForCompany);

// Coordinator: list by company
router.get('/company/:companyId', protect, coordinatorOnly, registrationController.getRegistrationsByCompany);

// Coordinator: update status
router.patch('/:id', protect, coordinatorOnly, [body('status').isIn(['registered', 'shortlisted', 'rejected', 'withdrawn']), body('companyId').isMongoId()], validate, registrationController.updateRegistrationStatus);

export default router;
