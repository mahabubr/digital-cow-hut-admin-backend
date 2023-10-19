/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { TUser } from './user.interface';
import { User } from './user.model';

const getAllUser = async (): Promise<TUser[]> => {
  const result = await User.find({});
  return result;
};

const getSingleUser = async (id: string | undefined): Promise<TUser | null> => {
  const result = await User.findById(id);
  return result;
};

const updateUser = async (
  id: string | undefined,
  payload: Partial<TUser>
): Promise<TUser | null> => {
  const isExist = await User.findOne({ _id: id });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found');
  }

  const { name, ...userData } = payload;

  const updatedUserData: Partial<TUser> = { ...userData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<TUser>;
      (updatedUserData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await User.findOneAndUpdate({ _id: id }, updatedUserData, {
    new: true,
  });

  return result;
};

const deleteUser = async (id: string | undefined): Promise<TUser | null> => {
  const result = await User.findByIdAndDelete(id);
  return result;
};

export const UserServices = {
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
