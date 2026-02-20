/**
 * Transform Prisma camelCase to API snake_case for frontend compatibility
 */

export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function transformKeys(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(transformKeys);
  }

  if (typeof obj === 'object' && obj.constructor === Object) {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = toSnakeCase(key);
      acc[snakeKey] = transformKeys(obj[key]);
      return acc;
    }, {} as any);
  }

  return obj;
}

/**
 * Transform Exercise from Prisma to API format
 */
export function transformExercise(exercise: any) {
  return {
    id: exercise.id,
    name: exercise.name,
    name_pt: exercise.namePt,
    description: exercise.description,
    description_pt: exercise.descriptionPt,
    muscle_group: exercise.muscleGroup,
    secondary_muscles: exercise.secondaryMuscles,
    equipment: exercise.equipment,
    difficulty: exercise.difficulty,
    exercise_type: exercise.exerciseType,
    image_url: exercise.imageUrl,
    is_custom: exercise.isCustom,
    created_by: exercise.createdBy,
    created_at: exercise.createdAt,
    updated_at: exercise.updatedAt,
  };
}

/**
 * Transform User from Prisma to API format
 */
export function transformUser(user: any) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar_url: user.avatarUrl,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
  };
}

/**
 * Transform WorkoutExercise from Prisma to API format
 */
export function transformWorkoutExercise(workoutExercise: any) {
  return {
    id: workoutExercise.id,
    workout_id: workoutExercise.workoutId,
    exercise_id: workoutExercise.exerciseId,
    exercise: workoutExercise.exercise ? transformExercise(workoutExercise.exercise) : undefined,
    order: workoutExercise.order,
    sets: workoutExercise.sets,
    reps: workoutExercise.reps,
    rest_seconds: workoutExercise.restSeconds,
    notes: workoutExercise.notes,
    created_at: workoutExercise.createdAt,
    updated_at: workoutExercise.updatedAt,
  };
}

/**
 * Transform Workout from Prisma to API format
 */
export function transformWorkout(workout: any) {
  return {
    id: workout.id,
    user_id: workout.userId,
    name: workout.name,
    description: workout.description,
    is_ai_generated: workout.isAiGenerated,
    estimated_duration_min: workout.estimatedDurationMin,
    workout_exercises: workout.exercises?.map(transformWorkoutExercise),
    exercises_count: workout._count?.exercises ?? workout.exercises?.length,
    created_at: workout.createdAt,
    updated_at: workout.updatedAt,
  };
}

/**
 * Transform SessionSet from Prisma to API format
 */
export function transformSessionSet(sessionSet: any) {
  return {
    id: sessionSet.id,
    session_exercise_id: sessionSet.sessionExerciseId,
    set_number: sessionSet.setNumber,
    reps_target: sessionSet.repsTarget,
    reps_completed: sessionSet.repsCompleted,
    load_kg: sessionSet.loadKg ? parseFloat(sessionSet.loadKg.toString()) : null,
    rest_seconds: sessionSet.restSeconds,
    rpe: sessionSet.rpe,
    completed_at: sessionSet.completedAt,
    created_at: sessionSet.createdAt,
    updated_at: sessionSet.updatedAt,
  };
}

/**
 * Transform SessionExercise from Prisma to API format
 */
export function transformSessionExercise(sessionExercise: any) {
  return {
    id: sessionExercise.id,
    training_session_id: sessionExercise.trainingSessionId,
    exercise_id: sessionExercise.exerciseId,
    exercise_name: sessionExercise.exerciseName,
    order: sessionExercise.order,
    target_sets: sessionExercise.targetSets,
    target_reps: sessionExercise.targetReps,
    rest_seconds: sessionExercise.restSeconds,
    started_at: sessionExercise.startedAt,
    finished_at: sessionExercise.finishedAt,
    status: sessionExercise.status,
    created_at: sessionExercise.createdAt,
    updated_at: sessionExercise.updatedAt,
    exercise: sessionExercise.exercise ? transformExercise(sessionExercise.exercise) : undefined,
    session_sets: sessionExercise.sets?.map(transformSessionSet),
  };
}

/**
 * Transform TrainingSession from Prisma to API format
 */
export function transformTrainingSession(session: any) {
  return {
    id: session.id,
    user_id: session.userId,
    workout_id: session.workoutId,
    workout_name: session.workoutName,
    started_at: session.startedAt,
    finished_at: session.finishedAt,
    duration_seconds: session.durationSeconds,
    status: session.status,
    notes: session.notes,
    created_at: session.createdAt,
    updated_at: session.updatedAt,
    session_exercises: session.exercises?.map(transformSessionExercise),
    exercises_count: session._count?.exercises ?? session.exercises?.length,
    summary: session.summary,
  };
}

/**
 * Transform PhysicalAssessment from Prisma to API format
 */
export function transformPhysicalAssessment(assessment: any) {
  const parseDecimal = (val: any) => (val ? parseFloat(val.toString()) : null);

  return {
    id: assessment.id,
    user_id: assessment.userId,
    assessed_at: assessment.assessedAt,
    weight_kg: parseDecimal(assessment.weightKg),
    height_cm: parseDecimal(assessment.heightCm),
    body_fat_pct: parseDecimal(assessment.bodyFatPct),
    chest_cm: parseDecimal(assessment.chestCm),
    waist_cm: parseDecimal(assessment.waistCm),
    hip_cm: parseDecimal(assessment.hipCm),
    left_arm_cm: parseDecimal(assessment.leftArmCm),
    right_arm_cm: parseDecimal(assessment.rightArmCm),
    left_thigh_cm: parseDecimal(assessment.leftThighCm),
    right_thigh_cm: parseDecimal(assessment.rightThighCm),
    left_calf_cm: parseDecimal(assessment.leftCalfCm),
    right_calf_cm: parseDecimal(assessment.rightCalfCm),
    neck_cm: parseDecimal(assessment.neckCm),
    shoulder_cm: parseDecimal(assessment.shoulderCm),
    forearm_cm: parseDecimal(assessment.forearmCm),
    notes: assessment.notes,
    created_at: assessment.createdAt,
    updated_at: assessment.updatedAt,
  };
}

/**
 * Transform Achievement from Prisma to API format
 */
export function transformAchievement(achievement: any) {
  return {
    id: achievement.id,
    key: achievement.key,
    name: achievement.name,
    name_pt: achievement.namePt,
    description: achievement.description,
    description_pt: achievement.descriptionPt,
    icon: achievement.icon,
    category: achievement.category,
    threshold_value: achievement.thresholdValue,
    xp_reward: achievement.xpReward,
    unlocked: !!achievement.unlockedAt,
    unlocked_at: achievement.unlockedAt,
    created_at: achievement.createdAt,
  };
}

/**
 * Transform PersonalRecord from Prisma to API format
 */
export function transformPersonalRecord(pr: any) {
  return {
    id: pr.id,
    exercise: pr.exercise
      ? {
          id: pr.exercise.id,
          name: pr.exercise.name,
          name_pt: pr.exercise.namePt,
          muscle_group: pr.exercise.muscleGroup,
        }
      : undefined,
    load_kg: pr.loadKg ? parseFloat(pr.loadKg.toString()) : 0,
    reps: pr.reps,
    achieved_at: pr.achievedAt,
    created_at: pr.createdAt,
  };
}

/**
 * Transform UserStreak from Prisma to API format
 */
export function transformUserStreak(streak: any) {
  return {
    current_streak: streak.currentStreak,
    longest_streak: streak.longestStreak,
    last_activity_date: streak.lastActivityDate,
  };
}
