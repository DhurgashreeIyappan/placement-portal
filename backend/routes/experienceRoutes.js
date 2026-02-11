import express from 'express';
import { body } from 'express-validator';
import * as experienceController from '../controllers/experienceController.js';
import { protect, optionalProtect } from '../middleware/auth.js';
import { coordinatorOnly, studentOnly } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// =========================
// Submit experience (placed students only)
// =========================
router.post(
  '/',
  protect,
  studentOnly,
  [
    body('companyId').optional().isMongoId(),
    body('companyName').optional().trim(),
    body('yearOfVisit').trim().notEmpty(),
    body('roundDetails').optional().isArray(),
  ],
  validate,
  experienceController.submitExperience
);

// =========================
// Public Routes
// =========================

// Browse experiences (approved only by default)
router.get('/', experienceController.getExperiences);

// =========================
// Student Routes
// =========================

// My experiences
router.get(
  '/my/list',
  protect,
  studentOnly,
  experienceController.getMyExperiences
);

// =========================
// Coordinator Routes
// =========================

// List for moderation (any status)
router.get(
  '/moderation',
  protect,
  coordinatorOnly,
  experienceController.getExperiencesForModeration
);

// Moderate experience
router.patch(
  '/:id/moderate',
  protect,
  coordinatorOnly,
  [body('status').isIn(['pending', 'approved', 'rejected'])],
  validate,
  experienceController.moderateExperience
);

// =========================
// Dynamic Route (KEEP LAST)
// =========================

// Get by ID (optional auth)
router.get(
  '/:id',
  optionalProtect,
  experienceController.getExperienceById
);

export default router;
