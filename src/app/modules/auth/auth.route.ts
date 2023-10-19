import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = express.Router();

router.post(
  '/signup',
  validateRequest(AuthValidation.createUserZodScheme),
  AuthController.createUser
);

router.post(
  '/login',
  validateRequest(AuthValidation.loginAuthZodSchema),
  AuthController.LoginUser
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshToken
);

export const AuthRouter = router;
