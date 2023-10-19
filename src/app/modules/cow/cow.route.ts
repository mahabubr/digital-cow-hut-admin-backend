import express from 'express';
import { ENUM_ROLE } from '../../../enum/role';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { CowController } from './cow.controller';
import { CowValidation } from './cow.validation';

const router = express.Router();

router.post(
  '/',
  auth(ENUM_ROLE.SELLER),
  validateRequest(CowValidation.createCowZodSchema),
  CowController.createCow
);

router.get(
  '/',
  auth(ENUM_ROLE.SELLER, ENUM_ROLE.ADMIN, ENUM_ROLE.BUYER),
  CowController.getAllCows
);
router.get(
  '/:id',
  auth(ENUM_ROLE.SELLER, ENUM_ROLE.ADMIN, ENUM_ROLE.BUYER),
  CowController.getSingleCow
);
router.patch(
  '/:id',
  auth(ENUM_ROLE.SELLER),
  validateRequest(CowValidation.updateCowZodSchema),
  CowController.updateCow
);
router.delete('/:id', auth(ENUM_ROLE.SELLER), CowController.deleteCow);

export const CowRouter = router;
