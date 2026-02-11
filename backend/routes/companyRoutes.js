import express from 'express';
import { body } from 'express-validator';
import * as companyController from '../controllers/companyController.js';
import { protect } from '../middleware/auth.js';
import { coordinatorOnly } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Public: list published companies (for experience filter, etc.)
router.get('/published', companyController.getPublishedCompanies);

router.use(protect);
router.use(coordinatorOnly);

router.post(
  '/',
  [
    body('name').trim().notEmpty(),
    body('academicYear').trim().notEmpty(),
  ],
  validate,
  companyController.createCompany
);
router.get('/', companyController.getCompanies);
router.get('/:id', companyController.getCompanyById);
router.put('/:id', companyController.updateCompany);
router.patch('/:id/publish', companyController.publishCompany);
router.delete('/:id', companyController.deleteCompany);

export default router;
