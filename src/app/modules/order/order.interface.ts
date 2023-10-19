import { Model, Types } from 'mongoose';
import { TCow } from '../cow/cow.interface';
import { TUser } from '../user/user.interface';

export type TOrder = {
  cow: Types.ObjectId | TCow;
  buyer: Types.ObjectId | TUser;
};

export type OrderModel = Model<TOrder, Record<string, unknown>>;
