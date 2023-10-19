/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { JwtHelper } from '../../../helpers/jwtHelpers';
import { TUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';

const createUser = async (payload: TUser): Promise<TUser> => {
  const result = await User.create(payload);
  return result;
};

const LoginUser = async (payload: TLoginUser) => {
  const { password, phoneNumber } = payload;

  // check user exist
  const isExistUser = await User.findOne(
    { phoneNumber },
    { password: 1, role: 1, phoneNumber: 1 }
  );

  if (!isExistUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found');
  }

  // matched password
  const isPasswordMatched = await bcrypt.compare(
    password,
    isExistUser.password
  );

  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password not matched');
  }

  // create refresh and access token
  const accessToken = JwtHelper.createToken(
    { id: isExistUser._id, role: isExistUser.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = JwtHelper.createToken(
    { id: isExistUser._id, role: isExistUser.role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  let verifyToken = null;

  try {
    verifyToken = JwtHelper.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid refresh token');
  }

  const { id } = verifyToken;

  // checking user exist
  const isUserExist = await User.findOne(
    { _id: id },
    { role: 1, password: 1, phoneNumber: 1 }
  );

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // generate new token
  const newAccessToken = JwtHelper.createToken(
    { id: isUserExist.id, role: isUserExist.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthServices = {
  createUser,
  LoginUser,
  refreshToken,
};
