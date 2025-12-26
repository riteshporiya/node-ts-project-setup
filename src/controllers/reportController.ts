import { Response } from 'express';
import { User } from '../models/User';
import { LoginHistory } from '../models/LoginHistory';
import { sequelize } from '../config/database';
import { successResponse, errorResponse } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpStatus';
import { MESSAGES } from '../constants/messages';
import { AuthRequest, DailyReportItem } from '../types';
import { QueryTypes } from 'sequelize';

/**
 * Report Controller - handles reporting operations with Sequelize
 */
export class ReportController {
    /**
     * Get daily report with new user count and login count
     * GET /api/reports/daily
     */
    static async getDailyReport(_req: AuthRequest, res: Response): Promise<void> {
        try {
            // Use raw SQL query for complex aggregation
            const report = await sequelize.query<DailyReportItem>(
                `
        WITH date_range AS (
          SELECT DISTINCT DATE(created_at) as report_date
          FROM (
            SELECT created_at FROM users
            UNION
            SELECT created_at FROM login_history
          ) combined_dates
        ),
        new_users AS (
          SELECT 
            DATE(created_at) as date,
            COUNT(*) as new_user_count
          FROM users
          GROUP BY DATE(created_at)
        ),
        logins AS (
          SELECT 
            DATE(created_at) as date,
            COUNT(*) as login_count
          FROM login_history
          GROUP BY DATE(created_at)
        )
        SELECT 
          TO_CHAR(dr.report_date, 'Mon DD YYYY') as date,
          COALESCE(nu.new_user_count, 0)::integer as "newUserCount",
          COALESCE(l.login_count, 0)::integer as "loginCount"
        FROM date_range dr
        LEFT JOIN new_users nu ON dr.report_date = nu.date
        LEFT JOIN logins l ON dr.report_date = l.date
        ORDER BY dr.report_date DESC
        `,
                {
                    type: QueryTypes.SELECT,
                }
            );

            successResponse(
                res,
                report,
                'Daily report retrieved successfully',
                HTTP_STATUS.OK
            );
        } catch (error) {
            console.error('Get daily report error:', error);
            errorResponse(res, MESSAGES.INTERNAL_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }
}
