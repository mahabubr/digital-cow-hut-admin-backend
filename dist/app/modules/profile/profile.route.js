'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.ProfileRouter = void 0;
const express_1 = __importDefault(require('express'));
const profile_controller_1 = require('./profile.controller');
const auth_1 = __importDefault(require('../../middleware/auth'));
const role_1 = require('../../../enum/role');
const route = express_1.default.Router();
route.get(
  '/my-profile',
  (0, auth_1.default)(
    role_1.ENUM_ROLE.ADMIN,
    role_1.ENUM_ROLE.BUYER,
    role_1.ENUM_ROLE.SELLER
  ),
  profile_controller_1.ProfileController.getProfile
);
route.patch(
  '/my-profile',
  (0, auth_1.default)(
    role_1.ENUM_ROLE.ADMIN,
    role_1.ENUM_ROLE.BUYER,
    role_1.ENUM_ROLE.SELLER
  ),
  profile_controller_1.ProfileController.updateProfile
);
exports.ProfileRouter = route;
