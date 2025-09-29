import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import { JwtPayload } from '../types/';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'UNAUTHORIZED', 'Access token required');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      throw new ApiError(401, 'UNAUTHORIZED', 'Access token required');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      req.user = decoded;
      next();
    } catch (jwtError) {
      if (jwtError instanceof jwt.TokenExpiredError) {
        throw new ApiError(401, 'TOKEN_EXPIRED', 'Token has expired');
      } else if (jwtError instanceof jwt.JsonWebTokenError) {
        throw new ApiError(401, 'INVALID_TOKEN', 'Invalid token');
      } else {
        throw new ApiError(401, 'UNAUTHORIZED', 'Token verification failed');
      }
    }
  } catch (error) {
    next(error);
  }
};