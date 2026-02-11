import express from 'express';
import { body } from 'express-validator';
import * as groupController from '../controllers/groupController.js';
import { protect } from '../middleware/auth.js';
import { coordinatorOnly } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);
router.use(coordinatorOnly);

router.post(
  '/',
  [
    body('name').trim().notEmpty(),
    body('type').isIn(['company', 'batch']),
  ],
  validate,
  groupController.createGroup
);
router.get('/', groupController.getGroups);
router.get('/:id', groupController.getGroupById);
router.put('/:id', groupController.updateGroup);
router.post('/:id/members', [body('memberIds').isArray()], validate, groupController.addMembersToGroup);
router.delete('/:id/members/:memberId', groupController.removeMemberFromGroup);
router.delete('/:id', groupController.deleteGroup);

export default router;
