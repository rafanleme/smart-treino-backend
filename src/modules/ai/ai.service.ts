import Anthropic from '@anthropic-ai/sdk';
import prisma from '../../config/database';
import { env } from '../../config/env';
import { AppError } from '../../utils/errors';
import type { GenerateWorkoutInput, SuggestProgressionInput } from './ai.schemas';

const anthropic = new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY,
});

interface WorkoutExerciseData {
  exercise_id: number;
  sets: number;
  reps: string;
  rest_seconds: number;
  notes?: string;
  ai_reasoning?: string;
}

interface GeneratedWorkout {
  name: string;
  description?: string;
  estimated_duration_min?: number;
  ai_notes?: string;
  exercises: WorkoutExerciseData[];
}

interface ProgressionSuggestion {
  current_load: number | null;
  suggested_load: number;
  reasoning: string;
}

export class AiService {
  /**
   * Generate a personalized workout using Anthropic Claude API
   */
  async generateWorkout(userId: number, input: GenerateWorkoutInput): Promise<GeneratedWorkout> {
    // Fetch user data for personalization
    const [recentSessions, personalRecords, availableExercises] = await Promise.all([
      this.fetchRecentSessions(userId),
      this.fetchPersonalRecords(userId),
      this.fetchAvailableExercises(input.muscle_groups),
    ]);

    // Build prompt for Claude
    const prompt = this.buildWorkoutPrompt(input, recentSessions, personalRecords, availableExercises);

    // Call Anthropic API
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Parse response
    const content = response.content[0];
    if (content.type !== 'text') {
      throw new AppError('Invalid response from AI', 500);
    }

    const workout = this.parseWorkoutResponse(content.text, availableExercises);

    return workout;
  }

  /**
   * Suggest progression for a specific exercise
   */
  async suggestProgression(userId: number, input: SuggestProgressionInput): Promise<ProgressionSuggestion> {
    const { exercise_id } = input;

    // Fetch exercise details
    const exercise = await prisma.exercise.findUnique({
      where: { id: exercise_id },
    });

    if (!exercise) {
      throw new AppError('Exercise not found', 404);
    }

    // Fetch user's history for this exercise
    const history = await this.fetchExerciseHistory(userId, exercise_id);

    // Build prompt for Claude
    const prompt = this.buildProgressionPrompt(exercise, history);

    // Call Anthropic API
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Parse response
    const content = response.content[0];
    if (content.type !== 'text') {
      throw new AppError('Invalid response from AI', 500);
    }

    return this.parseProgressionResponse(content.text, history);
  }

  // ==================== PRIVATE HELPERS ====================

  private async fetchRecentSessions(userId: number) {
    return prisma.trainingSession.findMany({
      where: {
        userId,
        status: 'completed',
      },
      take: 10,
      orderBy: { startedAt: 'desc' },
      include: {
        exercises: {
          include: {
            sets: true,
          },
        },
      },
    });
  }

  private async fetchPersonalRecords(userId: number) {
    return prisma.personalRecord.findMany({
      where: { userId },
      include: {
        exercise: true,
      },
      orderBy: { achievedAt: 'desc' },
      take: 20,
    });
  }

  private async fetchAvailableExercises(muscleGroups?: string[]) {
    const where: any = {};

    if (muscleGroups && muscleGroups.length > 0) {
      where.muscleGroup = { in: muscleGroups };
    }

    return prisma.exercise.findMany({
      where,
      orderBy: { namePt: 'asc' },
    });
  }

  private async fetchExerciseHistory(userId: number, exerciseId: number) {
    const sessionExercises = await prisma.sessionExercise.findMany({
      where: {
        exerciseName: {
          equals: await prisma.exercise
            .findUnique({ where: { id: exerciseId } })
            .then((e) => e?.name || ''),
        },
        session: {
          userId,
          status: 'completed',
        },
      },
      include: {
        sets: {
          orderBy: { createdAt: 'desc' },
        },
        session: {
          select: {
            startedAt: true,
          },
        },
      },
      orderBy: {
        session: {
          startedAt: 'desc',
        },
      },
      take: 10,
    });

    return sessionExercises;
  }

  private buildWorkoutPrompt(
    input: GenerateWorkoutInput,
    recentSessions: any[],
    personalRecords: any[],
    availableExercises: any[]
  ): string {
    const goalDescriptions = {
      hypertrophy: 'hipertrofia (ganho de massa muscular)',
      strength: 'força máxima',
      endurance: 'resistência muscular',
    };

    const difficultyDescriptions = {
      beginner: 'iniciante',
      intermediate: 'intermediário',
      advanced: 'avançado',
    };

    const exerciseList = availableExercises
      .map((ex) => `- ID ${ex.id}: ${ex.namePt} (${ex.name}) - ${ex.muscleGroup} - ${ex.equipment}`)
      .join('\n');

    const recentExercises = recentSessions
      .flatMap((s) => s.exercises.map((e: any) => e.exerciseName))
      .filter((name, index, self) => self.indexOf(name) === index)
      .slice(0, 10)
      .join(', ');

    const prs = personalRecords
      .map((pr) => `${pr.exercise.namePt}: ${pr.load}kg x ${pr.reps} reps`)
      .slice(0, 5)
      .join(', ');

    return `Você é um personal trainer especializado em montagem de treinos personalizados.

**OBJETIVO**: Criar um treino de ${goalDescriptions[input.goal]} para um aluno de nível ${difficultyDescriptions[input.difficulty]}.

**GRUPOS MUSCULARES SOLICITADOS**: ${input.muscle_groups?.join(', ') || 'Não especificado (livre escolha)'}

**DURAÇÃO ESTIMADA**: ${input.duration_minutes || 60} minutos

**OBSERVAÇÕES DO ALUNO**: ${input.notes || 'Nenhuma'}

**HISTÓRICO RECENTE DO ALUNO**:
- Exercícios recentes: ${recentExercises || 'Nenhum histórico'}
- Records pessoais: ${prs || 'Nenhum PR registrado'}
- Total de sessões recentes: ${recentSessions.length}

**EXERCÍCIOS DISPONÍVEIS** (use APENAS os IDs desta lista):
${exerciseList}

**INSTRUÇÕES**:
1. Selecione exercícios adequados ao objetivo e nível do aluno
2. Use APENAS os exercise_id da lista acima
3. Para hipertrofia: 3-5 séries de 8-15 reps com descanso de 60-90s
4. Para força: 3-6 séries de 3-6 reps com descanso de 120-180s
5. Para resistência: 2-4 séries de 15-25 reps com descanso de 30-60s
6. Respeite as observações do aluno (lesões, limitações, preferências)
7. Considere o histórico do aluno para variar exercícios
8. Organize em ordem lógica (compostos primeiro, isolados depois)

**FORMATO DE RESPOSTA** (retorne APENAS o JSON, sem texto adicional):
\`\`\`json
{
  "workout": {
    "name": "Nome do Treino",
    "description": "Descrição breve do treino",
    "estimated_duration_min": ${input.duration_minutes || 60},
    "ai_notes": "Notas gerais sobre o treino (dicas, foco, etc)",
    "exercises": [
      {
        "exercise_id": 123,
        "sets": 4,
        "reps": "8-12",
        "rest_seconds": 90,
        "notes": "Foco em contração",
        "ai_reasoning": "Por que escolhi este exercício e estes parâmetros"
      }
    ]
  }
}
\`\`\`

Retorne o JSON agora:`;
  }

  private buildProgressionPrompt(exercise: any, history: any[]): string {
    const recentLoads = history
      .flatMap((h) => h.sets.map((s: any) => s.load))
      .filter((load) => load !== null)
      .slice(0, 10);

    const avgLoad = recentLoads.length > 0 ? Math.round(recentLoads.reduce((a, b) => a + b, 0) / recentLoads.length) : 0;
    const maxLoad = recentLoads.length > 0 ? Math.max(...recentLoads) : 0;

    return `Você é um personal trainer especializado em progressão de cargas.

**EXERCÍCIO**: ${exercise.namePt} (${exercise.name})

**HISTÓRICO RECENTE DO ALUNO**:
- Carga média recente: ${avgLoad}kg
- Carga máxima recente: ${maxLoad}kg
- Cargas das últimas 10 séries: ${recentLoads.join(', ') || 'Nenhum histórico'}

**INSTRUÇÕES**:
1. Analise o padrão de cargas do aluno
2. Sugira a próxima carga a ser utilizada
3. Justifique a sugestão considerando progressão segura (2.5-5% de incremento)
4. Se não houver histórico, sugira uma carga inicial conservadora

**FORMATO DE RESPOSTA** (retorne APENAS o JSON, sem texto adicional):
\`\`\`json
{
  "current_load": ${maxLoad || null},
  "suggested_load": 0,
  "reasoning": "Explicação detalhada da sugestão"
}
\`\`\`

Retorne o JSON agora:`;
  }

  private parseWorkoutResponse(responseText: string, availableExercises: any[]): GeneratedWorkout {
    // Extract JSON from response (Claude might wrap it in ```json blocks)
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new AppError('Failed to parse AI response', 500);
    }

    const jsonText = jsonMatch[1] || jsonMatch[0];
    const parsed = JSON.parse(jsonText);

    const workout = parsed.workout || parsed;

    // Validate exercise IDs
    const validExerciseIds = new Set(availableExercises.map((e) => e.id));

    for (const exercise of workout.exercises) {
      if (!validExerciseIds.has(exercise.exercise_id)) {
        throw new AppError(`Invalid exercise ID: ${exercise.exercise_id}`, 400);
      }

      // Validate sets and reps
      if (exercise.sets < 1 || exercise.sets > 10) {
        throw new AppError(`Invalid sets count: ${exercise.sets}`, 400);
      }

      if (exercise.rest_seconds < 0 || exercise.rest_seconds > 600) {
        throw new AppError(`Invalid rest time: ${exercise.rest_seconds}`, 400);
      }
    }

    return workout;
  }

  private parseProgressionResponse(responseText: string, history: any[]): ProgressionSuggestion {
    // Extract JSON from response
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new AppError('Failed to parse AI response', 500);
    }

    const jsonText = jsonMatch[1] || jsonMatch[0];
    const parsed = JSON.parse(jsonText);

    return {
      current_load: parsed.current_load,
      suggested_load: parsed.suggested_load,
      reasoning: parsed.reasoning,
    };
  }
}

export const aiService = new AiService();
