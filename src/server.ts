import app from './app';
import { env } from './config/env';
import logger from './config/logger';
import prisma from './config/database';
import { eventEmitter, Events } from './events/emitter';
import { detectPersonalRecordListener } from './listeners/detectPersonalRecord.listener';
import { updateStreakListener } from './listeners/updateStreak.listener';
import { checkAchievementsListener } from './listeners/checkAchievements.listener';

const PORT = env.PORT || 8000;

// Register event listeners
eventEmitter.on(Events.SET_LOGGED, detectPersonalRecordListener);
eventEmitter.on(Events.SESSION_COMPLETED, updateStreakListener);
eventEmitter.on(Events.SESSION_COMPLETED, checkAchievementsListener);
eventEmitter.on(Events.ASSESSMENT_CREATED, checkAchievementsListener);

logger.info('Event listeners registered');

const server = app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
  logger.info(`Environment: ${env.NODE_ENV}`);
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received: closing HTTP server`);

  server.close(async () => {
    logger.info('HTTP server closed');

    // Close database connection
    try {
      await prisma.$disconnect();
      logger.info('Database connection closed');
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown:', error);
      process.exit(1);
    }
  });

  // Force close after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: Error, promise: Promise<any>) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // In production, you might want to shut down gracefully here
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});
