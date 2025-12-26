/**
 * Application messages
 */
export const MESSAGES = {
    // Success messages
    USER_CREATED: 'User created successfully',
    LOGIN_SUCCESS: 'Login successful',
    USER_UPDATED: 'User updated successfully',
    USER_DELETED: 'User deleted successfully',

    // Error messages
    EMAIL_ALREADY_EXISTS: 'Email already exists',
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_NOT_FOUND: 'User not found',
    UNAUTHORIZED: 'Unauthorized access',
    TOKEN_MISSING: 'Authentication token is required',
    TOKEN_INVALID: 'Invalid or expired token',
    VALIDATION_ERROR: 'Validation error',
    INTERNAL_ERROR: 'Internal server error',

    // Field validation
    EMAIL_REQUIRED: 'Email is required',
    EMAIL_INVALID: 'Email must be valid',
    PASSWORD_REQUIRED: 'Password is required',
    NAME_REQUIRED: 'Name is required',
    ID_INVALID: 'Invalid ID format',
} as const;
