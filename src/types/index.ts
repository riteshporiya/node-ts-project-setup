import { Request } from 'express';

/**
 * User interface representing the User entity
 */
export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
}

/**
 * User data without sensitive information (password)
 */
export interface UserResponse {
    id: number;
    name: string;
    email: string;
    createdAt: Date;
}

/**
 * LoginHistory interface representing login events
 */
export interface LoginHistory {
    id: number;
    userId: number;
    createdAt: Date;
}

/**
 * JWT Payload structure
 */
export interface JWTPayload {
    userId: number;
    email: string;
}

/**
 * Daily report item structure
 */
export interface DailyReportItem {
    date: string;
    newUserCount: number;
    loginCount: number;
}

/**
 * Extended Express Request with authenticated user
 */
export interface AuthRequest extends Request {
    user?: JWTPayload;
}

/**
 * Signup request body
 */
export interface SignupRequest {
    name: string;
    email: string;
    password: string;
}

/**
 * Login request body
 */
export interface LoginRequest {
    email: string;
    password: string;
}

/**
 * Update user request body
 */
export interface UpdateUserRequest {
    name?: string;
    email?: string;
    password?: string;
}

/**
 * Standard API response structure
 */
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    errors?: any;
}
