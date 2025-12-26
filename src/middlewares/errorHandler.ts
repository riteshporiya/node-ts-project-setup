import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpStatus';
import { MESSAGES } from '../constants/messages';
import { config } from '../config/env';

/**
 * Global error handling middleware
 */
export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    // Log error in development
    if (config.nodeEnv === 'development') {
        console.error('Error:', err);
    }

    // Send error response
    errorResponse(
        res,
        err.message || MESSAGES.INTERNAL_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    errorResponse(
        res,
        `Route ${req.method} ${req.path} not found`,
        HTTP_STATUS.NOT_FOUND
    );
};
