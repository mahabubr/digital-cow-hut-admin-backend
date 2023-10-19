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
exports.AdminServices = void 0;
const http_status_1 = __importDefault(require('http-status'));
const ApiError_1 = __importDefault(require('../../../errors/ApiError'));
const admin_model_1 = require('./admin.model');
const bcrypt_1 = __importDefault(require('bcrypt'));
const config_1 = __importDefault(require('../../../config'));
const jwtHelpers_1 = require('../../../helpers/jwtHelpers');
const createAdmin = payload =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_model_1.Admin.create(payload);
    return result;
  });
const loginAdmin = payload =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { password, phoneNumber } = payload;
    // check user exist
    const isExistAdmin = yield admin_model_1.Admin.findOne(
      { phoneNumber },
      { password: 1, role: 1, phoneNumber: 1 }
    );
    if (!isExistAdmin) {
      throw new ApiError_1.default(
        http_status_1.default.NOT_FOUND,
        'Admin Not Found'
      );
    }
    // matched password
    const isPasswordMatched = yield bcrypt_1.default.compare(
      password,
      isExistAdmin.password
    );
    if (!isPasswordMatched) {
      throw new ApiError_1.default(
        http_status_1.default.UNAUTHORIZED,
        'Password is incorrect'
      );
    }
    // create refresh and access token
    const accessToken = jwtHelpers_1.JwtHelper.createToken(
      { id: isExistAdmin._id, role: isExistAdmin.role },
      config_1.default.jwt.secret,
      config_1.default.jwt.expires_in
    );
    const refreshToken = jwtHelpers_1.JwtHelper.createToken(
      { id: isExistAdmin._id, role: isExistAdmin.role },
      config_1.default.jwt.refresh_secret,
      config_1.default.jwt.refresh_expires_in
    );
    return {
      accessToken,
      refreshToken,
    };
  });
exports.AdminServices = {
  createAdmin,
  loginAdmin,
};
