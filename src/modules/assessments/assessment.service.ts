import prisma from '../../config/database';
import { AppError } from '../../utils/errors';
import type {
  StoreAssessmentInput,
  UpdateAssessmentInput,
  CompareQuery,
  ProgressQuery,
} from './assessment.schemas';

export class AssessmentService {
  async findAllByUser(userId: number) {
    const assessments = await prisma.physicalAssessment.findMany({
      where: { userId },
      orderBy: { assessedAt: 'desc' },
    });

    return assessments;
  }

  async findById(id: number, userId: number) {
    const assessment = await prisma.physicalAssessment.findUnique({
      where: { id },
    });

    if (!assessment) {
      throw new AppError('Assessment not found', 404);
    }

    if (assessment.userId !== userId) {
      throw new AppError('Forbidden', 403);
    }

    return assessment;
  }

  async create(userId: number, data: StoreAssessmentInput) {
    const assessment = await prisma.physicalAssessment.create({
      data: {
        userId,
        assessedAt: new Date(data.assessed_at),
        weightKg: data.weight_kg,
        heightCm: data.height_cm,
        bodyFatPct: data.body_fat_pct,
        chestCm: data.chest_cm,
        waistCm: data.waist_cm,
        hipCm: data.hip_cm,
        leftArmCm: data.left_arm_cm,
        rightArmCm: data.right_arm_cm,
        leftThighCm: data.left_thigh_cm,
        rightThighCm: data.right_thigh_cm,
        leftCalfCm: data.left_calf_cm,
        rightCalfCm: data.right_calf_cm,
        neckCm: data.neck_cm,
        shoulderCm: data.shoulder_cm,
        forearmCm: data.forearm_cm,
        notes: data.notes,
      },
    });

    return assessment;
  }

  async update(id: number, userId: number, data: UpdateAssessmentInput) {
    await this.findById(id, userId);

    const updateData: any = {};

    if (data.assessed_at) updateData.assessedAt = new Date(data.assessed_at);
    if (data.weight_kg !== undefined) updateData.weightKg = data.weight_kg;
    if (data.height_cm !== undefined) updateData.heightCm = data.height_cm;
    if (data.body_fat_pct !== undefined) updateData.bodyFatPct = data.body_fat_pct;
    if (data.chest_cm !== undefined) updateData.chestCm = data.chest_cm;
    if (data.waist_cm !== undefined) updateData.waistCm = data.waist_cm;
    if (data.hip_cm !== undefined) updateData.hipCm = data.hip_cm;
    if (data.left_arm_cm !== undefined) updateData.leftArmCm = data.left_arm_cm;
    if (data.right_arm_cm !== undefined) updateData.rightArmCm = data.right_arm_cm;
    if (data.left_thigh_cm !== undefined) updateData.leftThighCm = data.left_thigh_cm;
    if (data.right_thigh_cm !== undefined) updateData.rightThighCm = data.right_thigh_cm;
    if (data.left_calf_cm !== undefined) updateData.leftCalfCm = data.left_calf_cm;
    if (data.right_calf_cm !== undefined) updateData.rightCalfCm = data.right_calf_cm;
    if (data.neck_cm !== undefined) updateData.neckCm = data.neck_cm;
    if (data.shoulder_cm !== undefined) updateData.shoulderCm = data.shoulder_cm;
    if (data.forearm_cm !== undefined) updateData.forearmCm = data.forearm_cm;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const updated = await prisma.physicalAssessment.update({
      where: { id },
      data: updateData,
    });

    return updated;
  }

  async delete(id: number, userId: number) {
    await this.findById(id, userId);

    await prisma.physicalAssessment.delete({
      where: { id },
    });
  }

  async compare(userId: number, query: CompareQuery) {
    const fromAssessment = await this.findById(query.from, userId);
    const toAssessment = await this.findById(query.to, userId);

    const fields = [
      'weightKg',
      'heightCm',
      'bodyFatPct',
      'chestCm',
      'waistCm',
      'hipCm',
      'leftArmCm',
      'rightArmCm',
      'leftThighCm',
      'rightThighCm',
      'leftCalfCm',
      'rightCalfCm',
      'neckCm',
      'shoulderCm',
      'forearmCm',
    ];

    const deltas: Record<string, any> = {};

    fields.forEach((field) => {
      const fromValue = fromAssessment[field as keyof typeof fromAssessment];
      const toValue = toAssessment[field as keyof typeof toAssessment];

      if (fromValue !== null && toValue !== null) {
        const from = parseFloat(fromValue.toString());
        const to = parseFloat(toValue.toString());
        const delta = to - from;
        const deltaPct = from > 0 ? ((to - from) / from) * 100 : 0;

        // Convert field name to snake_case for API
        const snakeField = field.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

        deltas[snakeField] = {
          from: Math.round(from * 100) / 100,
          to: Math.round(to * 100) / 100,
          delta: Math.round(delta * 100) / 100,
          delta_pct: Math.round(deltaPct * 10) / 10,
        };
      }
    });

    return {
      from: fromAssessment,
      to: toAssessment,
      deltas,
    };
  }

  async progress(userId: number, query: ProgressQuery) {
    const { field, date_from, date_to } = query;

    // Convert snake_case field to camelCase for Prisma
    const camelField = field.replace(/_([a-z])/g, (g) => g[1].toUpperCase());

    const where: any = {
      userId,
      [camelField]: { not: null },
    };

    if (date_from) {
      where.assessedAt = {
        ...where.assessedAt,
        gte: new Date(date_from),
      };
    }

    if (date_to) {
      where.assessedAt = {
        ...where.assessedAt,
        lte: new Date(date_to),
      };
    }

    const assessments = await prisma.physicalAssessment.findMany({
      where,
      orderBy: { assessedAt: 'asc' },
    });

    const data = assessments.map((assessment) => ({
      date: assessment.assessedAt.toISOString().split('T')[0],
      value: parseFloat(assessment[camelField as keyof typeof assessment]?.toString() || '0'),
    }));

    return data;
  }
}
