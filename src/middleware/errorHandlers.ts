import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';

export const errorHandler = (
  error: Error | ApiError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error for debugging
  logger.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    user: req.user?.userId,
  });

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const validationErrors = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: validationErrors,
      },
    });
    return;
  }

  // Handle custom API errors
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        ...(error.details && { details: error.details }),
      },
    });
    return;
  }

  // Handle Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    const prismaError = error as any;
    
    switch (prismaError.code) {
      case 'P2002':
        res.status(409).json({
          success: false,
          error: {
            code: 'UNIQUE_CONSTRAINT_VIOLATION',
            message: 'A record with this value already exists',
            details: { field: prismaError.meta?.target?.[0] },
          },
        });
        return;
      
      case 'P2025':
        res.status(404).json({
          success: false,
          error: {
            code: 'RECORD_NOT_FOUND',
            message: 'Record not found',
          },
        });
        return;
      
      default:
        res.status(500).json({
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Database operation failed',
          },
        });
        return;
    }
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid authentication token',
      },
    });
    return;
  }

  if (error.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      error: {
        code: 'TOKEN_EXPIRED',
        message: 'Authentication token has expired',
      },
    });
    return;
  }

  // Handle generic errors
  const statusCode = process.env.NODE_ENV === 'production' ? 500 : 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : error.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    },
  });
};