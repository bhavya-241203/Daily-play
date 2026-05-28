import { DBSession, getSessions, saveSession, updateSession } from './db';

export function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function getOpenSessions(city: string): DBSession[] {
  return getSessions().filter((s) => s.city === city && s.status === 'open');
}

export function getTodaySessions(playerId: string): DBSession[] {
  const today = new Date().toISOString().split('T')[0];
  return getSessions().filter(
    (s) =>
      s.date === today &&
      s.currentPlayers.length > 0 &&
      (s.hostId === playerId ||
        s.checkedIn.includes(playerId) ||
        s.currentPlayers.includes(playerId)) &&
      s.status !== 'cancelled'
  );
}

export function getSessionById(id: string): DBSession | undefined {
  return getSessions().find((s) => s.id === id);
}

export { getSessions, saveSession, updateSession };
