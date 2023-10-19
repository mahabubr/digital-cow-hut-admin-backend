import { Schema, model } from 'mongoose';
import { OrderModel, TOrder } from './order.interface';

const orderSchema = new Schema<TOrder, OrderModel>(
  {
    cow: { type: Schema.Types.ObjectId, required: true, ref: 'Cow' },
    buyer: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Order = model<TOrder, OrderModel>('Orders', orderSchema);
