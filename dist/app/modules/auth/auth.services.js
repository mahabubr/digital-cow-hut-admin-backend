'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.AuthServices = void 0;
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
const bcrypt_1 = __importDefault(require('bcrypt'));
const http_status_1 = __importDefault(require('http-status'));
const config_1 = __importDefault(require('../../../config'));
const ApiError_1 = __importDefault(require('../../../errors/ApiError'));
const jwtHelpers_1 = require('../../../helpers/jwtHelpers');
const user_model_1 = require('../user/user.model');
const createUser = payload =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.create(payload);
    return result;
  });
const LoginUser = payload =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { password, phoneNumber } = payload;
    // check user exist
    const isExistUser = yield user_model_1.User.findOne(
      { phoneNumber },
      { password: 1, role: 1, phoneNumber: 1 }
    );
    if (!isExistUser) {
      throw new ApiError_1.default(
        http_status_1.default.NOT_FOUND,
        'User Not Found'
      );
    }
    // matched password
    const isPasswordMatched = yield bcrypt_1.default.compare(
      password,
      isExistUser.password
    );
    if (!isPasswordMatched) {
      throw new ApiError_1.default(
        http_status_1.default.UNAUTHORIZED,
        'Password not matched'
      );
    }
    // create refresh and access token
    const accessToken = jwtHelpers_1.JwtHelper.createToken(
      { id: isExistUser._id, role: isExistUser.role },
      config_1.default.jwt.secret,
      config_1.default.jwt.expires_in
    );
    const refreshToken = jwtHelpers_1.JwtHelper.createToken(
      { id: isExistUser._id, role: isExistUser.role },
      config_1.default.jwt.refresh_secret,
      config_1.default.jwt.refresh_expires_in
    );
    return {
      accessToken,
      refreshToken,
    };
  });
const refreshToken = token =>
  __awaiter(void 0, void 0, void 0, function* () {
    let verifyToken = null;
    try {
      verifyToken = jwtHelpers_1.JwtHelper.verifyToken(
        token,
        config_1.default.jwt.refresh_secret
      );
    } catch (error) {
      throw new ApiError_1.default(
        http_status_1.default.FORBIDDEN,
        'Invalid refresh token'
      );
    }
    const { id } = verifyToken;
    // checking user exist
    const isUserExist = yield user_model_1.User.findOne(
      { _id: id },
      { role: 1, password: 1, phoneNumber: 1 }
    );
    if (!isUserExist) {
      throw new ApiError_1.default(
        http_status_1.default.NOT_FOUND,
        'User does not exist'
      );
    }
    // generate new token
    const newAccessToken = jwtHelpers_1.JwtHelper.createToken(
      { id: isUserExist.id, role: isUserExist.role },
      config_1.default.jwt.secret,
      config_1.default.jwt.expires_in
    );
    return {
      accessToken: newAccessToken,
    };
  });
exports.AuthServices = {
  createUser,
  LoginUser,
  refreshToken,
};
