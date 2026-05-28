import { Achievement, Player, MatchSession } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_blood',
    name: 'First Blood',
    description: 'Play your very first match',
    icon: '⚔️',
    xpReward: 100,
    condition: (player) => player.totalMatches >= 1,
  },
  {
    id: 'hat_trick',
    name: 'Hat Trick',
    description: 'Win 3 matches in a row',
    icon: '🎩',
    xpReward: 200,
    condition: (_player, sessions) => {
      if (sessions.length < 3) return false;
      const last3 = sessions.slice(-3);
      return last3.every(s => s.result === 'win');
    },
  },
  {
    id: 'century_club',
    name: 'Century Club',
    description: 'Play 100 matches total',
    icon: '💯',
    xpReward: 500,
    condition: (player) => player.totalMatches >= 100,
  },
  {
    id: 'on_fire',
    name: 'On Fire',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    xpReward: 300,
    condition: (player) => player.streak >= 7,
  },
  {
    id: 'cricket_legend',
    name: 'Cricket Legend',
    description: 'Play 50 cricket matches',
    icon: '🏏',
    sport: 'cricket',
    xpReward: 400,
    condition: (player) => player.sports.cricket.matches >= 50,
  },
  {
    id: 'shuttler',
    name: 'Shuttler',
    description: 'Play 50 badminton matches',
    icon: '🏸',
    sport: 'badminton',
    xpReward: 400,
    condition: (player) => player.sports.badminton.matches >= 50,
  },
  {
    id: 'pickler',
    name: 'Pickler',
    description: 'Play 50 pickleball matches',
    icon: '🏓',
    sport: 'pickleball',
    xpReward: 400,
    condition: (player) => player.sports.pickleball.matches >= 50,
  },
  {
    id: 'all_rounder',
    name: 'All Rounder',
    description: 'Play all 3 sports in one day',
    icon: '🌟',
    xpReward: 350,
    condition: (_player, sessions) => {
      const byDate: Record<string, Set<string>> = {};
      for (const s of sessions) {
        const d = s.date.split('T')[0];
        if (!byDate[d]) byDate[d] = new Set();
        byDate[d].add(s.sport);
      }
      return Object.values(byDate).some(sports => sports.size >= 3);
    },
  },
  {
    id: 'dominator',
    name: 'Dominator',
    description: 'Win 10 matches in a row',
    icon: '👑',
    xpReward: 600,
    condition: (_player, sessions) => {
      if (sessions.length < 10) return false;
      const last10 = sessions.slice(-10);
      return last10.every(s => s.result === 'win');
    },
  },
  {
    id: 'comeback_kid',
    name: 'Comeback Kid',
    description: 'Win after 5 consecutive losses',
    icon: '💪',
    xpReward: 400,
    condition: (_player, sessions) => {
      if (sessions.length < 6) return false;
      for (let i = 5; i < sessions.length; i++) {
        const prev5 = sessions.slice(i - 5, i);
        if (prev5.every(s => s.result === 'loss') && sessions[i].result === 'win') {
          return true;
        }
      }
      return false;
    },
  },
  {
    id: 'weekend_warrior',
    name: 'Weekend Warrior',
    description: 'Play on 10 different weekends',
    icon: '🗓️',
    xpReward: 300,
    condition: (_player, sessions) => {
      const weekends = new Set<string>();
      for (const s of sessions) {
        const d = new Date(s.date);
        const day = d.getDay();
        if (day === 0 || day === 6) {
          // Get week identifier (year + week number)
          const weekStart = new Date(d);
          weekStart.setDate(d.getDate() - day);
          weekends.add(weekStart.toISOString().split('T')[0]);
        }
      }
      return weekends.size >= 10;
    },
  },
  {
    id: 'iron_man',
    name: 'Iron Man',
    description: 'Maintain a 30-day streak',
    icon: '🦾',
    xpReward: 1000,
    condition: (player) => player.streak >= 30,
  },
  {
    id: 'century_wins',
    name: 'Century Wins',
    description: 'Accumulate 100 total wins',
    icon: '🏆',
    xpReward: 800,
    condition: (player) => player.totalWins >= 100,
  },
  {
    id: 'rising_star',
    name: 'Rising Star',
    description: 'Reach level 10',
    icon: '⭐',
    xpReward: 500,
    condition: (player) => player.level >= 10,
  },
  {
    id: 'pro_status',
    name: 'Pro Status',
    description: 'Reach level 25',
    icon: '🎯',
    xpReward: 1500,
    condition: (player) => player.level >= 25,
  },
  {
    id: 'legend_status',
    name: 'Legend',
    description: 'Reach level 50',
    icon: '🌌',
    xpReward: 5000,
    condition: (player) => player.level >= 50,
  },
  {
    id: 'winning_ways',
    name: 'Winning Ways',
    description: 'Win 10 matches total',
    icon: '✌️',
    xpReward: 200,
    condition: (player) => player.totalWins >= 10,
  },
  {
    id: 'cricket_master',
    name: 'Cricket Master',
    description: 'Reach skill level 80 in cricket',
    icon: '🎳',
    sport: 'cricket',
    xpReward: 600,
    condition: (player) => player.sports.cricket.skill >= 80,
  },
  {
    id: 'badminton_ace',
    name: 'Badminton Ace',
    description: 'Reach skill level 80 in badminton',
    icon: '🎾',
    sport: 'badminton',
    xpReward: 600,
    condition: (player) => player.sports.badminton.skill >= 80,
  },
  {
    id: 'pickleball_pro',
    name: 'Pickleball Pro',
    description: 'Reach skill level 80 in pickleball',
    icon: '🥇',
    sport: 'pickleball',
    xpReward: 600,
    condition: (player) => player.sports.pickleball.skill >= 80,
  },
  {
    id: 'marathon_player',
    name: 'Marathon Player',
    description: 'Play 25 matches total',
    icon: '🏃',
    xpReward: 250,
    condition: (player) => player.totalMatches >= 25,
  },
  {
    id: 'consistent',
    name: 'Consistent',
    description: 'Play for 5 consecutive days',
    icon: '📅',
    xpReward: 150,
    condition: (player) => player.streak >= 5,
  },
  {
    id: 'sport_explorer',
    name: 'Sport Explorer',
    description: 'Try all 3 sports',
    icon: '🗺️',
    xpReward: 200,
    condition: (player) =>
      player.sports.cricket.matches >= 1 &&
      player.sports.badminton.matches >= 1 &&
      player.sports.pickleball.matches >= 1,
  },
];

export function checkNewAchievements(
  player: Player,
  sessions: MatchSession[],
  alreadyUnlocked: string[]
): Achievement[] {
  return ACHIEVEMENTS.filter(
    a => !alreadyUnlocked.includes(a.id) && a.condition(player, sessions)
  );
}

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}
