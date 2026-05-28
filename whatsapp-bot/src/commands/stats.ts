import { getPlayer } from '../store/db';
import { getLevelFromXp, getTitleForLevel, getXpToNextLevel } from '../utils/xp';
import { sportEmoji, avatarEmoji, progressBar } from '../utils/formatter';
import { ACHIEVEMENTS, getAchievementById } from '../data/achievements';

export async function handleStats(from: string): Promise<string> {
  const player = getPlayer(from);

  if (!player || player.registrationStep !== 'done') {
    return `Please register first! Type *register* to get started.`;
  }

  const level = getLevelFromXp(player.xp);
  const title = getTitleForLevel(level);
  const xpToNext = getXpToNextLevel(player.xp, level);
  const avatar = avatarEmoji(level);
  const nextLevelXp = level * 200;
  const currentLevelXp = (level - 1) * 200;
  const progressXp = player.xp - currentLevelXp;
  const progressMax = nextLevelXp - currentLevelXp;
  const bar = progressBar(Math.min(progressXp, progressMax), Math.max(progressMax, 1));

  const lines: string[] = [
    `📊 *${player.name}'s Career*`,
    ``,
    `${avatar} *Level ${level} · ${title}*`,
    `⚡ ${player.xp} XP · ${xpToNext} to next level`,
    `${bar}`,
    ``,
    `🔥 Streak: ${player.streak} day${player.streak === 1 ? '' : 's'}`,
    `🏆 Sessions: ${player.totalSessions}`,
    ``,
    `*Sports:*`,
  ];

  const sportsEntries = Object.entries(player.sportsPlayed);
  if (sportsEntries.length === 0) {
    lines.push(`No sessions yet — type *play* to find a game!`);
  } else {
    for (const [sport, count] of sportsEntries.sort((a, b) => b[1] - a[1])) {
      lines.push(`${sportEmoji(sport)} ${sport.charAt(0).toUpperCase() + sport.slice(1)}: ${count} session${count === 1 ? '' : 's'}`);
    }
  }

  const totalAchievements = ACHIEVEMENTS.length;
  const unlockedCount = player.achievements.length;
  lines.push(``, `*Achievements: ${unlockedCount}/${totalAchievements}*`);

  // Show last 3 unlocked achievements
  const recentAchievements = player.achievements.slice(-3).reverse();
  if (recentAchievements.length === 0) {
    lines.push(`None yet — keep playing to earn badges! 🏅`);
  } else {
    for (const aId of recentAchievements) {
      const a = getAchievementById(aId);
      if (a) lines.push(`${a.icon} ${a.name}`);
    }
  }

  lines.push(``, `Keep playing to level up! 💪`);

  return lines.join('\n');
}
