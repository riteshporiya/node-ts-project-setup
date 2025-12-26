import Joi from 'joi';

/**
 * Signup validation schema
 */
export const signupSchema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name must not exceed 100 characters',
    }),
    email: Joi.string().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email must be valid',
    }),
    password: Joi.string().min(6).required().messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters long',
    }),
});

/**
 * Login validation schema
 */
export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email must be valid',
    }),
    password: Joi.string().required().messages({
        'string.empty': 'Password is required',
    }),
});

/**
 * Update user validation schema
 */
export const updateUserSchema = Joi.object({
    name: Joi.string().min(2).max(100).optional().messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name must not exceed 100 characters',
    }),
    email: Joi.string().email().optional().messages({
        'string.email': 'Email must be valid',
    }),
    password: Joi.string().min(6).optional().messages({
        'string.min': 'Password must be at least 6 characters long',
    }),
}).min(1).messages({
    'object.min': 'At least one field must be provided for update',
});

/**
 * ID parameter validation schema
 */
export const idParamSchema = Joi.object({
    id: Joi.number().integer().positive().required().messages({
        'number.base': 'ID must be a number',
        'number.integer': 'ID must be an integer',
        'number.positive': 'ID must be positive',
    }),
});
