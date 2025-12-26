import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import reportRoutes from './reportRoutes';

const router = Router();

/**
 * Mount all route modules
 */
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/reports', reportRoutes);

export default router;
