import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { verifyToken } from '../utils/jwt';
import { errorResponse } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpStatus';
import { MESSAGES } from '../constants/messages';

/**
 * Authentication middleware
 * Verifies JWT token and attaches user info to request
 */
export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            errorResponse(res, MESSAGES.TOKEN_MISSING, HTTP_STATUS.UNAUTHORIZED);
            return;
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        try {
            const decoded = verifyToken(token);
            req.user = decoded;
            next();
        } catch (error) {
            errorResponse(res, MESSAGES.TOKEN_INVALID, HTTP_STATUS.UNAUTHORIZED);
            return;
        }
    } catch (error) {
        errorResponse(res, MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
        return;
    }
};
