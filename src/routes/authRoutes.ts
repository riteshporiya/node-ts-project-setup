import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validate } from '../middlewares/validate';
import { signupSchema, loginSchema } from '../utils/validation';

const router = Router();

/**
 * POST /api/auth/signup
 * Create a new user account
 */
router.post('/signup', validate(signupSchema), AuthController.signup);

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
router.post('/login', validate(loginSchema), AuthController.login);

export default router;
