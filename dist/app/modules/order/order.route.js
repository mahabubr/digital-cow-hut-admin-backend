'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.OrderRouter = void 0;
const express_1 = __importDefault(require('express'));
const role_1 = require('../../../enum/role');
const auth_1 = __importDefault(require('../../middleware/auth'));
const order_controller_1 = require('./order.controller');
const router = express_1.default.Router();
router.post(
  '/',
  (0, auth_1.default)(role_1.ENUM_ROLE.BUYER),
  order_controller_1.OrderController.createOrder
);
router.get(
  '/',
  (0, auth_1.default)(
    role_1.ENUM_ROLE.ADMIN,
    role_1.ENUM_ROLE.BUYER,
    role_1.ENUM_ROLE.SELLER
  ),
  order_controller_1.OrderController.getAllOrders
);
router.get(
  '/:id',
  (0, auth_1.default)(
    role_1.ENUM_ROLE.ADMIN,
    role_1.ENUM_ROLE.BUYER,
    role_1.ENUM_ROLE.SELLER
  ),
  order_controller_1.OrderController.getSingleOrder
);
exports.OrderRouter = router;
