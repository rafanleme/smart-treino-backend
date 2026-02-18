import { Request, Response } from 'express';
import { aiService } from './ai.service';
import { generateWorkoutSchema, suggestProgressionSchema } from './ai.schemas';

export class AiController {
  async generateWorkout(req: Request, res: Response) {
    const data = generateWorkoutSchema.parse(req.body);
    const workout = await aiService.generateWorkout(req.user!.id, data);

    res.json({ data: workout });
  }

  async suggestProgression(req: Request, res: Response) {
    const data = suggestProgressionSchema.parse(req.body);
    const suggestion = await aiService.suggestProgression(req.user!.id, data);

    res.json({ data: suggestion });
  }
}

export const aiController = new AiController();
