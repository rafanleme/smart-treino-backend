import { PrismaClient } from '@prisma/client';
import { seedExercises } from './exercises.seed';
import { seedAchievements } from './achievements.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Seed exercises first (no dependencies)
    await seedExercises();
    console.log('');

    // Seed achievements (no dependencies)
    await seedAchievements();
    console.log('');

    console.log('✨ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
