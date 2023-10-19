import { Model } from 'mongoose';

type TUserName = {
  firstName: string;
  lastName: string;
};

export type TUser = {
  id: string;
  phoneNumber: string;
  role: 'seller' | 'buyer';
  password: string;
  name: TUserName;
  address: string;
  budget: number;
  income: number;
};

export type UserModel = Model<TUser, Record<string, unknown>>;
