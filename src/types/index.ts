export type Sport = 'cricket' | 'badminton' | 'pickleball';
export type MatchResult = 'win' | 'loss' | 'draw' | 'no-result';

export interface Player {
  id: string;
  name: string;
  avatar: string; // emoji
  createdAt: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  title: string; // "Rookie", "Amateur", etc.
  streak: number;
  lastPlayedDate: string | null;
  totalMatches: number;
  totalWins: number;
  sports: {
    cricket: SportStats;
    badminton: SportStats;
    pickleball: SportStats;
  };
  achievements: string[]; // achievement IDs unlocked
  seasonMatches: number;
  seasonWins: number;
}

export interface SportStats {
  matches: number;
  wins: number;
  skill: number; // 0-100
  xpEarned: number;
}

export interface MatchSession {
  id: string;
  sport: Sport;
  date: string;
  format: string; // e.g. "T20", "Singles", "Doubles"
  players: string[]; // player names for the session
  venue: string;
  result: MatchResult;
  score: string; // free text score summary
  xpEarned: number;
  achievements: string[];
  notes: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  sport?: Sport;
  xpReward: number;
  condition: (player: Player, sessions: MatchSession[]) => boolean;
}

export interface DailyChallenge {
  id: string;
  sport: Sport;
  description: string;
  xpReward: number;
  completed: boolean;
}
