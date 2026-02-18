import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ExerciseData {
  name: string;
  namePt: string;
  muscleGroup: string;
  equipment: string;
  difficulty: string;
  exerciseType: string;
  secondaryMuscles?: string[];
}

const exercises: ExerciseData[] = [
  // Peito (chest) — 15 exercícios
  { name: 'Flat Barbell Bench Press', namePt: 'Supino Reto com Barra', muscleGroup: 'chest', equipment: 'barbell', difficulty: 'intermediate', exerciseType: 'strength', secondaryMuscles: ['triceps', 'shoulders'] },
  { name: 'Incline Barbell Bench Press', namePt: 'Supino Inclinado com Barra', muscleGroup: 'chest', equipment: 'barbell', difficulty: 'intermediate', exerciseType: 'strength', secondaryMuscles: ['triceps', 'shoulders'] },
  { name: 'Decline Barbell Bench Press', namePt: 'Supino Declinado com Barra', muscleGroup: 'chest', equipment: 'barbell', difficulty: 'intermediate', exerciseType: 'strength', secondaryMuscles: ['triceps'] },
  { name: 'Flat Dumbbell Bench Press', namePt: 'Supino Reto com Halteres', muscleGroup: 'chest', equipment: 'dumbbell', difficulty: 'intermediate', exerciseType: 'strength', secondaryMuscles: ['triceps', 'shoulders'] },
  { name: 'Incline Dumbbell Bench Press', namePt: 'Supino Inclinado com Halteres', muscleGroup: 'chest', equipment: 'dumbbell', difficulty: 'intermediate', exerciseType: 'strength', secondaryMuscles: ['triceps', 'shoulders'] },
  { name: 'Dumbbell Fly', namePt: 'Crucifixo com Halteres', muscleGroup: 'chest', equipment: 'dumbbell', difficulty: 'beginner', exerciseType: 'strength', secondaryMuscles: ['shoulders'] },
  { name: 'Incline Dumbbell Fly', namePt: 'Crucifixo Inclinado com Halteres', muscleGroup: 'chest', equipment: 'dumbbell', difficulty: 'beginner', exerciseType: 'strength', secondaryMuscles: ['shoulders'] },
  { name: 'Cable Crossover', namePt: 'Crossover no Cabo', muscleGroup: 'chest', equipment: 'cable', difficulty: 'intermediate', exerciseType: 'strength', secondaryMuscles: ['shoulders'] },
  { name: 'Machine Chest Press', namePt: 'Supino na Máquina', muscleGroup: 'chest', equipment: 'machine', difficulty: 'beginner', exerciseType: 'strength', secondaryMuscles: ['triceps', 'shoulders'] },
  { name: 'Pec Deck Machine', namePt: 'Pec Deck (Voador)', muscleGroup: 'chest', equipment: 'machine', difficulty: 'beginner', exerciseType: 'strength' },
  { name: 'Push-Up', namePt: 'Flexão de Braço', muscleGroup: 'chest', equipment: 'bodyweight', difficulty: 'beginner', exerciseType: 'strength', secondaryMuscles: ['triceps', 'shoulders', 'abs'] },
  { name: 'Chest Dip', namePt: 'Mergulho para Peito', muscleGroup: 'chest', equipment: 'bodyweight', difficulty: 'advanced', exerciseType: 'strength', secondaryMuscles: ['triceps', 'shoulders'] },
  { name: 'Landmine Press', namePt: 'Landmine Press', muscleGroup: 'chest', equipment: 'barbell', difficulty: 'intermediate', exerciseType: 'strength', secondaryMuscles: ['shoulders', 'triceps'] },
  { name: 'Low Cable Fly', namePt: 'Crucifixo no Cabo Baixo', muscleGroup: 'chest', equipment: 'cable', difficulty: 'intermediate', exerciseType: 'strength', secondaryMuscles: ['shoulders'] },
  { name: 'Svend Press', namePt: 'Svend Press', muscleGroup: 'chest', equipment: 'other', difficulty: 'beginner', exerciseType: 'strength', secondaryMuscles: ['shoulders'] },

  // Costas (back) — 18 exercícios
  { name: 'Conventional Deadlift', namePt: 'Levantamento Terra Convencional', muscleGroup: 'back', equipment: 'barbell', difficulty: 'advanced', exerciseType: 'strength', secondaryMuscles: ['legs', 'glutes', 'forearms'] },
  { name: 'Barbell Bent-Over Row', namePt: 'Remada Curvada com Barra', muscleGroup: 'back', equipment: 'barbell', difficulty: 'intermediate', exerciseType: 'strength', secondaryMuscles: ['biceps', 'forearms'] },
  { name: 'Pendlay Row', namePt: 'Remada Pendlay', muscleGroup: 'back', equipment: 'barbell', difficulty: 'advanced', exerciseType: 'strength', secondaryMuscles: ['biceps', 'forearms'] },
  { name: 'T-Bar Row', namePt: 'Remada Cavalinho', muscleGroup: 'back', equipment: 'barbell', difficulty: 'intermediate', exerciseType: 'strength', secondaryMuscles: ['biceps'] },
  { name: 'Dumbbell Single-Arm Row', namePt: 'Remada Unilateral com Halter', muscleGroup: 'back', equipment: 'dumbbell', difficulty: 'beginner', exerciseType: 'strength', secondaryMuscles: ['biceps'] },
  { name: 'Lat Pulldown', namePt: 'Puxada Frontal (Pulley)', muscleGroup: 'back', equipment: 'cable', difficulty: 'beginner', exerciseType: 'strength', secondaryMuscles: ['biceps'] },
  { name: 'Close-Grip Lat Pulldown', namePt: 'Puxada Frontal Pegada Fechada', muscleGroup: 'back', equipment: 'cable', difficulty: 'beginner', exerciseType: 'strength', secondaryMuscles: ['biceps'] },
  { name: 'Seated Cable Row', namePt: 'Remada Sentada no Cabo', muscleGroup: 'back', equipment: 'cable', difficulty: 'beginner', exerciseType: 'strength', secondaryMuscles: ['biceps'] },
  { name: 'Pull-Up', namePt: 'Barra Fixa (Pegada Pronada)', muscleGroup: 'back', equipment: 'bodyweight', difficulty: 'advanced', exerciseType: 'strength', secondaryMuscles: ['biceps', 'forearms'] },
  { name: 'Chin-Up', namePt: 'Barra Fixa (Pegada Supinada)', muscleGroup: 'back', equipment: 'bodyweight', difficulty: 'advanced', exerciseType: 'strength', secondaryMuscles: ['biceps'] },
  { name: 'Face Pull', namePt: 'Face Pull', muscleGroup: 'back', equipment: 'cable', difficulty: 'beginner', exerciseType: 'strength', secondaryMuscles: ['shoulders'] },
  { name: 'Straight-Arm Pulldown', namePt: 'Pulldown Braço Estendido', muscleGroup: 'back', equipment: 'cable', difficulty: 'intermediate', exerciseType: 'strength', secondaryMuscles: ['abs'] },
  { name: 'Machine Row', namePt: 'Remada na Máquina', muscleGroup: 'back', equipment: 'machine', difficulty: 'beginner', exerciseType: 'strength', secondaryMuscles: ['biceps'] },
  { name: 'Hyperextension', namePt: 'Hiperextensão Lombar', muscleGroup: 'back', equipment: 'bodyweight', difficulty: 'beginner', exerciseType: 'strength', secondaryMuscles: ['glutes'] },
  { name: 'Dumbbell Pullover', namePt: 'Pullover com Halter', muscleGroup: 'back', equipment: 'dumbbell', difficulty: 'intermediate', exerciseType: 'strength', secondaryMuscles: ['chest'] },
  { name: 'Rack Pull', namePt: 'Rack Pull', muscleGroup: 'back', equipment: 'barbell', difficulty: 'intermediate', exerciseType: 'strength', secondaryMuscles: ['forearms', 'glutes'] },
  { name: 'Meadows Row', namePt: 'Remada Meadows', muscleGroup: 'back', equipment: 'barbell', difficulty: 'advanced', exerciseType: 'strength', secondaryMuscles: ['biceps'] },
  { name: 'Inverted Row', namePt: 'Remada Invertida', muscleGroup: 'back', equipment: 'bodyweight', difficulty: 'beginner', exerciseType: 'strength', secondaryMuscles: ['biceps'] },

  // Pernas (legs) — 20 exercícios
  { name: 'Barbell Back Squat', namePt: 'Agachamento Livre', muscleGroup: 'legs', equipment: 'barbell', difficulty: 'intermediate', exerciseType: 'strength', secondaryMuscles: ['glutes', 'abs'] },
  { name: 'Front Squat', namePt: 'Agachamento Frontal', muscleGroup: 'legs', equipment: 'barbell', difficulty: 'advanced', exerciseType: 'strength', secondaryMuscles: ['abs', 'glutes'] },
  { name: 'Leg Press', namePt: 'Leg Press', muscleGroup: 'legs', equipment: 'machine', difficulty: 'beginner', exerciseType: 'strength', secondaryMuscles: ['glutes'] },
  { name: 'Hack Squat', namePt: 'Hack Squat', muscleGroup: 'legs', equipment: 'machine', difficulty: 'intermediate', exerciseType: 'strength', secondaryMuscles: ['glutes'] },
  { name: 'Leg Extension', namePt: 'Cadeira Extensora', muscleGroup: 'legs', equipment: 'machine', difficulty: 'beginner', exerciseType: 'strength' },
  { name: 'Lying Leg Curl', namePt: 'Mesa Flexora', muscleGroup: 'legs', equipment: 'machine', difficulty: 'beginner', exerciseType: 'strength', secondaryMuscles: ['glutes'] },
  { name: 'Seated Leg Curl', namePt: 'Cadeira Flexora', muscleGroup: 'legs', equipment: 'machine', difficulty: 'beginner', exerciseType: 'strength' },
  { name: 'Romanian Deadlift', namePt: 'Levantamento Terra Romeno', muscleGroup: 'legs', equipment: 'barbell', difficulty: 'intermediate', exerciseType: 'strength', secondaryMuscles: ['glutes', 'back'] },
  { name: 'Dumbbell Romanian Deadlift', namePt: 'Stiff com Halteres', muscleGroup: 'legs', equipment: 'dumbbell', difficulty: 'intermediate', exerciseType: 'strength', secondaryMuscles: ['glutes', 'back'] },
  { name: 'Bulgarian Split Squat', namePt: 'Agachamento Búlgaro', muscleGroup: 'legs', equipment: 'dumbbell', difficulty: 'intermediate', exerciseType: 'strength', secondaryMuscles: ['glutes'] },
  { name: 'Walking Lunge', namePt: 'Avanço com Passada', muscleGroup: 'legs', equipment: 'dumbbell', difficulty: 'intermediate', exerciseType: 'strength', secondaryMuscles: ['glutes'] },
  { name: 'Stationary Lunge', namePt: 'Avanço Estacionário', muscleGroup: 'legs', equipment: 'dumbbell', difficulty: 'beginner', exerciseType: 'strength', secondaryMuscles: ['glutes'] },
  { name: 'Goblet Squat', namePt: 'Agachamento Goblet', muscleGroup: 'legs', equipment: 'dumbbell', difficulty: 'beginner', exerciseType: 'strength', secondaryMuscles: ['abs', 'glutes'] },
  { name: 'Smith Machine Squat', namePt: 'Agachamento no Smith', muscleGroup: 'legs', equipment: 'machine', difficulty: 'beginner', exerciseType: 'strength', secondaryMuscles: ['glutes'] },
  { name: 'Leg Press Calf Raise', namePt: 'Panturrilha no Leg Press', muscleGroup: 'legs', equipment: 'machine', difficulty: 'beginner', exerciseType: 'strength' },
  { name: 'Sumo Deadlift', namePt: 'Levantamento Terra Sumo', muscleGroup: 'legs', equipment: 'barbell', difficulty: 'advanced', exerciseType: 'strength', secondaryMuscles: ['glutes', 'back'] },
  { name: 'Sissy Squat', namePt: 'Sissy Squat', muscleGroup: 'legs', equipment: 'bodyweight', difficulty: 'advanced', exerciseType: 'strength' },
  { name: 'Step-Up', namePt: 'Step-Up com Halter', muscleGroup: 'legs', equipment: 'dumbbell', difficulty: 'beginner', exerciseType: 'strength', secondaryMuscles: ['glutes'] },
  { name: 'Box Squat', namePt: 'Agachamento no Caixote', muscleGroup: 'legs', equipment: 'barbell', difficulty: 'intermediate', exerciseType: 'strength', secondaryMuscles: ['glutes'] },
  { name: 'Good Morning', namePt: 'Good Morning', muscleGroup: 'legs', equipment: 'barbell', difficulty: 'intermediate', exerciseType: 'strength', secondaryMuscles: ['glutes', 'back'] },

  // Glúteos (glutes) — 8 exercícios
  { name: 'Barbell Hip Thrust', namePt: 'Hip Thrust com Barra', muscleGroup: 'glutes', equipment: 'barbell', difficulty: 'intermediate', exerciseType: 'strength', secondaryMuscles: ['legs'] },
  { name: 'Glute Bridge', namePt: 'Elevação de Quadril', muscleGroup: 'glutes', equipment: 'bodyweight', difficulty: 'beginner', exerciseType: 'strength', secondaryMuscles: ['legs'] },
  { name: 'Dumbbell Hip Thrust', namePt: 'Hip Thrust com Halter', muscleGroup: 'glutes', equipment: 'dumbbell', difficulty: 'beginner', exerciseType: 'strength', secondaryMuscles: ['legs'] },
  { name: 'Cable Kickback', namePt: 'Coice no Cabo', muscleGroup: 'glutes', equipment: 'cable', difficulty: 'beginner', exerciseType: 'strength' },
  { name: 'Cable Hip Abduction', namePt: 'Abdução de Quadril no Cabo', muscleGroup: 'glutes', equipment: 'cable', difficulty: 'beginner', exerciseType: 'strength' },
  { name: 'Sumo Squat', namePt: 'Agachamento Sumô', muscleGroup: 'glutes', equipment: 'dumbbell', difficulty: 'beginner', exerciseType: 'strength', secondaryMuscles: ['legs'] },
  { name: 'Frog Pump', namePt: 'Frog Pump', muscleGroup: 'glutes', equipment: 'bodyweight', difficulty: 'beginner', exerciseType: 'strength' },
  { name: 'Machine Hip Abduction', namePt: 'Cadeira Abdutora', muscleGroup: 'glutes', equipment: 'machine', difficulty: 'beginner', exerciseType: 'strength' },

  // Ombros (shoulders) — 15 exercícios
  { name: 'Barbell Overhead Press', namePt: 'Desenvolvimento com Barra', muscleGroup: 'shoulders', equipment: 'barbell', difficulty: 'intermediate', exerciseType: 'strength', secondaryMuscles: ['triceps'] },
  { name: 'Dumbbell Shoulder Press', namePt: 'Desenvolvimento com Halteres', muscleGroup: 'shoulders', equipment: 'dumbbell', difficulty: 'intermediate', exerciseType: 'strength', secondaryMuscles: ['triceps'] },
  { name: 'Arnold Press', namePt: 'Arnold Press', muscleGroup: 'shoulders', equipment: 'dumbbell', difficulty: 'intermediate', exerciseType: 'strength', secondaryMuscles: ['triceps'] },
  { name: 'Dumbbell Lateral Raise', namePt: 'Elevação Lateral com Halteres', muscleGroup: 'shoulders', equipment: 'dumbbell', difficulty: 'beginner', exerciseType: 'strength' },
  { name: 'Cable Lateral Raise', namePt: 'Elevação Lateral no Cabo', muscleGroup: 'shoulders', equipment: 'cable', difficulty: 'beginner', exerciseType: 'strength' },
  { name: 'Dumbbell Front Raise', namePt: 'Elevação Frontal com Halteres', muscleGroup: 'shoulders', equipment: 'dumbbell', difficulty: 'beginner', exerciseType: 'strength', secondaryMuscles: ['chest'] },
  { name: 'Rear Delt Fly', namePt: 'Crucifixo Inverso', muscleGroup: 'shoulders', equipment: 'dumbbell', difficulty: 'beginner', exerciseType: 'strength', secondaryMuscles: ['back'] },
  { name: 'Cable Rear Delt Fly', namePt: 'Crucifixo Inverso no Cabo', muscleGroup: 'shoulders', equipment: 'cable', difficulty: 'beginner', exerciseType: 'strength', secondaryMuscles: ['back'] },
  { name: 'Upright Row', namePt: 'Remada Alta', muscleGroup: 'shoulders', equipment: 'barbell', difficulty: 'intermediate', exerciseType: 'strength', secondaryMuscles: ['biceps'] },
  { name: 'Machine Shoulder Press', namePt: 'Desenvolvimento na Máquina', muscleGroup: 'shoulders', equipment: 'machine', difficulty: 'beginner', exerciseType: 'strength', secondaryMuscles: ['triceps'] },
  { name: 'Barbell Shrug', namePt: 'Encolhimento com Barra', muscleGroup: 'shoulders', equipment: 'barbell', difficulty: 'beginner', exerciseType: 'strength' },
  { name: 'Dumbbell Shrug', namePt: 'Encolhimento com Halteres', muscleGroup: 'shoulders', equipment: 'dumbbell', difficulty: 'beginner', exerciseType: 'strength' },
  { name: 'Behind the Neck Press', namePt: 'Desenvolvimento por Trás', muscleGroup: 'shoulders', equipment: 'barbell', difficulty: 'advanced', exerciseType: 'strength', secondaryMuscles: ['triceps'] },
  { name: 'Plate Front Raise', namePt: 'Elevação Frontal com Anilha', muscleGroup: 'shoulders', equipment: 'other', difficulty: 'beginner', exerciseType: 'strength' },
  { name: 'Bradford Press', namePt: 'Bradford Press', muscleGroup: 'shoulders', equipment: 'barbell', difficulty: 'advanced', exerciseType: 'strength', secondaryMuscles: ['triceps'] },

  // Bíceps (biceps) — 12 exercícios
  { name: 'Barbell Curl', namePt: 'Rosca Direta com Barra', muscleGroup: 'biceps', equipment: 'barbell', difficulty: 'beginner', exerciseType: 'strength', secondaryMuscles: ['forearms'] },
  { name: 'EZ-Bar Curl', namePt: 'Rosca Direta com Barra W', muscleGroup: 'biceps', equipment: 'barbell', difficulty: 'beginner', exerciseType: 'strength', secondaryMuscles: ['forearms'] },
  { name: 'Dumbbell Bicep Curl', namePt: 'Rosca Direta com Halteres', muscleGroup: 'biceps', equipment: 'dumbbell', difficulty: 'beginner', exerciseType: 'strength', secondaryMuscles: ['forearms'] },
  { name: 'Hammer Curl', namePt: 'Rosca Martelo', muscleGroup: 'biceps', equipment: 'dumbbell', difficulty: 'beginner', exerciseType: 'strength', secondaryMuscles: ['forearms'] },
  { name: 'Preacher Curl', namePt: 'Rosca Scott', muscleGroup: 'biceps', equipment: 'barbell', difficulty: 'intermediate', exerciseType: 'strength' },
  { name: 'Concentration Curl', namePt: 'Rosca Concentrada', muscleGroup: 'biceps', equipment: 'dumbbell', difficulty: 'beginner', exerciseType: 'strength' },
  { name: 'Cable Curl', namePt: 'Rosca no Cabo', muscleGroup: 'biceps', equipment: 'cable', difficulty: 'beginner', exerciseType: 'strength', secondaryMuscles: ['forearms'] },
  { name: 'Incline Dumbbell Curl', namePt: 'Rosca Inclinada com Halteres', muscleGroup: 'biceps', equipment: 'dumbbell', difficulty: 'intermediate', exerciseType: 'strength' },
  { name: 'Spider Curl', namePt: 'Rosca Spider', muscleGroup: 'biceps', equipment: 'dumbbell', difficulty: 'intermediate', exerciseType: 'strength' },
  { name: 'Reverse Curl', namePt: 'Rosca Inversa', muscleGroup: 'biceps', equipment: 'barbell', difficulty: 'intermediate', exerciseType: 'strength', secondaryMuscles: ['forearms'] },
  { name: 'Cable Hammer Curl', namePt: 'Rosca Martelo no Cabo (Corda)', muscleGroup: 'biceps', equipment: 'cable', difficulty: 'beginner', exerciseType: 'strength', secondaryMuscles: ['forearms'] },
  { name: 'Machine Bicep Curl', namePt: 'Rosca na Máquina', muscleGroup: 'biceps', equipment: 'machine', difficulty: 'beginner', exerciseType: 'strength' },

  // Tríceps (triceps) — 12 exercícios
  { name: 'Cable Tricep Pushdown', namePt: 'Tríceps Pulley (Corda)', muscleGroup: 'triceps', equipment: 'cable', difficulty: 'beginner', exerciseType: 'strength' },
  { name: 'Cable Tricep Pushdown Bar', namePt: 'Tríceps Pulley (Barra)', muscleGroup: 'triceps', equipment: 'cable', difficulty: 'beginner', exerciseType: 'strength' },
  { name: 'Skull Crusher', namePt: 'Tríceps Testa (Skull Crusher)', muscleGroup: 'triceps', equipment: 'barbell', difficulty: 'intermediate', exerciseType: 'strength' },
  { name: 'Overhead Tricep Extension', namePt: 'Tríceps Francês', muscleGroup: 'triceps', equipment: 'dumbbell', difficulty: 'intermediate', exerciseType: 'strength' },
  { name: 'Dumbbell Kickback', namePt: 'Tríceps Coice com Halter', muscleGroup: 'triceps', equipment: 'dumbbell', difficulty: 'beginner', exerciseType: 'strength' },
  { name: 'Close-Grip Bench Press', namePt: 'Supino Pegada Fechada', muscleGroup: 'triceps', equipment: 'barbell', difficulty: 'intermediate', exerciseType: 'strength', secondaryMuscles: ['chest', 'shoulders'] },
  { name: 'Tricep Dip', namePt: 'Mergulho para Tríceps', muscleGroup: 'triceps', equipment: 'bodyweight', difficulty: 'intermediate', exerciseType: 'strength', secondaryMuscles: ['chest', 'shoulders'] },
  { name: 'Diamond Push-Up', namePt: 'Flexão Diamante', muscleGroup: 'triceps', equipment: 'bodyweight', difficulty: 'intermediate', exerciseType: 'strength', secondaryMuscles: ['chest'] },
  { name: 'Overhead Cable Extension', namePt: 'Tríceps no Cabo sobre a Cabeça', muscleGroup: 'triceps', equipment: 'cable', difficulty: 'intermediate', exerciseType: 'strength' },
  { name: 'Machine Tricep Dip', namePt: 'Tríceps na Máquina', muscleGroup: 'triceps', equipment: 'machine', difficulty: 'beginner', exerciseType: 'strength' },
  { name: 'Single-Arm Tricep Pushdown', namePt: 'Tríceps Unilateral no Cabo', muscleGroup: 'triceps', equipment: 'cable', difficulty: 'beginner', exerciseType: 'strength' },
  { name: 'Bench Dip', namePt: 'Mergulho no Banco', muscleGroup: 'triceps', equipment: 'bodyweight', difficulty: 'beginner', exerciseType: 'strength', secondaryMuscles: ['chest', 'shoulders'] },

  // Abdômen (abs) — 15 exercícios
  { name: 'Crunch', namePt: 'Abdominal (Crunch)', muscleGroup: 'abs', equipment: 'bodyweight', difficulty: 'beginner', exerciseType: 'strength' },
  { name: 'Reverse Crunch', namePt: 'Abdominal Reverso', muscleGroup: 'abs', equipment: 'bodyweight', difficulty: 'beginner', exerciseType: 'strength' },
  { name: 'Plank', namePt: 'Prancha', muscleGroup: 'abs', equipment: 'bodyweight', difficulty: 'beginner', exerciseType: 'strength', secondaryMuscles: ['shoulders'] },
  { name: 'Side Plank', namePt: 'Prancha Lateral', muscleGroup: 'abs', equipment: 'bodyweight', difficulty: 'intermediate', exerciseType: 'strength' },
  { name: 'Hanging Leg Raise', namePt: 'Elevação de Pernas Suspensa', muscleGroup: 'abs', equipment: 'bodyweight', difficulty: 'advanced', exerciseType: 'strength' },
  { name: 'Hanging Knee Raise', namePt: 'Elevação de Joelhos Suspensa', muscleGroup: 'abs', equipment: 'bodyweight', difficulty: 'intermediate', exerciseType: 'strength' },
  { name: 'Cable Crunch', namePt: 'Abdominal no Cabo', muscleGroup: 'abs', equipment: 'cable', difficulty: 'intermediate', exerciseType: 'strength' },
  { name: 'Ab Wheel Rollout', namePt: 'Roda Abdominal', muscleGroup: 'abs', equipment: 'other', difficulty: 'advanced', exerciseType: 'strength', secondaryMuscles: ['shoulders'] },
  { name: 'Russian Twist', namePt: 'Giro Russo (Russian Twist)', muscleGroup: 'abs', equipment: 'bodyweight', difficulty: 'intermediate', exerciseType: 'strength' },
  { name: 'Mountain Climber', namePt: 'Escalador (Mountain Climber)', muscleGroup: 'abs', equipment: 'bodyweight', difficulty: 'beginner', exerciseType: 'cardio', secondaryMuscles: ['shoulders'] },
  { name: 'Bicycle Crunch', namePt: 'Abdominal Bicicleta', muscleGroup: 'abs', equipment: 'bodyweight', difficulty: 'beginner', exerciseType: 'strength' },
  { name: 'Leg Raise', namePt: 'Elevação de Pernas (Deitado)', muscleGroup: 'abs', equipment: 'bodyweight', difficulty: 'beginner', exerciseType: 'strength' },
  { name: 'Dead Bug', namePt: 'Dead Bug', muscleGroup: 'abs', equipment: 'bodyweight', difficulty: 'beginner', exerciseType: 'strength' },
  { name: 'Pallof Press', namePt: 'Pallof Press', muscleGroup: 'abs', equipment: 'cable', difficulty: 'intermediate', exerciseType: 'strength' },
  { name: 'Decline Sit-Up', namePt: 'Abdominal Declinado', muscleGroup: 'abs', equipment: 'bodyweight', difficulty: 'intermediate', exerciseType: 'strength' },

  // Antebraço (forearms) — 5 exercícios
  { name: 'Barbell Wrist Curl', namePt: 'Rosca de Punho com Barra', muscleGroup: 'forearms', equipment: 'barbell', difficulty: 'beginner', exerciseType: 'strength' },
  { name: 'Reverse Wrist Curl', namePt: 'Rosca de Punho Inversa', muscleGroup: 'forearms', equipment: 'barbell', difficulty: 'beginner', exerciseType: 'strength' },
  { name: "Farmer's Walk", namePt: 'Caminhada do Fazendeiro', muscleGroup: 'forearms', equipment: 'dumbbell', difficulty: 'intermediate', exerciseType: 'strength', secondaryMuscles: ['abs', 'shoulders'] },
  { name: 'Plate Pinch Hold', namePt: 'Pinça de Anilha', muscleGroup: 'forearms', equipment: 'other', difficulty: 'intermediate', exerciseType: 'strength' },
  { name: 'Towel Hang', namePt: 'Suspensão na Toalha', muscleGroup: 'forearms', equipment: 'bodyweight', difficulty: 'advanced', exerciseType: 'strength', secondaryMuscles: ['biceps', 'back'] },

  // Panturrilha (calves) — 5 exercícios
  { name: 'Standing Calf Raise', namePt: 'Panturrilha em Pé (Máquina)', muscleGroup: 'calves', equipment: 'machine', difficulty: 'beginner', exerciseType: 'strength' },
  { name: 'Seated Calf Raise', namePt: 'Panturrilha Sentado', muscleGroup: 'calves', equipment: 'machine', difficulty: 'beginner', exerciseType: 'strength' },
  { name: 'Donkey Calf Raise', namePt: 'Panturrilha Donkey', muscleGroup: 'calves', equipment: 'machine', difficulty: 'intermediate', exerciseType: 'strength' },
  { name: 'Single-Leg Calf Raise', namePt: 'Panturrilha Unilateral', muscleGroup: 'calves', equipment: 'bodyweight', difficulty: 'beginner', exerciseType: 'strength' },
  { name: 'Smith Machine Calf Raise', namePt: 'Panturrilha no Smith', muscleGroup: 'calves', equipment: 'machine', difficulty: 'beginner', exerciseType: 'strength' },

  // Cardio (cardio) — 10 exercícios
  { name: 'Treadmill Running', namePt: 'Corrida na Esteira', muscleGroup: 'cardio', equipment: 'machine', difficulty: 'beginner', exerciseType: 'cardio', secondaryMuscles: ['legs'] },
  { name: 'Treadmill Walking', namePt: 'Caminhada na Esteira', muscleGroup: 'cardio', equipment: 'machine', difficulty: 'beginner', exerciseType: 'cardio', secondaryMuscles: ['legs'] },
  { name: 'Stationary Bike', namePt: 'Bicicleta Ergométrica', muscleGroup: 'cardio', equipment: 'machine', difficulty: 'beginner', exerciseType: 'cardio', secondaryMuscles: ['legs'] },
  { name: 'Rowing Machine', namePt: 'Remo Ergométrico', muscleGroup: 'cardio', equipment: 'machine', difficulty: 'intermediate', exerciseType: 'cardio', secondaryMuscles: ['back', 'arms'] },
  { name: 'Elliptical Trainer', namePt: 'Elíptico (Transport)', muscleGroup: 'cardio', equipment: 'machine', difficulty: 'beginner', exerciseType: 'cardio', secondaryMuscles: ['legs'] },
  { name: 'Jump Rope', namePt: 'Pular Corda', muscleGroup: 'cardio', equipment: 'other', difficulty: 'intermediate', exerciseType: 'cardio', secondaryMuscles: ['calves', 'shoulders'] },
  { name: 'Burpee', namePt: 'Burpee', muscleGroup: 'cardio', equipment: 'bodyweight', difficulty: 'advanced', exerciseType: 'plyometrics', secondaryMuscles: ['abs', 'chest', 'legs'] },
  { name: 'Jumping Jack', namePt: 'Polichinelo', muscleGroup: 'cardio', equipment: 'bodyweight', difficulty: 'beginner', exerciseType: 'cardio', secondaryMuscles: ['shoulders'] },
  { name: 'Box Jump', namePt: 'Salto no Caixote', muscleGroup: 'cardio', equipment: 'other', difficulty: 'intermediate', exerciseType: 'plyometrics', secondaryMuscles: ['legs', 'glutes'] },
  { name: 'Battle Ropes', namePt: 'Corda Naval', muscleGroup: 'cardio', equipment: 'other', difficulty: 'intermediate', exerciseType: 'cardio', secondaryMuscles: ['shoulders', 'abs'] },
];

export async function seedExercises() {
  console.log('🏋️  Seeding exercises...');

  for (const exercise of exercises) {
    // Check if exists by name (English name is unique for default exercises)
    const existing = await prisma.exercise.findFirst({
      where: {
        name: exercise.name,
        isCustom: false,
      },
    });

    if (!existing) {
      await prisma.exercise.create({
        data: {
          name: exercise.name,
          namePt: exercise.namePt,
          muscleGroup: exercise.muscleGroup,
          equipment: exercise.equipment,
          difficulty: exercise.difficulty,
          exerciseType: exercise.exerciseType,
          secondaryMuscles: exercise.secondaryMuscles || [],
          isCustom: false,
        },
      });
    }
  }

  const count = await prisma.exercise.count({ where: { isCustom: false } });
  console.log(`✅ ${count} exercises seeded`);
}
