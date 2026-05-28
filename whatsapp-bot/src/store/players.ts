import { DBPlayer, getPlayer, savePlayer } from './db';
import { getTitleForLevel, getXpForLevel } from '../utils/xp';

export function createNewPlayer(id: string): DBPlayer {
  return {
    id,
    name: '',
    city: '',
    sports: [],
    level: 1,
    xp: 0,
    title: 'Rookie',
    streak: 0,
    lastCheckinDate: null,
    totalSessions: 0,
    sportsPlayed: {},
    achievements: [],
    joinedAt: new Date().toISOString(),
    registrationStep: 'awaiting_name',
    tempData: {},
  };
}

export function isRegistered(player: DBPlayer): boolean {
  return player.registrationStep === 'done';
}

export function addXpToPlayer(player: DBPlayer, xp: number): { leveledUp: boolean; newLevel: number } {
  const oldLevel = player.level;
  player.xp += xp;

  // Recalculate level
  let newLevel = oldLevel;
  while (player.xp >= getXpForLevel(newLevel + 1) * newLevel) {
    // Use cumulative XP approach: each level needs level * 200 XP total
    const xpNeeded = newLevel * 200;
    if (player.xp >= xpNeeded * newLevel) {
      // Simple threshold: level = floor(xp / 200) + 1 capped at 50
      break;
    }
    break;
  }

  // Recalculate level from total XP
  newLevel = Math.min(50, Math.max(1, Math.floor(player.xp / 200) + 1));
  player.level = newLevel;
  player.title = getTitleForLevel(newLevel);

  return { leveledUp: newLevel > oldLevel, newLevel };
}

export { getPlayer, savePlayer };
