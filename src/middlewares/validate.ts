import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { errorResponse } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpStatus';
import { MESSAGES } from '../constants/messages';

/**
 * Validation middleware factory
 * Creates middleware to validate request body or params against a Joi schema
 */
export const validate = (schema: Schema, property: 'body' | 'params' = 'body') => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            const errors = error.details.map((detail) => ({
                field: detail.path.join('.'),
                message: detail.message,
            }));

            errorResponse(
                res,
                MESSAGES.VALIDATION_ERROR,
                HTTP_STATUS.UNPROCESSABLE_ENTITY,
                errors
            );
            return;
        }

        // Replace request property with validated value
        req[property] = value;
        next();
    };
};
