import { Request, Response } from 'express';
import { ExerciseService } from './exercise.service';
import {
  storeExerciseSchema,
  updateExerciseSchema,
  exerciseQuerySchema,
} from './exercise.schemas';
import { transformExercise } from '../../utils/transformers';
import { parseIntParam } from '../../utils/helpers';

const exerciseService = new ExerciseService();

export class ExerciseController {
  async index(req: Request, res: Response) {
    const query = exerciseQuerySchema.parse(req.query);
    const result = await exerciseService.findAll(query, req.user?.id);

    res.json({
      data: result.data.map(transformExercise),
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
    const exercise = await exerciseService.findById(id);

    res.json({ data: transformExercise(exercise) });
  }

  async store(req: Request, res: Response) {
    const data = storeExerciseSchema.parse(req.body);
    const exercise = await exerciseService.create(req.user!.id, data);

    res.status(201).json({ data: transformExercise(exercise) });
  }

  async update(req: Request, res: Response) {
    const id = parseIntParam(req.params.id);
    const data = updateExerciseSchema.parse(req.body);
    const exercise = await exerciseService.update(id, req.user!.id, data);

    res.json({ data: transformExercise(exercise) });
  }

  async destroy(req: Request, res: Response) {
    const id = parseIntParam(req.params.id);
    await exerciseService.delete(id, req.user!.id);

    res.status(204).send();
  }
}
