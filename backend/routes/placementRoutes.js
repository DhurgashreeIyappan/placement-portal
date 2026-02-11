import express from 'express';
import { body } from 'express-validator';
import * as placementController from '../controllers/placementController.js';
import { protect } from '../middleware/auth.js';
import { coordinatorOnly } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);
router.use(coordinatorOnly);

router.post(
  '/',
  [
    body('studentId').isMongoId(),
    body('companyId').isMongoId(),
    body('academicYear').optional().trim(),
  ],
  validate,
  placementController.createPlacement
);
router.get('/', placementController.getPlacements);

export default router;
