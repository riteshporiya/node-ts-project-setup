import { Response } from 'express';
import { User } from '../models/User';
import { successResponse, errorResponse } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpStatus';
import { MESSAGES } from '../constants/messages';
import { AuthRequest, UpdateUserRequest } from '../types';

/**
 * User Controller - handles user CRUD operations with Sequelize
 */
export class UserController {
    /**
     * Get all users
     * GET /api/users
     */
    static async getAllUsers(_req: AuthRequest, res: Response): Promise<void> {
        try {
            const users = await User.findAll({
                attributes: { exclude: ['password'] },
                order: [['createdAt', 'DESC']],
            });
            successResponse(res, users, 'Users retrieved successfully', HTTP_STATUS.OK);
        } catch (error) {
            console.error('Get all users error:', error);
            errorResponse(res, MESSAGES.INTERNAL_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get user by ID
     * GET /api/users/:id
     */
    static async getUserById(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.id, 10);

            const user = await User.findByPk(userId, {
                attributes: { exclude: ['password'] },
            });

            if (!user) {
                errorResponse(res, MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
                return;
            }

            successResponse(res, user, 'User retrieved successfully', HTTP_STATUS.OK);
        } catch (error) {
            console.error('Get user by ID error:', error);
            errorResponse(res, MESSAGES.INTERNAL_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update user
     * PUT /api/users/:id
     */
    static async updateUser(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.id, 10);
            const updateData = req.body as UpdateUserRequest;

            // Check if user exists
            const user = await User.findByPk(userId);
            if (!user) {
                errorResponse(res, MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
                return;
            }

            // Check if email is being updated and if it's already taken
            if (updateData.email && updateData.email !== user.email) {
                const emailExists = await User.findOne({ where: { email: updateData.email } });
                if (emailExists) {
                    errorResponse(
                        res,
                        MESSAGES.EMAIL_ALREADY_EXISTS,
                        HTTP_STATUS.BAD_REQUEST
                    );
                    return;
                }
            }

            // Update user (password will be hashed automatically if changed)
            await user.update(updateData);

            // Reload to get updated data
            await user.reload({ attributes: { exclude: ['password'] } });

            successResponse(res, user, MESSAGES.USER_UPDATED, HTTP_STATUS.OK);
        } catch (error) {
            console.error('Update user error:', error);
            errorResponse(res, MESSAGES.INTERNAL_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Delete user
     * DELETE /api/users/:id
     */
    static async deleteUser(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.id, 10);

            // Check if user exists
            const user = await User.findByPk(userId);
            if (!user) {
                errorResponse(res, MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
                return;
            }

            // Delete user (cascade will delete login history)
            await user.destroy();

            successResponse(res, null, MESSAGES.USER_DELETED, HTTP_STATUS.OK);
        } catch (error) {
            console.error('Delete user error:', error);
            errorResponse(res, MESSAGES.INTERNAL_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }
}
