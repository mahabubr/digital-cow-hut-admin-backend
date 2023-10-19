import httpStatus from 'http-status';
import { TUser } from '../user/user.interface';
import { User } from '../user/user.model';
import ApiError from '../../../errors/ApiError';

const getProfile = async (id: string) => {
  const result = await User.findById(id);
  return result;
};

const updateProfile = async (id: string, payload: Partial<TUser>) => {
  const isExist = await User.findOne({ _id: id });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found');
  }

  const { name, ...userData } = payload;

  const updatedUserData: Partial<TUser> = { ...userData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<TUser>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (updatedUserData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await User.findOneAndUpdate({ _id: id }, updatedUserData, {
    new: true,
  });

  return result;
};

export const ProfileServices = {
  getProfile,
  updateProfile,
};
