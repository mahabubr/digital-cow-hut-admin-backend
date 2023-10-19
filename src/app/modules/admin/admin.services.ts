import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { TAdmin, TLoginAdmin } from './admin.interface';
import { Admin } from './admin.model';
import bcrypt from 'bcrypt';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { JwtHelper } from '../../../helpers/jwtHelpers';

const createAdmin = async (payload: TAdmin): Promise<TAdmin> => {
  const result = await Admin.create(payload);
  return result;
};

const loginAdmin = async (payload: TLoginAdmin) => {
  const { password, phoneNumber } = payload;

  // check user exist
  const isExistAdmin = await Admin.findOne(
    { phoneNumber },
    { password: 1, role: 1, phoneNumber: 1 }
  );

  if (!isExistAdmin) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin Not Found');
  }

  // matched password
  const isPasswordMatched = await bcrypt.compare(
    password,
    isExistAdmin.password
  );

  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  // create refresh and access token
  const accessToken = JwtHelper.createToken(
    { id: isExistAdmin._id, role: isExistAdmin.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = JwtHelper.createToken(
    { id: isExistAdmin._id, role: isExistAdmin.role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const AdminServices = {
  createAdmin,
  loginAdmin,
};
