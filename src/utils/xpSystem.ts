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
