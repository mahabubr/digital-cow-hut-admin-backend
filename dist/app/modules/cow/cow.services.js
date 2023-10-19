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
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.CowServices = void 0;
const http_status_1 = __importDefault(require('http-status'));
const ApiError_1 = __importDefault(require('../../../errors/ApiError'));
const paginationHelper_1 = require('../../../helpers/paginationHelper');
const cow_constants_1 = require('./cow.constants');
const cow_model_1 = require('./cow.model');
const createCow = payload =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cow_model_1.Cow.create(payload);
    return result;
  });
const getAllCow = (paginationOptions, filters) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters,
      filterData = __rest(filters, ['searchTerm']);
    // Pagination
    const { limit, page, skip, sortBy, sortOrder } =
      paginationHelper_1.paginationHelpers.calculatePagination(
        paginationOptions
      );
    const sortConditions = {};
    if (sortBy && sortOrder) {
      sortConditions[sortBy] = sortOrder;
    }
    // Search and Filters
    const andCondition = [];
    if (searchTerm) {
      const searchConditions = cow_constants_1.CowSearchableFields.map(
        field => ({
          [field]: {
            $regex: searchTerm,
            $options: 'i',
          },
        })
      );
      andCondition.push({ $or: searchConditions });
    }
    if (Object.keys(filterData).length) {
      const filterConditions = Object.entries(filterData).map(
        ([field, value]) => {
          if (field === 'location') {
            return {
              location: {
                $regex: value,
                $options: 'i',
              },
            };
          } else if (field === 'minPrice') {
            return {
              price: {
                $gte: value,
              },
            };
          } else if (field === 'maxPrice') {
            return {
              price: {
                $lte: value,
              },
            };
          }
          // Handle other fields if needed
          return undefined; // Return undefined for unsupported fields
        }
      );
      const validFilterConditions = filterConditions.filter(
        condition => condition !== undefined
      );
      andCondition.push(...validFilterConditions);
    }
    const whereConditions =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const result = yield cow_model_1.Cow.find(whereConditions)
      .populate('seller')
      .sort(sortConditions)
      .skip(skip)
      .limit(limit);
    const total = yield cow_model_1.Cow.countDocuments(whereConditions);
    return {
      meta: {
        page,
        limit,
        total,
      },
      data: result,
    };
  });
const getSingleCow = id =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cow_model_1.Cow.findById(id).populate('seller');
    return result;
  });
const updateCow = (id, payload, requestId) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield cow_model_1.Cow.findOne({ _id: id }).populate(
      'seller'
    );
    if (!isExist) {
      throw new ApiError_1.default(
        http_status_1.default.NOT_FOUND,
        'Cow Not Found'
      );
    }
    // check seller exist
    const sellerId = isExist.seller.id;
    if (requestId !== sellerId) {
      throw new ApiError_1.default(
        http_status_1.default.UNAUTHORIZED,
        'Your are not authorized'
      );
    }
    const cowData = __rest(payload, []);
    const updatedUserData = Object.assign({}, cowData);
    const result = yield cow_model_1.Cow.findOneAndUpdate(
      { _id: id },
      updatedUserData,
      {
        new: true,
      }
    ).populate('seller');
    return result;
  });
const deleteCow = (id, requestId) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield cow_model_1.Cow.findOne({ _id: id }).populate(
      'seller'
    );
    if (!isExist) {
      throw new ApiError_1.default(
        http_status_1.default.NOT_FOUND,
        'Cow Not Found'
      );
    }
    // check seller exist
    const sellerId = isExist.seller.id;
    if (requestId !== sellerId) {
      throw new ApiError_1.default(
        http_status_1.default.UNAUTHORIZED,
        'Your are not authorized'
      );
    }
    const result = yield cow_model_1.Cow.findByIdAndDelete(id).populate(
      'seller'
    );
    return result;
  });
exports.CowServices = {
  createCow,
  getAllCow,
  getSingleCow,
  updateCow,
  deleteCow,
};
