// XP, Level, Streak, and Title utilities

export interface XPResult {
  xpAwarded: number;
  breakdown: string[];
  streakUpdated: number;
  leveledUp: boolean;
  newLevel: number;
  newTitle: string;
}

const TITLES: Record<number, string> = {
  1: 'Rookie',
  3: 'Newcomer',
  5: 'Regular',
  8: 'Club Player',
  12: 'Dedicated',
  17: 'Enthusiast',
  22: 'Veteran',
  28: 'Elite',
  35: 'Master',
  43: 'Legend',
  50: 'GOAT',
};

export function getTitleForLevel(level: number): string {
  const thresholds = Object.keys(TITLES)
    .map(Number)
    .sort((a, b) => b - a);
  for (const t of thresholds) {
    if (level >= t) return TITLES[t];
  }
  return 'Rookie';
}

export function getXpForLevel(level: number): number {
  return level * 200;
}

export function getLevelFromXp(xp: number): number {
  return Math.min(50, Math.max(1, Math.floor(xp / 200) + 1));
}

export function getXpToNextLevel(xp: number, level: number): number {
  const nextLevelXp = level * 200;
  return Math.max(0, nextLevelXp - xp);
}

export function calculateSessionXp(
  streak: number,
  playersInSession: number,
  sport: string,
  sessionTime?: string,
): { total: number; breakdown: string[] } {
  let total = 0;
  const breakdown: string[] = [];

  // Base XP
  total += 75;
  breakdown.push('Base: +75 XP');

  // Streak bonus
  if (streak >= 7) {
    total += 50;
    breakdown.push('Streak bonus: +50 XP (7+ day streak!)');
  } else if (streak >= 3) {
    total += 25;
    breakdown.push('Streak bonus: +25 XP');
  }

  // Social bonus
  if (playersInSession >= 4) {
    total += 25;
    breakdown.push('Social bonus: +25 XP (4+ players)');
  }

  // Early bird bonus
  if (sessionTime) {
    const hour = parseInt(sessionTime.split(':')[0], 10);
    if (hour < 7) {
      total += 25;
      breakdown.push('Early bird: +25 XP');
    }
  }

  void sport;
  return { total, breakdown };
}

export function updateStreak(lastCheckinDate: string | null): { newStreak: number; multiplier: number } {
  const today = new Date().toISOString().split('T')[0];
  if (!lastCheckinDate) return { newStreak: 1, multiplier: 1 };

  const last = new Date(lastCheckinDate);
  const now = new Date(today);
  const diffDays = Math.round((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Consecutive day — streak continues (caller adds to existing)
    return { newStreak: -1, multiplier: 1 }; // -1 means increment current
  } else if (diffDays === 0) {
    // Same day — no streak change
    return { newStreak: -2, multiplier: 1 }; // -2 means keep current
  } else {
    // Streak broken
    return { newStreak: 1, multiplier: 1 };
  }
}
