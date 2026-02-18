import app from './app';
import { env } from './config/env';
import { eventEmitter, Events } from './events/emitter';
import { detectPersonalRecordListener } from './listeners/detectPersonalRecord.listener';
import { updateStreakListener } from './listeners/updateStreak.listener';
import { checkAchievementsListener } from './listeners/checkAchievements.listener';

const PORT = env.PORT || 8000;

// Register event listeners
eventEmitter.on(Events.SET_LOGGED, detectPersonalRecordListener);
eventEmitter.on(Events.SESSION_COMPLETED, updateStreakListener);
eventEmitter.on(Events.SESSION_COMPLETED, checkAchievementsListener);
eventEmitter.on(Events.ASSESSMENT_CREATED, checkAchievementsListener);

console.log('✅ Event listeners registered');

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 Environment: ${env.NODE_ENV}`);
});
