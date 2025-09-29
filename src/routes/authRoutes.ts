import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
const authController = new AuthController();

router.post('/login', asyncHandler(authController.login.bind(authController)));

export { router as authRoutes }

