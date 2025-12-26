import createApp from './server';
import { config, validateConfig } from './config/env';
import { testConnection, closeDatabase } from './config/database';

/**
 * Start the application
 */
const startServer = async (): Promise<void> => {
    try {
        // Validate configuration
        validateConfig();

        // Test database connection
        await testConnection();

        // Create Express app
        const app = createApp();

        // Start server
        const server = app.listen(config.port, () => {
            console.log('=================================');
            console.log(`🚀 Server running on port ${config.port}`);
            console.log(`📝 Environment: ${config.nodeEnv}`);
            console.log(`🔗 Health check: http://localhost:${config.port}/health`);
            console.log('=================================');
        });

        // Graceful shutdown
        const gracefulShutdown = async (signal: string): Promise<void> => {
            console.log(`\n${signal} received. Starting graceful shutdown...`);

            server.close(async () => {
                console.log('HTTP server closed');
                await closeDatabase();
                console.log('Graceful shutdown completed');
                process.exit(0);
            });

            // Force shutdown after 10 seconds
            setTimeout(() => {
                console.error('Forced shutdown after timeout');
                process.exit(1);
            }, 10000);
        };

        // Handle shutdown signals
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Start the server
startServer();
