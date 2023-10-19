'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.UserValidation = void 0;
const zod_1 = require('zod');
const updateUserZodSchema = zod_1.z.object({
  body: zod_1.z.object({
    phoneNumber: zod_1.z.string().optional(),
    role: zod_1.z.string().optional(),
    password: zod_1.z.string().optional(),
    name: zod_1.z
      .object({
        firstName: zod_1.z.string().optional(),
        lastName: zod_1.z.string().optional(),
      })
      .optional(),
    address: zod_1.z.string().optional(),
    budget: zod_1.z.number().optional(),
    income: zod_1.z.number().optional(),
  }),
});
exports.UserValidation = {
  updateUserZodSchema,
};
