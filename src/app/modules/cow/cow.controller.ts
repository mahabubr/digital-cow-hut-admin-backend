import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { cowFilterableFields } from './cow.constants';
import { TCow } from './cow.interface';
import { CowServices } from './cow.services';

const createCow = catAsync(async (req: Request, res: Response) => {
  const { ...cowData } = req.body;

  const result = await CowServices.createCow(cowData);

  sendResponse<TCow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow created successfully',
    data: result,
  });
});

const getAllCows = catAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);
  const filters = pick(req.query, cowFilterableFields);

  const result = await CowServices.getAllCow(paginationOptions, filters);

  sendResponse<TCow[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cows retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleCow = catAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await CowServices.getSingleCow(id);

  sendResponse<TCow | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow retrieved successfully',
    data: result,
  });
});

const updateCow = catAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body;

  const requestId = req.user?.id;

  const result = await CowServices.updateCow(id, updatedData, requestId);

  sendResponse<TCow | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow updated successfully',
    data: result,
  });
});

const deleteCow = catAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const requestId = req.user?.id;

  const result = await CowServices.deleteCow(id, requestId);

  sendResponse<TCow | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow deleted successfully',
    data: result,
  });
});

export const CowController = {
  createCow,
  getAllCows,
  getSingleCow,
  updateCow,
  deleteCow,
};
