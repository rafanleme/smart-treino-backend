import { Request, Response } from 'express';
import { AssessmentService } from './assessment.service';
import {
  storeAssessmentSchema,
  updateAssessmentSchema,
  compareQuerySchema,
  progressQuerySchema,
} from './assessment.schemas';
import { transformPhysicalAssessment } from '../../utils/transformers';
import { eventEmitter, Events } from '../../events/emitter';
import { parseIntParam } from '../../utils/helpers';

const assessmentService = new AssessmentService();

export class AssessmentController {
  async index(req: Request, res: Response) {
    const assessments = await assessmentService.findAllByUser(req.user!.id);

    res.json({
      data: assessments.map(transformPhysicalAssessment),
    });
  }

  async show(req: Request, res: Response) {
    const id = parseIntParam(req.params.id);
    const assessment = await assessmentService.findById(id, req.user!.id);

    res.json({ data: transformPhysicalAssessment(assessment) });
  }

  async store(req: Request, res: Response) {
    const data = storeAssessmentSchema.parse(req.body);
    const assessment = await assessmentService.create(req.user!.id, data);

    // Fire AssessmentCreated event
    eventEmitter.emit(Events.ASSESSMENT_CREATED, {
      assessmentId: assessment.id,
      userId: req.user!.id,
    });

    res.status(201).json({ data: transformPhysicalAssessment(assessment) });
  }

  async update(req: Request, res: Response) {
    const id = parseIntParam(req.params.id);
    const data = updateAssessmentSchema.parse(req.body);
    const assessment = await assessmentService.update(id, req.user!.id, data);

    res.json({ data: transformPhysicalAssessment(assessment) });
  }

  async destroy(req: Request, res: Response) {
    const id = parseIntParam(req.params.id);
    await assessmentService.delete(id, req.user!.id);

    res.status(204).send();
  }

  async compare(req: Request, res: Response) {
    const query = compareQuerySchema.parse(req.query);
    const result = await assessmentService.compare(req.user!.id, query);

    res.json({
      data: {
        from: transformPhysicalAssessment(result.from),
        to: transformPhysicalAssessment(result.to),
        deltas: result.deltas,
      },
    });
  }

  async progress(req: Request, res: Response) {
    const query = progressQuerySchema.parse(req.query);
    const data = await assessmentService.progress(req.user!.id, query);

    res.json({ data });
  }
}
