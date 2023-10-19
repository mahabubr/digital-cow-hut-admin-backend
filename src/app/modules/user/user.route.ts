import express from 'express';
import { ENUM_ROLE } from '../../../enum/role';
import validateRequest from '../../middleware/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import auth from '../../middleware/auth';

const router = express.Router();

router.get('/', auth(ENUM_ROLE.ADMIN), UserController.getAllUsers);
router.get('/:id', auth(ENUM_ROLE.ADMIN), UserController.getSingleUser);
router.patch(
  '/:id',
  auth(ENUM_ROLE.ADMIN),
  validateRequest(UserValidation.updateUserZodSchema),
  UserController.updateUser
);
router.delete('/:id', auth(ENUM_ROLE.ADMIN), UserController.deleteUser);

export const UserRouter = router;
