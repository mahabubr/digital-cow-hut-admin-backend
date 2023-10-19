import { Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../../config';
import catAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { TAdmin } from './admin.interface';
import { AdminServices } from './admin.services';

const createAdmin = catAsync(async (req: Request, res: Response) => {
  const { ...userData } = req.body;

  const result = await AdminServices.createAdmin(userData);

  sendResponse<TAdmin>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin created successfully',
    data: result,
  });
});

const loginAdmin = catAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;

  const result = await AdminServices.loginAdmin(loginData);

  const { accessToken, refreshToken } = result;

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refresh-token', refreshToken, cookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    data: { accessToken },
  });
});

export const AdminController = {
  createAdmin,
  loginAdmin,
};
