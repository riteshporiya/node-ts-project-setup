import { Router } from 'express';
import { ReportController } from '../controllers/reportController';
import { authenticate } from '../middlewares/auth';

const router = Router();

// All report routes require authentication
router.use(authenticate);

/**
 * GET /api/reports/daily
 * Get daily report with new user count and login count
 */
router.get('/daily', ReportController.getDailyReport);

export default router;
