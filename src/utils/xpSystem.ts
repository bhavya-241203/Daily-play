import { Player, MatchResult, Sport } from '../types';

export const LEVEL_TITLES: Record<number, string> = {
  1: 'Rookie', 2: 'Rookie', 3: 'Rookie', 4: 'Rookie', 5: 'Rookie',
  6: 'Apprentice', 7: 'Apprentice', 8: 'Apprentice', 9: 'Apprentice', 10: 'Apprentice',
  11: 'Amateur', 12: 'Amateur', 13: 'Amateur', 14: 'Amateur', 15: 'Amateur',
  16: 'Club Player', 17: 'Club Player', 18: 'Club Player', 19: 'Club Player', 20: 'Club Player',
  21: 'Semi-Pro', 22: 'Semi-Pro', 23: 'Semi-Pro', 24: 'Semi-Pro', 25: 'Semi-Pro',
  26: 'Pro', 27: 'Pro', 28: 'Pro', 29: 'Pro', 30: 'Pro',
  31: 'All-Star', 32: 'All-Star', 33: 'All-Star', 34: 'All-Star', 35: 'All-Star',
  36: 'Elite', 37: 'Elite', 38: 'Elite', 39: 'Elite', 40: 'Elite',
  41: 'Champion', 42: 'Champion', 43: 'Champion', 44: 'Champion', 45: 'Champion',
  46: 'Legend', 47: 'Legend', 48: 'Legend', 49: 'Legend', 50: 'Legend',
};

export function getTitleForLevel(level: number): string {
  return LEVEL_TITLES[Math.min(level, 50)] || 'Legend';
}

export function getXpForLevel(level: number): number {
  return level * 200;
}

export function getLevelFromTotalXp(totalXp: number): { level: number; xp: number; xpToNextLevel: number } {
  let level = 1;
  let xpRemaining = totalXp;

  while (level < 50) {
    const xpNeeded = getXpForLevel(level);
    if (xpRemaining < xpNeeded) break;
    xpRemaining -= xpNeeded;
    level++;
  }

  const xpToNextLevel = getXpForLevel(level);
  return { level, xp: xpRemaining, xpToNextLevel };
}

export interface XpCalculation {
  base: number;
  winBonus: number;
  drawBonus: number;
  streakBonus: number;
  firstOfDayBonus: number;
  total: number;
  breakdown: string[];
}

export function calculateXpEarned(
  result: MatchResult,
  sport: Sport,
  streak: number,
  isFirstOfDay: boolean,
  _score?: string
): XpCalculation {
  const breakdown: string[] = [];
  let total = 0;

  const base = 50;
  total += base;
  breakdown.push(`+${base} Playing`);

  let winBonus = 0;
  let drawBonus = 0;
  if (result === 'win') {
    winBonus = 100;
    total += winBonus;
    breakdown.push(`+${winBonus} Win`);
  } else if (result === 'draw') {
    drawBonus = 25;
    total += drawBonus;
    breakdown.push(`+${drawBonus} Draw`);
  }

  let streakBonus = 0;
  if (streak >= 3) {
    streakBonus = 30;
    total += streakBonus;
    breakdown.push(`+${streakBonus} Streak (${streak} days)`);
  }

  let firstOfDayBonus = 0;
  if (isFirstOfDay) {
    firstOfDayBonus = 20;
    total += firstOfDayBonus;
    breakdown.push(`+${firstOfDayBonus} First match today`);
  }

  // Sport-specific small bonuses
  if (sport === 'cricket' && result === 'win') {
    total += 10;
    breakdown.push(`+10 Cricket victory bonus`);
  }

  return { base, winBonus, drawBonus, streakBonus, firstOfDayBonus, total, breakdown };
}

export function calculateSkillIncrease(result: MatchResult): number {
  if (result === 'win') return 3;
  if (result === 'loss') return 1;
  if (result === 'draw') return 1;
  return 0;
}

export function updatePlayerAfterMatch(
  player: Player,
  sport: Sport,
  result: MatchResult,
  xpEarned: number
): Partial<Player> {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Calculate new streak
  let newStreak = player.streak;
  if (player.lastPlayedDate === today) {
    // Already played today, streak unchanged
    newStreak = player.streak;
  } else if (player.lastPlayedDate === yesterday) {
    // Played yesterday, streak continues
    newStreak = player.streak + 1;
  } else {
    // Missed a day or first time
    newStreak = 1;
  }

  // Calculate new XP and level
  const totalXpEarned = xpEarned;
  const currentTotalXp = player.xp + (player.level - 1) * 200 + totalXpEarned;
  // Simple accumulation: add xp to current, level up if needed
  let newXp = player.xp + totalXpEarned;
  let newLevel = player.level;
  let newXpToNextLevel = player.xpToNextLevel;

  while (newXp >= newXpToNextLevel && newLevel < 50) {
    newXp -= newXpToNextLevel;
    newLevel++;
    newXpToNextLevel = getXpForLevel(newLevel);
  }

  void currentTotalXp; // used conceptually

  const skillIncrease = calculateSkillIncrease(result);
  const currentSportStats = player.sports[sport];
  const newSkill = Math.min(100, currentSportStats.skill + skillIncrease);

  const updatedSports = {
    ...player.sports,
    [sport]: {
      matches: currentSportStats.matches + 1,
      wins: currentSportStats.wins + (result === 'win' ? 1 : 0),
      skill: newSkill,
      xpEarned: currentSportStats.xpEarned + totalXpEarned,
    },
  };

  return {
    level: newLevel,
    xp: newXp,
    xpToNextLevel: newXpToNextLevel,
    title: getTitleForLevel(newLevel),
    streak: newStreak,
    lastPlayedDate: today,
    totalMatches: player.totalMatches + 1,
    totalWins: player.totalWins + (result === 'win' ? 1 : 0),
    sports: updatedSports,
    seasonMatches: player.seasonMatches + 1,
    seasonWins: player.seasonWins + (result === 'win' ? 1 : 0),
  };
}

export function isFirstMatchOfDay(sessions: { date: string }[]): boolean {
  const today = new Date().toISOString().split('T')[0];
  return !sessions.some(s => s.date.startsWith(today));
}
