import { Response } from 'express';
import { ApiResponse } from '../types';
import { HTTP_STATUS } from '../constants/httpStatus';

/**
 * Send a success response
 */
export const successResponse = <T>(
    res: Response,
    data: T,
    message: string,
    statusCode: number = HTTP_STATUS.OK
): Response => {
    const response: ApiResponse<T> = {
        success: true,
        message,
        data,
    };
    return res.status(statusCode).json(response);
};

/**
 * Send an error response
 */
export const errorResponse = (
    res: Response,
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    errors?: any
): Response => {
    const response: ApiResponse = {
        success: false,
        message,
        ...(errors && { errors }),
    };
    return res.status(statusCode).json(response);
};
