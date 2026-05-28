export type Sport = 'cricket' | 'badminton' | 'pickleball' | 'football' | 'gym' | 'ps5';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'open';
export type SessionStatus = 'open' | 'full' | 'completed' | 'cancelled';

export interface Player {
  id: string;
  name: string;
  avatar: string; // emoji
  city: string;
  sports: Sport[]; // preferred sports
  skillLevels: Partial<Record<Sport, SkillLevel>>;
  level: number;
  xp: number;
  xpToNextLevel: number;
  title: string;
  streak: number;
  lastCheckinDate: string | null;
  totalSessions: number; // total check-ins
  sportsPlayed: Partial<Record<Sport, number>>; // count per sport
  achievements: string[];
  joinedAt: string;
}

export interface GameSession {
  id: string;
  sport: Sport;
  title: string; // e.g. "Sunday morning cricket"
  date: string; // ISO date
  time: string; // "07:00"
  venue: string;
  venueId?: string; // partner turf id if booked
  city: string;
  maxPlayers: number;
  currentPlayers: string[]; // player names/ids who joined
  hostId: string;
  hostName: string;
  hostAvatar: string;
  skillLevel: SkillLevel;
  notes: string;
  status: SessionStatus;
  checkedIn: string[]; // player ids who actually showed up
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  area: string; // neighbourhood
  sports: Sport[];
  pricePerHour: number;
  rating: number; // 1-5
  isPartner: boolean;
  address: string;
  phone: string;
  openTime: string; // "06:00"
  closeTime: string; // "23:00"
  image: string; // emoji representing the venue
}

export interface Tournament {
  id: string;
  name: string;
  sport: Sport;
  city: string;
  venueId: string;
  venueName: string;
  date: string;
  entryFee: number;
  maxTeams: number;
  registeredTeams: { name: string; players: string[] }[];
  status: 'upcoming' | 'ongoing' | 'completed';
  format: 'knockout' | 'round-robin';
  prizePool: number;
  hostId: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
}
