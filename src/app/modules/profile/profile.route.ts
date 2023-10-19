import express from 'express';
import { ProfileController } from './profile.controller';
import auth from '../../middleware/auth';
import { ENUM_ROLE } from '../../../enum/role';

const route = express.Router();

route.get(
  '/my-profile',
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.BUYER, ENUM_ROLE.SELLER),
  ProfileController.getProfile
);

route.patch(
  '/my-profile',
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.BUYER, ENUM_ROLE.SELLER),
  ProfileController.updateProfile
);

export const ProfileRouter = route;
