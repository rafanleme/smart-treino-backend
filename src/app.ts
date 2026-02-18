import express, { Router } from 'express';
import cors from 'cors';
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
import { SessionController } from './modules/sessions/session.controller';
import { AssessmentController } from './modules/assessments/assessment.controller';

const sessionController = new SessionController();
const assessmentController = new AssessmentController();

const app = express();

app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

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
// app.use('/api/v1/ai', aiRoutes);

app.use(errorHandler);

export default app;
