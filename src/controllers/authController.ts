import { Request, Response } from 'express';
import { User } from '../models/User';
import { LoginHistory } from '../models/LoginHistory';
import { comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { successResponse, errorResponse } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpStatus';
import { MESSAGES } from '../constants/messages';
import { SignupRequest, LoginRequest } from '../types';

/**
 * Auth Controller - handles authentication operations with Sequelize
 */
export class AuthController {
    /**
     * Signup - Create a new user account
     * POST /api/auth/signup
     */
    static async signup(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, password } = req.body as SignupRequest;

            // Check if user already exists
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                errorResponse(
                    res,
                    MESSAGES.EMAIL_ALREADY_EXISTS,
                    HTTP_STATUS.BAD_REQUEST
                );
                return;
            }

            // Create new user (password will be hashed automatically by model hook)
            const user = await User.create({ name, email, password });

            // Return user data without password (handled by toJSON)
            successResponse(
                res,
                user.toJSON(),
                MESSAGES.USER_CREATED,
                HTTP_STATUS.CREATED
            );
        } catch (error) {
            console.error('Signup error:', error);
            errorResponse(res, MESSAGES.INTERNAL_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Login - Authenticate user and return JWT token
     * POST /api/auth/login
     */
    static async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body as LoginRequest;

            // Find user by email
            const user = await User.findOne({ where: { email } });
            if (!user) {
                errorResponse(
                    res,
                    MESSAGES.INVALID_CREDENTIALS,
                    HTTP_STATUS.UNAUTHORIZED
                );
                return;
            }

            // Verify password
            const isPasswordValid = await comparePassword(password, user.password);
            if (!isPasswordValid) {
                errorResponse(
                    res,
                    MESSAGES.INVALID_CREDENTIALS,
                    HTTP_STATUS.UNAUTHORIZED
                );
                return;
            }

            // Generate JWT token
            const token = generateToken({
                userId: user.id,
                email: user.email,
            });

            // Record login history
            await LoginHistory.create({ userId: user.id });

            // Return user data without password
            successResponse(
                res,
                {
                    token,
                    user: user.toJSON(),
                },
                MESSAGES.LOGIN_SUCCESS,
                HTTP_STATUS.OK
            );
        } catch (error) {
            console.error('Login error:', error);
            errorResponse(res, MESSAGES.INTERNAL_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }
}
