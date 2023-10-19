'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.UserRouter = void 0;
const express_1 = __importDefault(require('express'));
const role_1 = require('../../../enum/role');
const validateRequest_1 = __importDefault(
  require('../../middleware/validateRequest')
);
const user_controller_1 = require('./user.controller');
const user_validation_1 = require('./user.validation');
const auth_1 = __importDefault(require('../../middleware/auth'));
const router = express_1.default.Router();
router.get(
  '/',
  (0, auth_1.default)(role_1.ENUM_ROLE.ADMIN),
  user_controller_1.UserController.getAllUsers
);
router.get(
  '/:id',
  (0, auth_1.default)(role_1.ENUM_ROLE.ADMIN),
  user_controller_1.UserController.getSingleUser
);
router.patch(
  '/:id',
  (0, auth_1.default)(role_1.ENUM_ROLE.ADMIN),
  (0, validateRequest_1.default)(
    user_validation_1.UserValidation.updateUserZodSchema
  ),
  user_controller_1.UserController.updateUser
);
router.delete(
  '/:id',
  (0, auth_1.default)(role_1.ENUM_ROLE.ADMIN),
  user_controller_1.UserController.deleteUser
);
exports.UserRouter = router;
