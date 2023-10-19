import { Model } from 'mongoose';

type TUserName = {
  firstName: string;
  lastName: string;
};

export type TAdmin = {
  phoneNumber: string;
  role: 'admin';
  password: string;
  name: TUserName;
  address: string;
};

export type AdminModel = Model<TAdmin, Record<string, unknown>>;

export type TLoginAdmin = {
  phoneNumber: string;
  password: string;
};
