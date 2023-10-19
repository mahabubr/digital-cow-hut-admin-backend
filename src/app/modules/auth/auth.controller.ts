import { Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../../config';
import catAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { TUser } from '../user/user.interface';
import { AuthServices } from './auth.services';

const createUser = catAsync(async (req: Request, res: Response) => {
  const { ...userData } = req.body;

  const result = await AuthServices.createUser(userData);

  sendResponse<TUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users created successfully',
    data: result,
  });
});

const LoginUser = catAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;

  const result = await AuthServices.LoginUser(loginData);

  const { accessToken, refreshToken } = result;

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    data: { accessToken },
  });
});

const refreshToken = catAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AuthServices.refreshToken(refreshToken);

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'New access token generated successfully',
    data: result,
  });
});

export const AuthController = {
  createUser,
  LoginUser,
  refreshToken,
};
