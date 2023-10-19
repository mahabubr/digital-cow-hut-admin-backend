'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.OrderServices = void 0;
const mongoose_1 = __importDefault(require('mongoose'));
const ApiError_1 = __importDefault(require('../../../errors/ApiError'));
const cow_model_1 = require('../cow/cow.model');
const user_model_1 = require('../user/user.model');
const order_model_1 = require('./order.model');
const createOrder = payload =>
  __awaiter(void 0, void 0, void 0, function* () {
    const cow = yield cow_model_1.Cow.findById({ _id: payload.cow });
    const buyer = yield user_model_1.User.findById({ _id: payload.buyer });
    if (
      (buyer === null || buyer === void 0 ? void 0 : buyer.role) !== 'buyer'
    ) {
      throw new ApiError_1.default(400, 'Buyer Not Found');
    }
    if (!cow || cow.price === undefined) {
      throw new ApiError_1.default(500, "The cow's price is not defined");
    }
    if (
      (buyer === null || buyer === void 0 ? void 0 : buyer.budget) < cow.price
    ) {
      throw new ApiError_1.default(
        500,
        "You don't have enough money to buy the cow"
      );
    }
    let newOrderData = null;
    const session = yield mongoose_1.default.startSession();
    try {
      yield session.startTransaction();
      cow.label = 'sold out';
      const newCow = yield cow_model_1.Cow.findOneAndUpdate(
        { _id: payload.cow },
        cow,
        {
          session,
        }
      );
      if (!newCow) {
        throw new ApiError_1.default(350, 'Not Updated');
      }
      buyer.budget -= cow.price;
      const newBuyer = yield user_model_1.User.findOneAndUpdate(
        { _id: payload.buyer },
        buyer,
        { session }
      );
      if (!newBuyer) {
        throw new ApiError_1.default(350, 'Not Updated');
      }
      const seller = yield user_model_1.User.findById(cow.seller);
      if (seller) {
        seller.income += cow.price;
        const newSeller = yield user_model_1.User.findOneAndUpdate(
          { _id: cow.seller },
          seller,
          { session }
        );
        if (!newSeller) {
          throw new ApiError_1.default(350, 'Not Updated');
        }
      }
      newOrderData = (yield (yield (yield order_model_1.Order.create(
        payload
      )).populate('cow')).populate('cow.seller')).populate('buyer');
      yield session.commitTransaction();
      yield session.endSession();
    } catch (error) {
      yield session.abortTransaction();
      yield session.endSession();
      throw error;
    }
    return newOrderData;
  });
const getAllOrders = responseData =>
  __awaiter(void 0, void 0, void 0, function* () {
    if (
      (responseData === null || responseData === void 0
        ? void 0
        : responseData.role) === 'buyer'
    ) {
      return yield order_model_1.Order.find({ buyer: responseData.id })
        .populate('cow')
        .populate('buyer')
        .populate('cow.seller');
    }
    if (
      (responseData === null || responseData === void 0
        ? void 0
        : responseData.role) === 'seller'
    ) {
      yield order_model_1.Order.findOne({ 'cow.seller': responseData.id })
        .populate('cow')
        .populate('buyer')
        .populate('cow.seller');
    }
    const result = yield order_model_1.Order.find({})
      .populate('cow')
      .populate('buyer')
      .populate('cow.seller');
    return result;
  });
const getSingleOrder = (id, responseData) =>
  __awaiter(void 0, void 0, void 0, function* () {
    if (
      (responseData === null || responseData === void 0
        ? void 0
        : responseData.role) === 'buyer'
    ) {
      return yield order_model_1.Order.findOne({ buyer: responseData.id })
        .populate('cow')
        .populate('buyer')
        .populate('cow.seller');
    }
    if (
      (responseData === null || responseData === void 0
        ? void 0
        : responseData.role) === 'seller'
    ) {
      yield order_model_1.Order.findOne({ 'cow.seller': responseData.id })
        .populate('cow')
        .populate('buyer')
        .populate('cow.seller');
    }
    const result = yield order_model_1.Order.findById(id)
      .populate('cow')
      .populate('buyer')
      .populate('cow.seller');
    return result;
  });
exports.OrderServices = {
  createOrder,
  getAllOrders,
  getSingleOrder,
};
