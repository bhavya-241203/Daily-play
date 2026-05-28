import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Player, MatchSession, Sport, MatchResult } from '../types';
import { calculateXpEarned, updatePlayerAfterMatch, isFirstMatchOfDay, getXpForLevel, getTitleForLevel } from '../utils/xpSystem';
import { checkNewAchievements } from '../utils/achievements';

interface GameStore {
  player: Player | null;
  sessions: MatchSession[];
  pendingSession: Partial<MatchSession> | null;
  lastXpResult: {
    xpEarned: number;
    newAchievements: string[];
    leveledUp: boolean;
    breakdown: string[];
  } | null;

  createPlayer: (name: string, avatar: string, favoriteSport: Sport) => void;
  setPendingSession: (session: Partial<MatchSession> | null) => void;
  recordMatch: (
    result: MatchResult,
    score: string,
    notes: string
  ) => void;
  checkAchievements: () => void;
  resetDay: () => void;
  clearLastXpResult: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      player: null,
      sessions: [],
      pendingSession: null,
      lastXpResult: null,

      createPlayer: (name, avatar, favoriteSport) => {
        const player: Player = {
          id: crypto.randomUUID(),
          name,
          avatar,
          createdAt: new Date().toISOString(),
          level: 1,
          xp: 0,
          xpToNextLevel: getXpForLevel(1),
          title: getTitleForLevel(1),
          streak: 0,
          lastPlayedDate: null,
          totalMatches: 0,
          totalWins: 0,
          sports: {
            cricket: { matches: 0, wins: 0, skill: 0, xpEarned: 0 },
            badminton: { matches: 0, wins: 0, skill: 0, xpEarned: 0 },
            pickleball: { matches: 0, wins: 0, skill: 0, xpEarned: 0 },
          },
          achievements: [],
          seasonMatches: 0,
          seasonWins: 0,
        };
        // Set favorite sport skill slightly higher
        player.sports[favoriteSport].skill = 10;
        set({ player });
      },

      setPendingSession: (session) => {
        set({ pendingSession: session });
      },

      recordMatch: (result, score, notes) => {
        const { player, sessions, pendingSession } = get();
        if (!player || !pendingSession?.sport || !pendingSession?.format) return;

        const sport = pendingSession.sport;
        const isFirstOfDay = isFirstMatchOfDay(sessions);
        const xpCalc = calculateXpEarned(result, sport, player.streak, isFirstOfDay, score);

        const session: MatchSession = {
          id: crypto.randomUUID(),
          sport,
          date: new Date().toISOString(),
          format: pendingSession.format || '',
          players: pendingSession.players || [],
          venue: pendingSession.venue || '',
          result,
          score,
          xpEarned: xpCalc.total,
          achievements: [],
          notes,
        };

        const playerUpdates = updatePlayerAfterMatch(player, sport, result, xpCalc.total);
        const updatedPlayer = { ...player, ...playerUpdates };

        // Check for new achievements
        const newSessions = [...sessions, session];
        const newAchievements = checkNewAchievements(updatedPlayer, newSessions, updatedPlayer.achievements);
        const newAchievementIds = newAchievements.map(a => a.id);

        // Add achievement XP
        let achievementXp = 0;
        newAchievements.forEach(a => { achievementXp += a.xpReward; });
        let finalPlayer = {
          ...updatedPlayer,
          achievements: [...updatedPlayer.achievements, ...newAchievementIds],
        };

        // Apply achievement XP
        if (achievementXp > 0) {
          let newXp = finalPlayer.xp + achievementXp;
          let newLevel = finalPlayer.level;
          let newXpToNextLevel = finalPlayer.xpToNextLevel;
          while (newXp >= newXpToNextLevel && newLevel < 50) {
            newXp -= newXpToNextLevel;
            newLevel++;
            newXpToNextLevel = getXpForLevel(newLevel);
          }
          finalPlayer = {
            ...finalPlayer,
            xp: newXp,
            level: newLevel,
            xpToNextLevel: newXpToNextLevel,
            title: getTitleForLevel(newLevel),
          };
        }

        session.achievements = newAchievementIds;

        const leveledUp = finalPlayer.level > player.level;

        set({
          player: finalPlayer,
          sessions: newSessions,
          pendingSession: null,
          lastXpResult: {
            xpEarned: xpCalc.total + achievementXp,
            newAchievements: newAchievementIds,
            leveledUp,
            breakdown: xpCalc.breakdown,
          },
        });
      },

      checkAchievements: () => {
        const { player, sessions } = get();
        if (!player) return;
        const newAchievements = checkNewAchievements(player, sessions, player.achievements);
        if (newAchievements.length > 0) {
          set({
            player: {
              ...player,
              achievements: [...player.achievements, ...newAchievements.map(a => a.id)],
            },
          });
        }
      },

      resetDay: () => {
        set({ pendingSession: null, lastXpResult: null });
      },

      clearLastXpResult: () => {
        set({ lastXpResult: null });
      },
    }),
    {
      name: 'daily-play-v1',
    }
  )
);
