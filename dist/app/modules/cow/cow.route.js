'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.CowRouter = void 0;
const express_1 = __importDefault(require('express'));
const role_1 = require('../../../enum/role');
const auth_1 = __importDefault(require('../../middleware/auth'));
const validateRequest_1 = __importDefault(
  require('../../middleware/validateRequest')
);
const cow_controller_1 = require('./cow.controller');
const cow_validation_1 = require('./cow.validation');
const router = express_1.default.Router();
router.post(
  '/',
  (0, auth_1.default)(role_1.ENUM_ROLE.SELLER),
  (0, validateRequest_1.default)(
    cow_validation_1.CowValidation.createCowZodSchema
  ),
  cow_controller_1.CowController.createCow
);
router.get(
  '/',
  (0, auth_1.default)(
    role_1.ENUM_ROLE.SELLER,
    role_1.ENUM_ROLE.ADMIN,
    role_1.ENUM_ROLE.BUYER
  ),
  cow_controller_1.CowController.getAllCows
);
router.get(
  '/:id',
  (0, auth_1.default)(
    role_1.ENUM_ROLE.SELLER,
    role_1.ENUM_ROLE.ADMIN,
    role_1.ENUM_ROLE.BUYER
  ),
  cow_controller_1.CowController.getSingleCow
);
router.patch(
  '/:id',
  (0, auth_1.default)(role_1.ENUM_ROLE.SELLER),
  (0, validateRequest_1.default)(
    cow_validation_1.CowValidation.updateCowZodSchema
  ),
  cow_controller_1.CowController.updateCow
);
router.delete(
  '/:id',
  (0, auth_1.default)(role_1.ENUM_ROLE.SELLER),
  cow_controller_1.CowController.deleteCow
);
exports.CowRouter = router;
