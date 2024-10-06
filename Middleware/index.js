// middlewares/index.js
import asyncHandler from './asyncHandler.js';
import { protect, admin } from './authMiddleware.js';
import { errorHandler } from './errorMiddleware.js';

export { asyncHandler, protect, admin, errorHandler };
