import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Player, GameSession, Venue, Tournament, Sport, SkillLevel } from '../types';
import { getXpForLevel, getTitleForLevel } from '../utils/xpSystem';
import { ACHIEVEMENTS } from '../utils/achievements';

// ─── Seed Data ────────────────────────────────────────────────────────────────

export const SEED_VENUES: Venue[] = [
  {
    id: 'v1',
    name: 'Koramangala Sports Arena',
    city: 'Bangalore',
    area: 'Koramangala',
    sports: ['cricket', 'badminton'],
    pricePerHour: 800,
    rating: 4.5,
    isPartner: true,
    address: '5th Block, Koramangala, Bangalore',
    phone: '9876543210',
    openTime: '06:00',
    closeTime: '22:00',
    image: '🏟️',
  },
  {
    id: 'v2',
    name: 'Indiranagar Badminton Club',
    city: 'Bangalore',
    area: 'Indiranagar',
    sports: ['badminton', 'pickleball'],
    pricePerHour: 600,
    rating: 4.8,
    isPartner: true,
    address: '100 Feet Road, Indiranagar, Bangalore',
    phone: '9845012345',
    openTime: '06:00',
    closeTime: '23:00',
    image: '🏸',
  },
  {
    id: 'v3',
    name: 'HSR Layout Ground',
    city: 'Bangalore',
    area: 'HSR Layout',
    sports: ['cricket', 'football'],
    pricePerHour: 1200,
    rating: 4.2,
    isPartner: false,
    address: 'Sector 2, HSR Layout, Bangalore',
    phone: '9980011223',
    openTime: '05:30',
    closeTime: '21:00',
    image: '⚽',
  },
  {
    id: 'v4',
    name: 'Whitefield Fitness Hub',
    city: 'Bangalore',
    area: 'Whitefield',
    sports: ['gym'],
    pricePerHour: 400,
    rating: 4.6,
    isPartner: true,
    address: 'ITPL Main Road, Whitefield, Bangalore',
    phone: '9741122334',
    openTime: '05:00',
    closeTime: '23:00',
    image: '💪',
  },
  {
    id: 'v5',
    name: 'Bandra Turf Club',
    city: 'Mumbai',
    area: 'Bandra',
    sports: ['football', 'cricket'],
    pricePerHour: 1500,
    rating: 4.7,
    isPartner: true,
    address: 'Turner Road, Bandra West, Mumbai',
    phone: '9821100011',
    openTime: '06:00',
    closeTime: '23:00',
    image: '🏟️',
  },
  {
    id: 'v6',
    name: 'Andheri Sports Complex',
    city: 'Mumbai',
    area: 'Andheri',
    sports: ['badminton', 'pickleball', 'gym'],
    pricePerHour: 700,
    rating: 4.4,
    isPartner: true,
    address: 'MIDC Road, Andheri East, Mumbai',
    phone: '9833445566',
    openTime: '06:00',
    closeTime: '22:30',
    image: '🏸',
  },
  {
    id: 'v7',
    name: 'Kothrud Badminton Academy',
    city: 'Pune',
    area: 'Kothrud',
    sports: ['badminton', 'pickleball'],
    pricePerHour: 500,
    rating: 4.9,
    isPartner: true,
    address: 'Karve Road, Kothrud, Pune',
    phone: '9922334455',
    openTime: '06:00',
    closeTime: '22:00',
    image: '🏸',
  },
  {
    id: 'v8',
    name: 'Viman Nagar Cricket Ground',
    city: 'Pune',
    area: 'Viman Nagar',
    sports: ['cricket', 'football'],
    pricePerHour: 900,
    rating: 4.3,
    isPartner: false,
    address: 'Airport Road, Viman Nagar, Pune',
    phone: '9011223344',
    openTime: '05:30',
    closeTime: '21:30',
    image: '🏏',
  },
];

// today = 2026-05-28; seeds are future dates
export const SEED_SESSIONS: GameSession[] = [
  {
    id: 's1',
    sport: 'cricket',
    title: 'Sunday morning cricket',
    date: '2026-06-01',
    time: '07:00',
    venue: 'Koramangala Sports Arena',
    venueId: 'v1',
    city: 'Bangalore',
    maxPlayers: 12,
    currentPlayers: ['Rahul K.', 'Arjun M.', 'Deepak S.', 'Vishal T.'],
    hostId: 'seed_rahul',
    hostName: 'Rahul K.',
    hostAvatar: '🦁',
    skillLevel: 'open',
    notes: 'Bring your own bat if you have one. Whites not required.',
    status: 'open',
    checkedIn: [],
  },
  {
    id: 's2',
    sport: 'badminton',
    title: 'Weekday badminton – 3 courts',
    date: '2026-05-30',
    time: '06:30',
    venue: 'Indiranagar Badminton Club',
    venueId: 'v2',
    city: 'Bangalore',
    maxPlayers: 6,
    currentPlayers: ['Priya S.', 'Neha R.'],
    hostId: 'seed_priya',
    hostName: 'Priya S.',
    hostAvatar: '🦋',
    skillLevel: 'intermediate',
    notes: 'Court booked till 8 AM. Shuttle cocks provided.',
    status: 'open',
    checkedIn: [],
  },
  {
    id: 's3',
    sport: 'football',
    title: 'Evening 7-a-side football',
    date: '2026-05-29',
    time: '18:00',
    venue: 'Bandra Turf Club',
    venueId: 'v5',
    city: 'Mumbai',
    maxPlayers: 14,
    currentPlayers: ['Rohit P.', 'Sachin D.', 'Amol B.', 'Kiran V.', 'Suresh M.'],
    hostId: 'seed_rohit',
    hostName: 'Rohit P.',
    hostAvatar: '🐯',
    skillLevel: 'open',
    notes: 'Boots required. Shin guards recommended.',
    status: 'open',
    checkedIn: [],
  },
  {
    id: 's4',
    sport: 'pickleball',
    title: 'Pickleball starters session',
    date: '2026-06-04',
    time: '07:30',
    venue: 'Kothrud Badminton Academy',
    venueId: 'v7',
    city: 'Pune',
    maxPlayers: 8,
    currentPlayers: ['Ananya K.', 'Meera J.'],
    hostId: 'seed_ananya',
    hostName: 'Ananya K.',
    hostAvatar: '🦅',
    skillLevel: 'beginner',
    notes: 'Perfect for first-timers. Paddles and balls provided.',
    status: 'open',
    checkedIn: [],
  },
  {
    id: 's5',
    sport: 'gym',
    title: 'Early morning gym sesh',
    date: '2026-05-29',
    time: '05:30',
    venue: 'Whitefield Fitness Hub',
    venueId: 'v4',
    city: 'Bangalore',
    maxPlayers: 6,
    currentPlayers: ['Vikram N.', 'Aditya L.', 'Rajan B.'],
    hostId: 'seed_vikram',
    hostName: 'Vikram N.',
    hostAvatar: '🐻',
    skillLevel: 'advanced',
    notes: 'Focus: upper body. Bring a protein shake.',
    status: 'open',
    checkedIn: [],
  },
  {
    id: 's6',
    sport: 'ps5',
    title: 'FIFA tournament night',
    date: '2026-06-06',
    time: '20:00',
    venue: 'Online — Discord #gaming',
    city: 'Bangalore',
    maxPlayers: 8,
    currentPlayers: ['Karthik R.', 'Siddharth M.', 'Nitin A.'],
    hostId: 'seed_karthik',
    hostName: 'Karthik R.',
    hostAvatar: '🐉',
    skillLevel: 'open',
    notes: 'Bracket format. Join Discord server link in notes.',
    status: 'open',
    checkedIn: [],
  },
];

export const SEED_TOURNAMENTS: Tournament[] = [
  {
    id: 't1',
    name: 'Koramangala Cup 2026',
    sport: 'cricket',
    city: 'Bangalore',
    venueId: 'v1',
    venueName: 'Koramangala Sports Arena',
    date: '2026-06-15',
    entryFee: 300,
    maxTeams: 8,
    registeredTeams: [
      { name: 'Koramangala XI', players: ['Rahul K.', 'Arjun M.', 'Deepak S.', 'Vishal T.'] },
      { name: 'Indiranagar Strikers', players: ['Suresh L.', 'Rajan P.', 'Manu K.', 'Dev A.'] },
    ],
    status: 'upcoming',
    format: 'knockout',
    prizePool: 5000,
    hostId: 'seed_rahul',
  },
  {
    id: 't2',
    name: 'Indiranagar Badminton Open',
    sport: 'badminton',
    city: 'Bangalore',
    venueId: 'v2',
    venueName: 'Indiranagar Badminton Club',
    date: '2026-06-22',
    entryFee: 150,
    maxTeams: 16,
    registeredTeams: [
      { name: 'Smash Kings', players: ['Priya S.', 'Neha R.'] },
      { name: 'Net Masters', players: ['Kiran V.', 'Pooja T.'] },
      { name: 'Drop Shots', players: ['Arun M.', 'Shankar B.'] },
    ],
    status: 'upcoming',
    format: 'round-robin',
    prizePool: 3000,
    hostId: 'seed_priya',
  },
  {
    id: 't3',
    name: 'Mumbai Pickleball Fest',
    sport: 'pickleball',
    city: 'Mumbai',
    venueId: 'v6',
    venueName: 'Andheri Sports Complex',
    date: '2026-07-05',
    entryFee: 200,
    maxTeams: 12,
    registeredTeams: [
      { name: 'Pickle Pros', players: ['Rohit P.', 'Sachin D.'] },
    ],
    status: 'upcoming',
    format: 'round-robin',
    prizePool: 4000,
    hostId: 'seed_rohit',
  },
];

// Fake community members for leaderboard
export const COMMUNITY_MEMBERS = [
  { id: 'c1', name: 'Rahul K.', avatar: '🦁', city: 'Bangalore', totalSessions: 34, streak: 12, level: 8 },
  { id: 'c2', name: 'Priya S.', avatar: '🦋', city: 'Bangalore', totalSessions: 29, streak: 7, level: 7 },
  { id: 'c3', name: 'Vikram N.', avatar: '🐻', city: 'Bangalore', totalSessions: 27, streak: 5, level: 6 },
  { id: 'c4', name: 'Rohit P.', avatar: '🐯', city: 'Mumbai', totalSessions: 22, streak: 9, level: 6 },
  { id: 'c5', name: 'Ananya K.', avatar: '🦅', city: 'Pune', totalSessions: 19, streak: 4, level: 5 },
  { id: 'c6', name: 'Karthik R.', avatar: '🐉', city: 'Bangalore', totalSessions: 17, streak: 3, level: 5 },
  { id: 'c7', name: 'Meera J.', avatar: '🔥', city: 'Pune', totalSessions: 15, streak: 2, level: 4 },
  { id: 'c8', name: 'Deepak S.', avatar: '⚡', city: 'Bangalore', totalSessions: 13, streak: 6, level: 4 },
  { id: 'c9', name: 'Sachin D.', avatar: '🦊', city: 'Mumbai', totalSessions: 11, streak: 1, level: 3 },
  { id: 'c10', name: 'Aditya L.', avatar: '🐺', city: 'Bangalore', totalSessions: 9, streak: 2, level: 3 },
];

// ─── Store Types ──────────────────────────────────────────────────────────────

interface CheckinResult {
  xpEarned: number;
  breakdown: { label: string; amount: number }[];
  newAchievements: string[];
  leveledUp: boolean;
  newLevel?: number;
}

interface GameStore {
  player: Player | null;
  sessions: GameSession[];
  venues: Venue[];
  tournaments: Tournament[];
  lastCheckinResult: CheckinResult | null;

  createPlayer: (data: {
    name: string;
    avatar: string;
    city: string;
    sports: Sport[];
    skillLevels: Partial<Record<Sport, SkillLevel>>;
  }) => void;
  updatePlayer: (data: Partial<Pick<Player, 'name' | 'city' | 'sports' | 'skillLevels'>>) => void;
  createSession: (session: Omit<GameSession, 'id' | 'currentPlayers' | 'checkedIn' | 'status'>) => string;
  joinSession: (sessionId: string) => void;
  leaveSession: (sessionId: string) => void;
  checkIn: (sessionId: string) => void;
  cancelSession: (sessionId: string) => void;
  registerTournament: (tournamentId: string, teamName: string, players: string[]) => void;
  clearLastCheckinResult: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function applyXpToPlayer(player: Player, xp: number): Pick<Player, 'xp' | 'level' | 'xpToNextLevel' | 'title'> {
  let newXp = player.xp + xp;
  let newLevel = player.level;
  let newXpToNextLevel = player.xpToNextLevel;

  while (newXp >= newXpToNextLevel && newLevel < 50) {
    newXp -= newXpToNextLevel;
    newLevel++;
    newXpToNextLevel = getXpForLevel(newLevel);
  }

  return {
    xp: newXp,
    level: newLevel,
    xpToNextLevel: newXpToNextLevel,
    title: getTitleForLevel(newLevel),
  };
}

function checkNewAchievements(player: Player, hostedCount: number): string[] {
  const earned: string[] = [];
  const has = (id: string) => player.achievements.includes(id);

  if (!has('first_session') && player.totalSessions >= 1) earned.push('first_session');
  if (!has('streak_3') && player.streak >= 3) earned.push('streak_3');
  if (!has('streak_7') && player.streak >= 7) earned.push('streak_7');
  if (!has('streak_30') && player.streak >= 30) earned.push('streak_30');
  if (!has('sessions_10') && player.totalSessions >= 10) earned.push('sessions_10');
  if (!has('sessions_50') && player.totalSessions >= 50) earned.push('sessions_50');
  if (!has('sessions_100') && player.totalSessions >= 100) earned.push('sessions_100');

  const sportsCount = Object.values(player.sportsPlayed).filter(n => (n ?? 0) > 0).length;
  if (!has('sports_3') && sportsCount >= 3) earned.push('sports_3');
  if (!has('sports_5') && sportsCount >= 5) earned.push('sports_5');

  if (!has('host_first') && hostedCount >= 1) earned.push('host_first');
  if (!has('host_10') && hostedCount >= 10) earned.push('host_10');

  if (!has('level_10') && player.level >= 10) earned.push('level_10');
  if (!has('level_25') && player.level >= 25) earned.push('level_25');
  if (!has('level_50') && player.level >= 50) earned.push('level_50');

  const cricketSessions = player.sportsPlayed['cricket'] ?? 0;
  const badmintonSessions = player.sportsPlayed['badminton'] ?? 0;
  if (!has('cricket_10') && cricketSessions >= 10) earned.push('cricket_10');
  if (!has('badminton_10') && badmintonSessions >= 10) earned.push('badminton_10');

  return earned;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      player: null,
      sessions: SEED_SESSIONS,
      venues: SEED_VENUES,
      tournaments: SEED_TOURNAMENTS,
      lastCheckinResult: null,

      createPlayer: (data) => {
        const player: Player = {
          id: crypto.randomUUID(),
          name: data.name,
          avatar: data.avatar,
          city: data.city,
          sports: data.sports,
          skillLevels: data.skillLevels,
          level: 1,
          xp: 0,
          xpToNextLevel: getXpForLevel(1),
          title: getTitleForLevel(1),
          streak: 0,
          lastCheckinDate: null,
          totalSessions: 0,
          sportsPlayed: {},
          achievements: [],
          joinedAt: new Date().toISOString(),
        };
        set({ player });
      },

      updatePlayer: (data) => {
        const { player } = get();
        if (!player) return;
        set({ player: { ...player, ...data } });
      },

      createSession: (sessionData) => {
        const id = crypto.randomUUID();
        const newSession: GameSession = {
          ...sessionData,
          id,
          currentPlayers: [sessionData.hostName],
          checkedIn: [],
          status: 'open',
        };
        set(state => ({ sessions: [...state.sessions, newSession] }));
        return id;
      },

      joinSession: (sessionId) => {
        const { player, sessions } = get();
        if (!player) return;

        set({
          sessions: sessions.map(s => {
            if (s.id !== sessionId) return s;
            if (s.currentPlayers.includes(player.name)) return s;
            const updated = { ...s, currentPlayers: [...s.currentPlayers, player.name] };
            if (updated.currentPlayers.length >= updated.maxPlayers) {
              updated.status = 'full';
            }
            return updated;
          }),
        });
      },

      leaveSession: (sessionId) => {
        const { player, sessions } = get();
        if (!player) return;

        set({
          sessions: sessions.map(s => {
            if (s.id !== sessionId) return s;
            const updated = {
              ...s,
              currentPlayers: s.currentPlayers.filter(p => p !== player.name),
            };
            if (updated.status === 'full') updated.status = 'open';
            return updated;
          }),
        });
      },

      checkIn: (sessionId) => {
        const { player, sessions } = get();
        if (!player) return;

        const session = sessions.find(s => s.id === sessionId);
        if (!session) return;
        if (session.checkedIn.includes(player.id)) return;

        // Calculate XP
        const breakdown: { label: string; amount: number }[] = [];
        let totalXp = 0;

        // Base XP
        breakdown.push({ label: 'Showed up 🏃', amount: 75 });
        totalXp += 75;

        // Streak bonus
        let newStreak = 1;
        const today = new Date().toISOString().split('T')[0];
        if (player.lastCheckinDate) {
          const last = new Date(player.lastCheckinDate);
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const lastStr = last.toISOString().split('T')[0];
          const yestStr = yesterday.toISOString().split('T')[0];
          if (lastStr === today) {
            newStreak = player.streak; // same day, no change
          } else if (lastStr === yestStr) {
            newStreak = player.streak + 1;
          } else {
            newStreak = 1;
          }
        }

        if (newStreak >= 7) {
          breakdown.push({ label: '7-day streak 🔥🔥', amount: 50 });
          totalXp += 50;
        } else if (newStreak >= 3) {
          breakdown.push({ label: '3-day streak 🔥', amount: 25 });
          totalXp += 25;
        }

        // New sport bonus
        const prevCount = player.sportsPlayed[session.sport] ?? 0;
        if (prevCount === 0) {
          breakdown.push({ label: 'New sport unlocked ⭐', amount: 50 });
          totalXp += 50;
        }

        // Social bonus
        if (session.currentPlayers.length >= 4) {
          breakdown.push({ label: 'Squad goals (4+ players) 👥', amount: 25 });
          totalXp += 25;
        }

        // Early bird bonus
        const [hourStr] = session.time.split(':');
        if (parseInt(hourStr, 10) < 7) {
          breakdown.push({ label: 'Early bird 🌅', amount: 25 });
          totalXp += 25;
        }

        // Update sports played
        const newSportsPlayed: Partial<Record<Sport, number>> = {
          ...player.sportsPlayed,
          [session.sport]: prevCount + 1,
        };

        // Update player base stats
        const updatedPlayer: Player = {
          ...player,
          streak: newStreak,
          lastCheckinDate: today,
          totalSessions: player.totalSessions + 1,
          sportsPlayed: newSportsPlayed,
        };

        // Apply XP (may level up)
        const xpResult = applyXpToPlayer(updatedPlayer, totalXp);
        const playerWithXp: Player = { ...updatedPlayer, ...xpResult };

        // Check hostedCount
        const hostedCount = sessions.filter(s => s.hostId === player.id).length;

        // Check achievements
        const newAchIds = checkNewAchievements(playerWithXp, hostedCount);

        // Check social_5 separately
        if (!playerWithXp.achievements.includes('social_5') && session.currentPlayers.length >= 5) {
          newAchIds.push('social_5');
        }
        // Check turf_checkin
        if (!playerWithXp.achievements.includes('turf_checkin') && session.venueId) {
          const venue = get().venues.find(v => v.id === session.venueId);
          if (venue?.isPartner) {
            newAchIds.push('turf_checkin');
          }
        }
        // Check tournament_reg
        if (!playerWithXp.achievements.includes('early_bird') && parseInt(session.time.split(':')[0], 10) < 7) {
          if (!newAchIds.includes('early_bird')) newAchIds.push('early_bird');
        }

        // Apply achievement XP
        let achXp = 0;
        newAchIds.forEach(id => {
          const ach = ACHIEVEMENTS.find(a => a.id === id);
          if (ach) achXp += ach.xpReward;
        });

        let finalPlayer: Player = {
          ...playerWithXp,
          achievements: [...playerWithXp.achievements, ...newAchIds],
        };

        if (achXp > 0) {
          const achXpResult = applyXpToPlayer(finalPlayer, achXp);
          finalPlayer = { ...finalPlayer, ...achXpResult };
        }

        const leveledUp = finalPlayer.level > player.level;

        // Update session
        const updatedSessions = sessions.map(s => {
          if (s.id !== sessionId) return s;
          return {
            ...s,
            checkedIn: [...s.checkedIn, player.id],
            status: 'completed' as const,
          };
        });

        set({
          player: finalPlayer,
          sessions: updatedSessions,
          lastCheckinResult: {
            xpEarned: totalXp + achXp,
            breakdown,
            newAchievements: newAchIds,
            leveledUp,
            newLevel: leveledUp ? finalPlayer.level : undefined,
          },
        });
      },

      cancelSession: (sessionId) => {
        set(state => ({
          sessions: state.sessions.map(s =>
            s.id === sessionId ? { ...s, status: 'cancelled' as const } : s
          ),
        }));
      },

      registerTournament: (tournamentId, teamName, players) => {
        const { player } = get();
        set(state => ({
          tournaments: state.tournaments.map(t => {
            if (t.id !== tournamentId) return t;
            return {
              ...t,
              registeredTeams: [...t.registeredTeams, { name: teamName, players }],
            };
          }),
        }));

        // Award tournament_reg achievement
        if (player && !player.achievements.includes('tournament_reg')) {
          const ach = ACHIEVEMENTS.find(a => a.id === 'tournament_reg');
          const achXp = ach?.xpReward ?? 0;
          const xpResult = applyXpToPlayer(player, achXp);
          set(state => ({
            player: state.player
              ? {
                  ...state.player,
                  ...xpResult,
                  achievements: [...(state.player.achievements), 'tournament_reg'],
                }
              : null,
          }));
        }
      },

      clearLastCheckinResult: () => {
        set({ lastCheckinResult: null });
      },
    }),
    {
      name: 'daily-play-v2',
    }
  )
);
