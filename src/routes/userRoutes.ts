import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { updateUserSchema, idParamSchema } from '../utils/validation';

const router = Router();

// All user routes require authentication
router.use(authenticate);

/**
 * GET /api/users
 * Get all users
 */
router.get('/', UserController.getAllUsers);

/**
 * GET /api/users/:id
 * Get user by ID
 */
router.get('/:id', validate(idParamSchema, 'params'), UserController.getUserById);

/**
 * PUT /api/users/:id
 * Update user
 */
router.put(
    '/:id',
    validate(idParamSchema, 'params'),
    validate(updateUserSchema),
    UserController.updateUser
);

/**
 * DELETE /api/users/:id
 * Delete user
 */
router.delete('/:id', validate(idParamSchema, 'params'), UserController.deleteUser);

export default router;
