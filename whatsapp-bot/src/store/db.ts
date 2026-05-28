import fs from 'fs';
import path from 'path';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DBPlayer {
  id: string;           // phone number (e.g. "whatsapp:+919876543210")
  name: string;
  city: string;
  sports: string[];
  level: number;
  xp: number;
  title: string;
  streak: number;
  lastCheckinDate: string | null;
  totalSessions: number;
  sportsPlayed: Record<string, number>;
  achievements: string[];
  joinedAt: string;
  registrationStep?: 'awaiting_name' | 'awaiting_city' | 'awaiting_sports' | 'done';
  tempData?: Record<string, unknown>;
}

export interface DBSession {
  id: string;
  sport: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  maxPlayers: number;
  currentPlayers: string[];  // player names
  hostId: string;            // phone number
  hostName: string;
  skillLevel: string;
  notes: string;
  status: 'open' | 'full' | 'completed' | 'cancelled';
  checkedIn: string[];       // phone numbers
}

export interface DB {
  players: DBPlayer[];
  sessions: DBSession[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDbPath(): string {
  return path.resolve(process.env.DB_PATH || './db.json');
}

export function readDB(): DB {
  const dbPath = getDbPath();
  if (!fs.existsSync(dbPath)) {
    const empty: DB = { players: [], sessions: [] };
    fs.writeFileSync(dbPath, JSON.stringify(empty, null, 2), 'utf-8');
    return empty;
  }
  try {
    const raw = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(raw) as DB;
  } catch {
    const empty: DB = { players: [], sessions: [] };
    fs.writeFileSync(dbPath, JSON.stringify(empty, null, 2), 'utf-8');
    return empty;
  }
}

export function writeDB(db: DB): void {
  const dbPath = getDbPath();
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
}

export function getPlayer(id: string): DBPlayer | undefined {
  const db = readDB();
  return db.players.find((p) => p.id === id);
}

export function savePlayer(player: DBPlayer): void {
  const db = readDB();
  const idx = db.players.findIndex((p) => p.id === player.id);
  if (idx === -1) {
    db.players.push(player);
  } else {
    db.players[idx] = player;
  }
  writeDB(db);
}

export function getSessions(): DBSession[] {
  return readDB().sessions;
}

export function saveSession(session: DBSession): void {
  const db = readDB();
  const idx = db.sessions.findIndex((s) => s.id === session.id);
  if (idx === -1) {
    db.sessions.push(session);
  } else {
    db.sessions[idx] = session;
  }
  writeDB(db);
}

export function updateSession(id: string, updates: Partial<DBSession>): void {
  const db = readDB();
  const idx = db.sessions.findIndex((s) => s.id === id);
  if (idx !== -1) {
    db.sessions[idx] = { ...db.sessions[idx], ...updates };
    writeDB(db);
  }
}
