import express, { Router } from 'express';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import passport from './config/passport';
import { errorHandler } from './middlewares/errorHandler';
import { corsConfig } from './middlewares/cors';
import { authenticate } from './middlewares/auth';
import { asyncHandler } from './utils/asyncHandler';
import authRoutes from './modules/auth/auth.routes';
import exerciseRoutes from './modules/exercises/exercise.routes';
import workoutRoutes from './modules/workouts/workout.routes';
import sessionRoutes from './modules/sessions/session.routes';
import assessmentRoutes from './modules/assessments/assessment.routes';
import gamificationRoutes from './modules/gamification/gamification.routes';
import aiRoutes from './modules/ai/ai.routes';
import { SessionController } from './modules/sessions/session.controller';
import { AssessmentController } from './modules/assessments/assessment.controller';

const sessionController = new SessionController();
const assessmentController = new AssessmentController();

const app = express();

// Compression middleware
app.use(compression());

// Rate limiting: 60 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 600, // limit each IP to 60 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Health check (accessible without authentication)
app.get('/api/v1/health', async (req, res) => {
  try {
    // Check database connection
    const prisma = (await import('./config/database')).default;
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: 'healthy',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      database: 'connected',
      uptime: process.uptime(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      database: 'disconnected',
      error: 'Database connection failed',
    });
  }
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/exercises', exerciseRoutes);
app.use('/api/v1/workouts', workoutRoutes);
app.use('/api/v1/sessions', sessionRoutes);
app.use('/api/v1/assessments', assessmentRoutes);
app.use('/api/v1', gamificationRoutes);

// Assessment special routes (separate to match Laravel naming)
const assessmentSpecialRouter = Router();
assessmentSpecialRouter.use(authenticate);
assessmentSpecialRouter.get('/assessments-compare', asyncHandler(assessmentController.compare));
assessmentSpecialRouter.get('/assessments-progress', asyncHandler(assessmentController.progress));
app.use('/api/v1', assessmentSpecialRouter);

// Session Exercises and Sets (separate resources to match Laravel routes)
const sessionExerciseRouter = Router();
const sessionSetRouter = Router();

sessionExerciseRouter.use(authenticate);
sessionSetRouter.use(authenticate);

sessionExerciseRouter.put('/:exerciseId', asyncHandler(sessionController.updateExercise));
sessionExerciseRouter.post('/:exerciseId/sets', asyncHandler(sessionController.addSet));

sessionSetRouter.put('/:setId', asyncHandler(sessionController.updateSet));

app.use('/api/v1/session-exercises', sessionExerciseRouter);
app.use('/api/v1/session-sets', sessionSetRouter);
app.use('/api/v1/ai', aiRoutes);

app.use(errorHandler);

export default app;
