import { sign, verify, Secret, SignOptions } from 'jsonwebtoken';
import { config } from '../config/env';
import { JWTPayload } from '../types';

/**
 * Generate a JWT token
 */
export const generateToken = (payload: JWTPayload): string => {
    const options: SignOptions = {
        expiresIn: Number(config.jwt.expiresIn),
    };
    return sign(payload, config.jwt.secret as Secret, options);
};

/**
 * Verify and decode a JWT token
 */
export const verifyToken = (token: string): JWTPayload => {
    try {
        const decoded = verify(token, config.jwt.secret as Secret) as JWTPayload;
        return decoded;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};
