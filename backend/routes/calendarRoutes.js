import express from 'express';
import { body } from 'express-validator';
import * as calendarController from '../controllers/calendarController.js';
import { protect } from '../middleware/auth.js';
import { coordinatorOnly } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);
router.use(coordinatorOnly);

router.post(
  '/',
  [body('company').isMongoId(), body('title').trim().notEmpty(), body('eventDate').isISO8601()],
  validate,
  calendarController.createEvent
);
router.get('/', calendarController.getEvents);
router.put('/:id', calendarController.updateEvent);
router.delete('/:id', calendarController.deleteEvent);

export default router;
