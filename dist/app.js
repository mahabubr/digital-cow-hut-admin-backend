'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const cors_1 = __importDefault(require('cors'));
const express_1 = __importDefault(require('express'));
const globalErrorHandler_1 = __importDefault(
  require('./app/middleware/globalErrorHandler')
);
const routes_1 = __importDefault(require('./app/routes'));
const http_status_1 = __importDefault(require('http-status'));
const cookie_parser_1 = __importDefault(require('cookie-parser'));
const app = (0, express_1.default)();
// CORS
app.use((0, cors_1.default)());
// PARSER
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
// ROUTES
app.use('/api/v1/', routes_1.default);
// app.get('/',async (req: Request, res: Response, next: NextFunction) => {
//   throw new Error("Testing")
//   // next("THis i s Error")
// //   console.log(x);
// });
// Global Error Handler
app.use(globalErrorHandler_1.default);
// Handle Not Found Route
app.use((req, res, next) => {
  res.status(http_status_1.default.NOT_FOUND).json({
    success: false,
    message: 'Route Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'Api Not Found',
      },
    ],
  });
  next();
});
exports.default = app;
