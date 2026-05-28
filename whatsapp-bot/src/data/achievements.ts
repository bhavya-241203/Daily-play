export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_session', name: 'First Touch', description: 'Attend your first session', icon: '👟', xpReward: 100 },
  { id: 'streak_3', name: 'On A Roll', description: '3-day streak', icon: '🔥', xpReward: 150 },
  { id: 'streak_7', name: 'Week Warrior', description: '7-day streak', icon: '⚡', xpReward: 300 },
  { id: 'streak_30', name: 'Iron Player', description: '30-day streak', icon: '🦾', xpReward: 1000 },
  { id: 'sessions_10', name: 'Getting Warmed Up', description: 'Attend 10 sessions', icon: '💪', xpReward: 200 },
  { id: 'sessions_50', name: 'Regular', description: 'Attend 50 sessions', icon: '🏅', xpReward: 500 },
  { id: 'sessions_100', name: 'Century', description: '100 sessions attended', icon: '💯', xpReward: 1000 },
  { id: 'sports_3', name: 'All Rounder', description: 'Play 3 different sports', icon: '🎯', xpReward: 300 },
  { id: 'sports_5', name: 'Omnisport', description: 'Play 5 different sports', icon: '🌟', xpReward: 500 },
  { id: 'host_first', name: 'Organiser', description: 'Host your first session', icon: '📋', xpReward: 150 },
  { id: 'host_10', name: 'Community Builder', description: 'Host 10 sessions', icon: '🏗️', xpReward: 400 },
  { id: 'social_5', name: 'Social Athlete', description: 'Play in a session with 5+ people', icon: '👥', xpReward: 200 },
  { id: 'turf_checkin', name: 'Turf Regular', description: 'Check in at a partner turf', icon: '📍', xpReward: 100 },
  { id: 'level_10', name: 'Rising Star', description: 'Reach Level 10', icon: '⭐', xpReward: 300 },
  { id: 'level_25', name: 'Pro Status', description: 'Reach Level 25', icon: '🏆', xpReward: 750 },
  { id: 'level_50', name: 'Legend', description: 'Reach Level 50', icon: '👑', xpReward: 2000 },
  { id: 'tournament_reg', name: 'Competitor', description: 'Register for a tournament', icon: '🥊', xpReward: 200 },
  { id: 'early_bird', name: 'Early Bird', description: 'Attend a session before 7 AM', icon: '🌅', xpReward: 150 },
  { id: 'cricket_10', name: 'Cricketer', description: 'Attend 10 cricket sessions', icon: '🏏', xpReward: 300 },
  { id: 'badminton_10', name: 'Shuttler', description: 'Attend 10 badminton sessions', icon: '🏸', xpReward: 300 },
];

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
