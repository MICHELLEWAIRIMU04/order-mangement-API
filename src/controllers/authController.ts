import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthService } from '../services/authService';
import { loginSchema } from '../validators/authValidators';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';

export class AuthController {
  private authService = new AuthService();

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: User login
   *     description: Authenticate user and return JWT token
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: admin@example.com
   *               password:
   *                 type: string
   *                 example: admin123
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     token:
   *                       type: string
   *                     user:
   *                       type: object
   *                       properties:
   *                         id:
   *                           type: string
   *                         email:
   *                           type: string
   *                         name:
   *                           type: string
   *                 message:
   *                   type: string
   *                   example: Login successful
   *       400:
   *         description: Validation error
   *       401:
   *         description: Invalid credentials
   */
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