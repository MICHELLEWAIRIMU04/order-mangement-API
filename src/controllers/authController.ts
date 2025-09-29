import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthService } from '../services/authService';
import { loginSchema } from '../validators/authValidators';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';

export class AuthController {
  private authService = new AuthService();


  async login(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const { email, password } = loginSchema.parse(req.body);

      // Find user by email
      const user = await this.authService.findUserByEmail(email);
      if (!user) {
        throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
      }

      // Generate JWT token
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET environment variable is not set');
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        jwtSecret,
        { expiresIn: '24h' }
      );

      logger.info(`User login successful: ${user.email}`);

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        },
        message: 'Login successful',
      });
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }
}