import { Request, Response } from 'express';
import { SessionService } from './session.service';
import {
  storeTrainingSessionSchema,
  updateTrainingSessionSchema,
  updateSessionExerciseSchema,
  storeSessionSetSchema,
  updateSessionSetSchema,
  sessionQuerySchema,
} from './session.schemas';
import {
  transformTrainingSession,
  transformSessionExercise,
  transformSessionSet,
} from '../../utils/transformers';
import { eventEmitter, Events } from '../../events/emitter';
import { parseIntParam } from '../../utils/helpers';

const sessionService = new SessionService();

export class SessionController {
  async index(req: Request, res: Response) {
    const query = sessionQuerySchema.parse(req.query);
    const result = await sessionService.findAllByUser(req.user!.id, query);

    res.json({
      data: result.data.map(transformTrainingSession),
      meta: {
        current_page: result.meta.currentPage,
        per_page: result.meta.perPage,
        total: result.meta.total,
        last_page: result.meta.lastPage,
      },
    });
  }

  async show(req: Request, res: Response) {
    const id = parseIntParam(req.params.id);
    const session = await sessionService.findById(id, req.user!.id);

    res.json({ data: transformTrainingSession(session) });
  }

  async active(req: Request, res: Response) {
    const session = await sessionService.findActiveByUser(req.user!.id);

    if (!session) {
      return res.status(404).json({
        message: 'Nenhuma sessão ativa encontrada',
      });
    }

    res.json({ data: transformTrainingSession(session) });
  }

  async store(req: Request, res: Response) {
    const data = storeTrainingSessionSchema.parse(req.body);
    const session = await sessionService.create(req.user!.id, data);

    res.status(201).json({ data: transformTrainingSession(session) });
  }

  async update(req: Request, res: Response) {
    const id = parseIntParam(req.params.id);
    const data = updateTrainingSessionSchema.parse(req.body);
    const result = await sessionService.update(id, req.user!.id, data);

    const response = transformTrainingSession(result);

    // Fire SessionCompleted event if status changed to completed
    if (result.statusChanged && data.status === 'completed') {
      eventEmitter.emit(Events.SESSION_COMPLETED, {
        sessionId: id,
        userId: req.user!.id,
      });
    }

    res.json({ data: response });
  }

  async destroy(req: Request, res: Response) {
    const id = parseIntParam(req.params.id);
    await sessionService.delete(id, req.user!.id);

    res.status(204).send();
  }

  async previousLoad(req: Request, res: Response) {
    const sessionId = parseIntParam(req.params.id);
    const exerciseId = parseIntParam(req.params.exerciseId);
    const previousLoad = await sessionService.getPreviousLoad(
      sessionId,
      exerciseId,
      req.user!.id
    );

    res.json({ data: previousLoad });
  }

  // Session Exercise methods
  async updateExercise(req: Request, res: Response) {
    const sessionExerciseId = parseIntParam(req.params.exerciseId);
    const data = updateSessionExerciseSchema.parse(req.body);
    const sessionExercise = await sessionService.updateExercise(
      sessionExerciseId,
      req.user!.id,
      data
    );

    res.json({ data: transformSessionExercise(sessionExercise) });
  }

  // Session Set methods
  async addSet(req: Request, res: Response) {
    const sessionExerciseId = parseIntParam(req.params.exerciseId);
    const data = storeSessionSetSchema.parse(req.body);
    const result = await sessionService.addSet(sessionExerciseId, req.user!.id, data);

    // Fire SetLogged event
    eventEmitter.emit(Events.SET_LOGGED, {
      setId: result.set.id,
      userId: req.user!.id,
      exerciseId: result.exerciseId,
      loadKg: result.set.loadKg ? parseFloat(result.set.loadKg.toString()) : null,
      reps: result.set.repsCompleted,
    });

    res.status(201).json({ data: transformSessionSet(result.set) });
  }

  async updateSet(req: Request, res: Response) {
    const setId = parseIntParam(req.params.setId);
    const data = updateSessionSetSchema.parse(req.body);
    const set = await sessionService.updateSet(setId, req.user!.id, data);

    res.json({ data: transformSessionSet(set) });
  }
}
