import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { Cow } from '../cow/cow.model';
import { User } from '../user/user.model';
import { TOrder } from './order.interface';
import { Order } from './order.model';

const createOrder = async (payload: TOrder): Promise<TOrder> => {
  const cow = await Cow.findById({ _id: payload.cow });
  const buyer = await User.findById({ _id: payload.buyer });

  if (buyer?.role !== 'buyer') {
    throw new ApiError(400, 'Buyer Not Found');
  }

  if (!cow || cow.price === undefined) {
    throw new ApiError(500, "The cow's price is not defined");
  }

  if (buyer?.budget < cow.price) {
    throw new ApiError(500, "You don't have enough money to buy the cow");
  }

  let newOrderData = null;

  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    cow.label = 'sold out';

    const newCow = await Cow.findOneAndUpdate({ _id: payload.cow }, cow, {
      session,
    });

    if (!newCow) {
      throw new ApiError(350, 'Not Updated');
    }

    buyer.budget -= cow.price;

    const newBuyer = await User.findOneAndUpdate(
      { _id: payload.buyer },
      buyer,
      { session }
    );

    if (!newBuyer) {
      throw new ApiError(350, 'Not Updated');
    }

    const seller = await User.findById(cow.seller);
    if (seller) {
      seller.income += cow.price;
      const newSeller = await User.findOneAndUpdate(
        { _id: cow.seller },
        seller,
        { session }
      );

      if (!newSeller) {
        throw new ApiError(350, 'Not Updated');
      }
    }

    newOrderData = (
      await (
        await (await Order.create(payload)).populate('cow')
      ).populate('cow.seller')
    ).populate('buyer');

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  return newOrderData;
};

const getAllOrders = async (
  responseData: JwtPayload | null
): Promise<TOrder[]> => {
  if (responseData?.role === 'buyer') {
    return await Order.find({ buyer: responseData.id })
      .populate('cow')
      .populate('buyer')
      .populate('cow.seller');
  }

  if (responseData?.role === 'seller') {
    await Order.findOne({ 'cow.seller': responseData.id })
      .populate('cow')
      .populate('buyer')
      .populate('cow.seller');
  }

  const result = await Order.find({})
    .populate('cow')
    .populate('buyer')
    .populate('cow.seller');
  return result;
};

const getSingleOrder = async (id: string, responseData: JwtPayload | null) => {
  if (responseData?.role === 'buyer') {
    return await Order.findOne({ buyer: responseData.id })
      .populate('cow')
      .populate('buyer')
      .populate('cow.seller');
  }

  if (responseData?.role === 'seller') {
    await Order.findOne({ 'cow.seller': responseData.id })
      .populate('cow')
      .populate('buyer')
      .populate('cow.seller');
  }

  const result = await Order.findById(id)
    .populate('cow')
    .populate('buyer')
    .populate('cow.seller');
  return result;
};

export const OrderServices = {
  createOrder,
  getAllOrders,
  getSingleOrder,
};
