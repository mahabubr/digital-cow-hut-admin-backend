import httpStatus from 'http-status';
import { FilterQuery, SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { TGenericResponse } from '../../../interfaces/common';
import { TPaginationOptions } from '../../../interfaces/pagination';
import { CowSearchableFields } from './cow.constants';
import { TCow, TCowFilter } from './cow.interface';
import { Cow } from './cow.model';

const createCow = async (payload: TCow): Promise<TCow> => {
  const result = await Cow.create(payload);
  return result;
};

const getAllCow = async (
  paginationOptions: TPaginationOptions,
  filters: TCowFilter
): Promise<TGenericResponse<TCow[]>> => {
  const { searchTerm, ...filterData } = filters;

  // Pagination
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  // Search and Filters
  const andCondition: FilterQuery<TCow>[] = [];

  if (searchTerm) {
    const searchConditions = CowSearchableFields.map(field => ({
      [field]: {
        $regex: searchTerm,
        $options: 'i',
      },
    }));

    andCondition.push({ $or: searchConditions });
  }

  if (Object.keys(filterData).length) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => {
        if (field === 'location') {
          return {
            location: {
              $regex: value as string,
              $options: 'i',
            },
          };
        } else if (field === 'minPrice') {
          return {
            price: {
              $gte: value as number,
            },
          };
        } else if (field === 'maxPrice') {
          return {
            price: {
              $lte: value as number,
            },
          };
        }
        // Handle other fields if needed
        return undefined; // Return undefined for unsupported fields
      }
    );

    const validFilterConditions = filterConditions.filter(
      condition => condition !== undefined
    ) as FilterQuery<TCow>[];

    andCondition.push(...validFilterConditions);
  }

  const whereConditions: FilterQuery<TCow> =
    andCondition.length > 0 ? { $and: andCondition } : {};

  const result = await Cow.find(whereConditions)
    .populate('seller')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Cow.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleCow = async (id: string | undefined): Promise<TCow | null> => {
  const result = await Cow.findById(id).populate('seller');
  return result;
};

const updateCow = async (
  id: string | undefined,
  payload: Partial<TCow>,
  requestId: string | undefined
): Promise<TCow | null> => {
  const isExist = await Cow.findOne({ _id: id }).populate('seller');
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cow Not Found');
  }

  // check seller exist
  const sellerId = isExist.seller.id;
  if (requestId !== sellerId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Your are not authorized');
  }

  const { ...cowData } = payload;

  const updatedUserData: Partial<TCow> = { ...cowData };

  const result = await Cow.findOneAndUpdate({ _id: id }, updatedUserData, {
    new: true,
  }).populate('seller');

  return result;
};

const deleteCow = async (
  id: string | undefined,
  requestId: string | undefined
): Promise<TCow | null> => {
  const isExist = await Cow.findOne({ _id: id }).populate('seller');
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cow Not Found');
  }

  // check seller exist
  const sellerId = isExist.seller.id;

  if (requestId !== sellerId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Your are not authorized');
  }
  const result = await Cow.findByIdAndDelete(id).populate('seller');

  return result;
};

export const CowServices = {
  createCow,
  getAllCow,
  getSingleCow,
  updateCow,
  deleteCow,
};
