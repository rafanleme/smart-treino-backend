import { EventEmitter } from 'events';

/**
 * Application Event Emitter
 * Used for cross-cutting concerns like gamification
 */
class AppEventEmitter extends EventEmitter {}

export const eventEmitter = new AppEventEmitter();

/**
 * Event names
 */
export const Events = {
  SET_LOGGED: 'set.logged',
  SESSION_COMPLETED: 'session.completed',
  ASSESSMENT_CREATED: 'assessment.created',
} as const;

/**
 * Event payloads
 */
export interface SetLoggedPayload {
  setId: number;
  userId: number;
  exerciseId: number;
  loadKg: number | null;
  reps: number | null;
}

export interface SessionCompletedPayload {
  sessionId: number;
  userId: number;
}

export interface AssessmentCreatedPayload {
  assessmentId: number;
  userId: number;
}
