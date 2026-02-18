-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `google_id` VARCHAR(191) NULL,
    `avatar_url` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `email_verified_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_google_id_key`(`google_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exercises` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `name_pt` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `description_pt` TEXT NULL,
    `muscle_group` VARCHAR(191) NOT NULL,
    `secondary_muscles` JSON NULL,
    `equipment` VARCHAR(191) NOT NULL,
    `difficulty` VARCHAR(191) NOT NULL,
    `exercise_type` VARCHAR(191) NOT NULL,
    `image_url` VARCHAR(191) NULL,
    `is_custom` BOOLEAN NOT NULL DEFAULT false,
    `created_by` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `exercises_muscle_group_idx`(`muscle_group`),
    INDEX `exercises_equipment_idx`(`equipment`),
    INDEX `exercises_difficulty_idx`(`difficulty`),
    INDEX `exercises_created_by_idx`(`created_by`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workouts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `is_ai_generated` BOOLEAN NOT NULL DEFAULT false,
    `estimated_duration_min` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `workouts_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workout_exercises` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `workout_id` INTEGER NOT NULL,
    `exercise_id` INTEGER NOT NULL,
    `order` INTEGER NOT NULL,
    `sets` INTEGER NOT NULL DEFAULT 3,
    `reps` VARCHAR(191) NOT NULL DEFAULT '12',
    `rest_seconds` INTEGER NOT NULL DEFAULT 60,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `workout_exercises_workout_id_order_idx`(`workout_id`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `training_sessions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `workout_id` INTEGER NULL,
    `workout_name` VARCHAR(191) NULL,
    `started_at` DATETIME(3) NOT NULL,
    `finished_at` DATETIME(3) NULL,
    `duration_seconds` INTEGER NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'in_progress',
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `training_sessions_user_id_status_idx`(`user_id`, `status`),
    INDEX `training_sessions_user_id_started_at_idx`(`user_id`, `started_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session_exercises` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `training_session_id` INTEGER NOT NULL,
    `exercise_id` INTEGER NOT NULL,
    `exercise_name` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,
    `target_sets` INTEGER NOT NULL,
    `target_reps` VARCHAR(191) NOT NULL,
    `started_at` DATETIME(3) NULL,
    `finished_at` DATETIME(3) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `session_exercises_training_session_id_idx`(`training_session_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session_sets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `session_exercise_id` INTEGER NOT NULL,
    `set_number` INTEGER NOT NULL,
    `reps_target` INTEGER NULL,
    `reps_completed` INTEGER NULL,
    `load_kg` DECIMAL(6, 2) NULL,
    `rest_seconds` INTEGER NULL,
    `rpe` INTEGER NULL,
    `completed_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `session_sets_session_exercise_id_idx`(`session_exercise_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `physical_assessments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `assessed_at` DATE NOT NULL,
    `weight_kg` DECIMAL(5, 2) NULL,
    `height_cm` DECIMAL(5, 1) NULL,
    `body_fat_pct` DECIMAL(4, 1) NULL,
    `chest_cm` DECIMAL(5, 1) NULL,
    `waist_cm` DECIMAL(5, 1) NULL,
    `hip_cm` DECIMAL(5, 1) NULL,
    `left_arm_cm` DECIMAL(5, 1) NULL,
    `right_arm_cm` DECIMAL(5, 1) NULL,
    `left_thigh_cm` DECIMAL(5, 1) NULL,
    `right_thigh_cm` DECIMAL(5, 1) NULL,
    `left_calf_cm` DECIMAL(5, 1) NULL,
    `right_calf_cm` DECIMAL(5, 1) NULL,
    `neck_cm` DECIMAL(5, 1) NULL,
    `shoulder_cm` DECIMAL(5, 1) NULL,
    `forearm_cm` DECIMAL(5, 1) NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `physical_assessments_user_id_assessed_at_idx`(`user_id`, `assessed_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `achievements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `name_pt` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `description_pt` TEXT NOT NULL,
    `icon` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `threshold_value` INTEGER NULL,
    `xp_reward` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `achievements_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_achievements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `achievement_id` INTEGER NOT NULL,
    `unlocked_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `user_achievements_user_id_achievement_id_key`(`user_id`, `achievement_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `personal_records` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `exercise_id` INTEGER NOT NULL,
    `load_kg` DECIMAL(6, 2) NOT NULL,
    `reps` INTEGER NOT NULL,
    `achieved_at` DATETIME(3) NOT NULL,
    `session_set_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `personal_records_user_id_exercise_id_idx`(`user_id`, `exercise_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_streaks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `current_streak` INTEGER NOT NULL DEFAULT 0,
    `longest_streak` INTEGER NOT NULL DEFAULT 0,
    `last_activity_date` DATE NULL,
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_streaks_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `exercises` ADD CONSTRAINT `exercises_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workouts` ADD CONSTRAINT `workouts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workout_exercises` ADD CONSTRAINT `workout_exercises_workout_id_fkey` FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workout_exercises` ADD CONSTRAINT `workout_exercises_exercise_id_fkey` FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `training_sessions` ADD CONSTRAINT `training_sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `training_sessions` ADD CONSTRAINT `training_sessions_workout_id_fkey` FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `session_exercises` ADD CONSTRAINT `session_exercises_training_session_id_fkey` FOREIGN KEY (`training_session_id`) REFERENCES `training_sessions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `session_exercises` ADD CONSTRAINT `session_exercises_exercise_id_fkey` FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `session_sets` ADD CONSTRAINT `session_sets_session_exercise_id_fkey` FOREIGN KEY (`session_exercise_id`) REFERENCES `session_exercises`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `physical_assessments` ADD CONSTRAINT `physical_assessments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_achievements` ADD CONSTRAINT `user_achievements_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_achievements` ADD CONSTRAINT `user_achievements_achievement_id_fkey` FOREIGN KEY (`achievement_id`) REFERENCES `achievements`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `personal_records` ADD CONSTRAINT `personal_records_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `personal_records` ADD CONSTRAINT `personal_records_exercise_id_fkey` FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_streaks` ADD CONSTRAINT `user_streaks_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
