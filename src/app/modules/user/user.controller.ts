import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { TUser } from './user.interface';
import { UserServices } from './user.services';

const getAllUsers = catAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllUser();

  sendResponse<TUser[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully',
    data: result,
  });
});

const getSingleUser = catAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await UserServices.getSingleUser(id);

  sendResponse<TUser | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

const updateUser = catAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body;

  const result = await UserServices.updateUser(id, updatedData);

  sendResponse<TUser | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

const deleteUser = catAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await UserServices.deleteUser(id);

  sendResponse<TUser | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

export const UserController = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
