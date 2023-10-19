import express from 'express';
import { ENUM_ROLE } from '../../../enum/role';
import auth from '../../middleware/auth';
import { OrderController } from './order.controller';

const router = express.Router();

router.post('/', auth(ENUM_ROLE.BUYER), OrderController.createOrder);
router.get(
  '/',
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.BUYER, ENUM_ROLE.SELLER),
  OrderController.getAllOrders
);
router.get(
  '/:id',
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.BUYER, ENUM_ROLE.SELLER),
  OrderController.getSingleOrder
);

export const OrderRouter = router;
