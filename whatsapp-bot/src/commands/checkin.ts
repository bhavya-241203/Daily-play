import { getPlayer, savePlayer, updateSession } from '../store/db';
import { DBSession } from '../store/db';
import { getTodaySessions, getSessionById } from '../store/sessions';
import { calculateSessionXp, getLevelFromXp, getTitleForLevel, updateStreak } from '../utils/xp';
import { sportEmoji, friendlyTime } from '../utils/formatter';
import { ACHIEVEMENTS, getAchievementById } from '../data/achievements';

function checkNewAchievements(player: ReturnType<typeof getPlayer> & object): string[] {
  if (!player) return [];
  const earned: string[] = [];

  const check = (id: string, condition: boolean) => {
    if (condition && !player.achievements.includes(id)) {
      player.achievements.push(id);
      earned.push(id);
    }
  };

  check('first_session', player.totalSessions >= 1);
  check('streak_3', player.streak >= 3);
  check('streak_7', player.streak >= 7);
  check('streak_30', player.streak >= 30);
  check('sessions_10', player.totalSessions >= 10);
  check('sessions_50', player.totalSessions >= 50);
  check('sessions_100', player.totalSessions >= 100);
  check('sports_3', Object.keys(player.sportsPlayed).length >= 3);
  check('sports_5', Object.keys(player.sportsPlayed).length >= 5);

  const cricketSessions = player.sportsPlayed['cricket'] || 0;
  const badmintonSessions = player.sportsPlayed['badminton'] || 0;
  check('cricket_10', cricketSessions >= 10);
  check('badminton_10', badmintonSessions >= 10);
  check('level_10', player.level >= 10);
  check('level_25', player.level >= 25);
  check('level_50', player.level >= 50);

  return earned;
}

export async function handleCheckin(from: string, body: string): Promise<string> {
  const player = getPlayer(from);

  if (!player || player.registrationStep !== 'done') {
    return `Please register first! Type *register* to get started.`;
  }

  const todaySessions = getTodaySessions(from);

  if (todaySessions.length === 0) {
    return `You don't have any sessions today. Join one first! Type *play* to find a game 🏃`;
  }

  // Check if selecting from multiple sessions
  const checkinStep = player.tempData?.checkinStep as string | undefined;

  if (todaySessions.length > 1 && !checkinStep) {
    // Ask which session
    const sessionMap: Record<string, string> = {};
    const lines = [`You have ${todaySessions.length} sessions today! Which one are you checking into?\n`];
    todaySessions.forEach((s, i) => {
      sessionMap[String(i + 1)] = s.id;
      lines.push(`${i + 1}. ${sportEmoji(s.sport)} *${s.title}* at ${friendlyTime(s.time)} — ${s.venue}`);
    });
    player.tempData = { ...player.tempData, checkinStep: 'awaiting_session_choice', checkinSessionMap: sessionMap };
    savePlayer(player);
    return lines.join('\n');
  }

  let sessionToCheckin: DBSession | undefined;

  if (checkinStep === 'awaiting_session_choice') {
    const num = parseInt(body.trim(), 10);
    const checkinSessionMap = player.tempData?.checkinSessionMap as Record<string, string> | undefined;
    const sessionId = checkinSessionMap?.[String(num)];
    if (!sessionId) {
      const lines = [`Please type the number of your session:\n`];
      todaySessions.forEach((s, i) => {
        lines.push(`${i + 1}. ${sportEmoji(s.sport)} *${s.title}*`);
      });
      return lines.join('\n');
    }
    sessionToCheckin = getSessionById(sessionId);
    // Clear checkin state
    const { checkinStep: _cs, checkinSessionMap: _csm, ...rest } = player.tempData || {};
    void _cs; void _csm;
    player.tempData = rest;
    savePlayer(player);
  } else {
    sessionToCheckin = todaySessions[0];
  }

  if (!sessionToCheckin) {
    return `Couldn't find that session. Type *checkin* to try again.`;
  }

  // Already checked in?
  if (sessionToCheckin.checkedIn.includes(from)) {
    return `You've already checked in to ${sessionToCheckin.title}! 📍\nKeep playing! 💪`;
  }

  // Mark check-in
  updateSession(sessionToCheckin.id, {
    checkedIn: [...sessionToCheckin.checkedIn, from],
  });

  // Update streak
  const today = new Date().toISOString().split('T')[0];
  const streakResult = updateStreak(player.lastCheckinDate);
  if (streakResult.newStreak === -1) {
    // Consecutive — increment
    player.streak += 1;
  } else if (streakResult.newStreak === -2) {
    // Same day — keep
  } else {
    player.streak = streakResult.newStreak;
  }
  player.lastCheckinDate = today;

  // Calculate XP
  const { total: xpEarned, breakdown } = calculateSessionXp(
    player.streak,
    sessionToCheckin.currentPlayers.length,
    sessionToCheckin.sport,
    sessionToCheckin.time,
  );

  const oldLevel = player.level;
  player.xp += xpEarned;
  player.totalSessions += 1;
  player.sportsPlayed[sessionToCheckin.sport] = (player.sportsPlayed[sessionToCheckin.sport] || 0) + 1;

  // Recalculate level
  const newLevel = getLevelFromXp(player.xp);
  player.level = newLevel;
  player.title = getTitleForLevel(newLevel);

  // Check achievements
  const newAchievements = checkNewAchievements(player);
  let achievementXp = 0;
  for (const aId of newAchievements) {
    const a = getAchievementById(aId);
    if (a) achievementXp += a.xpReward;
  }
  if (achievementXp > 0) {
    player.xp += achievementXp;
    player.level = getLevelFromXp(player.xp);
    player.title = getTitleForLevel(player.level);
  }

  savePlayer(player);

  const leveledUp = player.level > oldLevel;

  // Build reply
  const lines: string[] = [
    `📍 *Checked In!*`,
    ``,
    `You're at ${sessionToCheckin.venue} 🎉`,
    ``,
    `*+${xpEarned} XP earned*`,
  ];

  for (const b of breakdown) {
    lines.push(`  ${b}`);
  }

  lines.push(``, `🔥 Streak: ${player.streak} day${player.streak === 1 ? '' : 's'}`);
  lines.push(`⚡ Total XP: ${player.xp} · Level ${player.level} ${player.title}`);

  if (leveledUp) {
    lines.push(``, `🎊 *LEVEL UP!* You're now Level ${player.level} — ${player.title}!`);
  }

  for (const aId of newAchievements) {
    const a = getAchievementById(aId);
    if (a) {
      lines.push(`🏅 Achievement unlocked: *${a.name}* — ${a.description} (+${a.xpReward} XP)`);
    }
  }

  lines.push(``, `Keep showing up! 💪`);

  return lines.join('\n');
}
