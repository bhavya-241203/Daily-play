import cron from 'node-cron';
import { readDB } from '../store/db';
import { COMMUNITY_MEMBERS } from '../commands/leaderboard';
import { sendMessage } from '../utils/twilio';

const DAILY_CHALLENGES: Record<number, string> = {
  0: 'Rest day OR play day? Either way — keep the streak alive! 🔥', // Sunday
  1: 'Play a session today and earn 2x XP! 🔥', // Monday
  2: 'Try a new sport this week — bonus XP for first-timers!', // Tuesday
  3: 'Mid-week warrior: check in before noon for +50 bonus XP', // Wednesday
  4: '4 days to the weekend — line up your Saturday game now!', // Thursday
  5: 'Weekend is near! Create a session and invite your crew 🏏', // Friday
  6: 'Peak day! Double XP for any session today 🎉', // Saturday
};

function getTopPlayersForCity(city: string, registeredPlayers: Array<{ name: string; city: string; totalSessions: number; streak: number }>): Array<{ name: string; totalSessions: number; streak: number }> {
  const community = COMMUNITY_MEMBERS.filter((m) => m.city === city);
  const registered = registeredPlayers.filter((p) => p.city === city);

  const all = [
    ...community,
    ...registered.filter((r) => !community.find((c) => c.name === r.name)),
  ];

  all.sort((a, b) => b.totalSessions - a.totalSessions);
  return all.slice(0, 5);
}

export function setupScheduler(): void {
  // Weekly leaderboard — every Monday at 9 AM
  cron.schedule('0 9 * * 1', async () => {
    console.log('[Scheduler] Sending weekly leaderboard...');
    try {
      const db = readDB();
      const registeredPlayers = db.players.filter((p) => p.registrationStep === 'done');

      // Group by city
      const cities = [...new Set(registeredPlayers.map((p) => p.city))];

      for (const city of cities) {
        const playersInCity = registeredPlayers.filter((p) => p.city === city);
        const top5 = getTopPlayersForCity(city, registeredPlayers);

        const MEDALS = ['🥇', '🥈', '🥉', '4.', '5.'];
        const leaderboardLines = [
          `🏅 *Weekly Leaderboard — ${city}*`,
          ``,
          ...top5.map((p, i) => `${MEDALS[i]} ${p.name} — ${p.totalSessions} sessions · 🔥 ${p.streak} day streak`),
          ``,
          `Keep playing to climb the rankings! ⬆️`,
          `Type *leaderboard* to see your rank.`,
        ];

        const message = leaderboardLines.join('\n');

        for (const player of playersInCity) {
          try {
            await sendMessage(player.id, message);
          } catch (err) {
            console.error(`Failed to send leaderboard to ${player.id}:`, err);
          }
        }
      }
    } catch (err) {
      console.error('[Scheduler] Weekly leaderboard error:', err);
    }
  });

  // Daily challenge — every morning at 8 AM
  cron.schedule('0 8 * * *', async () => {
    console.log('[Scheduler] Sending daily challenge...');
    try {
      const db = readDB();
      const registeredPlayers = db.players.filter((p) => p.registrationStep === 'done');

      const dayOfWeek = new Date().getDay();
      const challenge = DAILY_CHALLENGES[dayOfWeek] || DAILY_CHALLENGES[1];

      const message = `🌅 *Daily Play Challenge*\n\n${challenge}\n\nType *play* to find a session near you!`;

      for (const player of registeredPlayers) {
        try {
          await sendMessage(player.id, message);
        } catch (err) {
          console.error(`Failed to send daily challenge to ${player.id}:`, err);
        }
      }
    } catch (err) {
      console.error('[Scheduler] Daily challenge error:', err);
    }
  });

  console.log('[Scheduler] Jobs registered: weekly leaderboard (Mon 9AM), daily challenge (8AM)');
}
