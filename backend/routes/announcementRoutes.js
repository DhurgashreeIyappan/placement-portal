import express from 'express';
import { body } from 'express-validator';
import * as announcementController from '../controllers/announcementController.js';
import { protect } from '../middleware/auth.js';
import { coordinatorOnly, studentOnly } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Coordinator: create announcement
router.post(
  '/',
  protect,
  coordinatorOnly,
  [body('groupId').isMongoId(), body('title').trim().notEmpty(), body('content').trim().notEmpty()],
  validate,
  announcementController.createAnnouncement
);

// Coordinator: list by group
router.get('/group/:groupId', protect, coordinatorOnly, announcementController.getAnnouncementsByGroup);

// Student: my announcements (groups I'm in)
router.get('/my', protect, studentOnly, announcementController.getMyAnnouncements);

// Coordinator: update/delete
router.put('/:id', protect, coordinatorOnly, [body('title').trim().notEmpty(), body('content').trim().notEmpty()], validate, announcementController.updateAnnouncement);
router.delete('/:id', protect, coordinatorOnly, announcementController.deleteAnnouncement);

export default router;
