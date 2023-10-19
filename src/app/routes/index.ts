import express from 'express';
import { AdminRouter } from '../modules/admin/admin.route';
import { AuthRouter } from '../modules/auth/auth.route';
import { CowRouter } from '../modules/cow/cow.route';
import { OrderRouter } from '../modules/order/order.route';
import { ProfileRouter } from '../modules/profile/profile.route';
import { UserRouter } from '../modules/user/user.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRouter,
  },
  {
    path: '/cows',
    route: CowRouter,
  },
  {
    path: '/orders',
    route: OrderRouter,
  },
  {
    path: '/admins',
    route: AdminRouter,
  },
  {
    path: '/auth',
    route: AuthRouter,
  },
  {
    path: '/profile',
    route: ProfileRouter,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
