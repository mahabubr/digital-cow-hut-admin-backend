import { Request, Response } from 'express';
import catAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { TUser } from '../user/user.interface';
import { ProfileServices } from './profile.services';

const getProfile = catAsync(async (req: Request, res: Response) => {
  const id = req.user?.id;

  const result = await ProfileServices.getProfile(id);

  sendResponse<TUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users information retrieved successfully',
    data: result,
  });
});

const updateProfile = catAsync(async (req: Request, res: Response) => {
  const id = req.user?.id;
  const updatedData = req.body;

  const result = await ProfileServices.updateProfile(id, updatedData);

  sendResponse<TUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users information updated successfully',
    data: result,
  });
});

export const ProfileController = {
  getProfile,
  updateProfile,
};
