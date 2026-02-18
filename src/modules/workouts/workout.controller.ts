import { Request, Response } from 'express';
import { WorkoutService } from './workout.service';
import {
  storeWorkoutSchema,
  updateWorkoutSchema,
  storeWorkoutExerciseSchema,
  updateWorkoutExerciseSchema,
  reorderWorkoutExercisesSchema,
} from './workout.schemas';
import { transformWorkout, transformWorkoutExercise } from '../../utils/transformers';
import { parseIntParam } from '../../utils/helpers';

const workoutService = new WorkoutService();

export class WorkoutController {
  async index(req: Request, res: Response) {
    const workouts = await workoutService.findAllByUser(req.user!.id);

    res.json({
      data: workouts.map(transformWorkout),
    });
  }

  async show(req: Request, res: Response) {
    const id = parseIntParam(req.params.id);
    const workout = await workoutService.findById(id, req.user!.id);

    res.json({ data: transformWorkout(workout) });
  }

  async store(req: Request, res: Response) {
    const data = storeWorkoutSchema.parse(req.body);
    const workout = await workoutService.create(req.user!.id, data);

    res.status(201).json({ data: transformWorkout(workout) });
  }

  async update(req: Request, res: Response) {
    const id = parseIntParam(req.params.id);
    const data = updateWorkoutSchema.parse(req.body);
    const workout = await workoutService.update(id, req.user!.id, data);

    res.json({ data: transformWorkout(workout) });
  }

  async destroy(req: Request, res: Response) {
    const id = parseIntParam(req.params.id);
    await workoutService.delete(id, req.user!.id);

    res.status(204).send();
  }

  async duplicate(req: Request, res: Response) {
    const id = parseIntParam(req.params.id);
    const workout = await workoutService.duplicate(id, req.user!.id);

    res.json({ data: transformWorkout(workout) });
  }

  // Workout Exercises
  async addExercise(req: Request, res: Response) {
    const workoutId = parseIntParam(req.params.id);
    const data = storeWorkoutExerciseSchema.parse(req.body);
    const workoutExercise = await workoutService.addExercise(workoutId, req.user!.id, data);

    res.status(201).json({ data: transformWorkoutExercise(workoutExercise) });
  }

  async updateExercise(req: Request, res: Response) {
    const workoutId = parseIntParam(req.params.id);
    const workoutExerciseId = parseIntParam(req.params.exerciseId);
    const data = updateWorkoutExerciseSchema.parse(req.body);
    const workoutExercise = await workoutService.updateExercise(
      workoutId,
      workoutExerciseId,
      req.user!.id,
      data
    );

    res.json({ data: transformWorkoutExercise(workoutExercise) });
  }

  async deleteExercise(req: Request, res: Response) {
    const workoutId = parseIntParam(req.params.id);
    const workoutExerciseId = parseIntParam(req.params.exerciseId);
    await workoutService.deleteExercise(workoutId, workoutExerciseId, req.user!.id);

    res.status(204).send();
  }

  async reorderExercises(req: Request, res: Response) {
    const workoutId = parseIntParam(req.params.id);
    const data = reorderWorkoutExercisesSchema.parse(req.body);
    await workoutService.reorderExercises(workoutId, req.user!.id, data);

    res.json({ message: 'Ordem atualizada com sucesso' });
  }
}
