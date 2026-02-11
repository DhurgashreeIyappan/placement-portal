import express from 'express';
import { body } from 'express-validator';
import * as interviewRoundController from '../controllers/interviewRoundController.js';
import { protect } from '../middleware/auth.js';
import { coordinatorOnly } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);
router.use(coordinatorOnly);

router.post(
  '/',
  [
    body('companyId').isMongoId(),
    body('roundName').trim().notEmpty(),
    body('roundIndex').isInt({ min: 0 }),
  ],
  validate,
  interviewRoundController.createRound
);
router.get('/company/:companyId', interviewRoundController.getRoundsByCompany);
router.patch('/:id/result', [body('studentId').isMongoId(), body('status').isIn(['pending', 'cleared', 'rejected', 'absent'])], validate, interviewRoundController.updateRoundResult);
router.patch('/:id/results-bulk', [body('results').isArray()], validate, interviewRoundController.addResultsBulk);
router.delete('/:id', interviewRoundController.deleteRound);

export default router;
