import { getPlayer, savePlayer } from '../store/db';
import { createNewPlayer } from '../store/players';
import { parseCommand } from '../utils/parser';
import { handleHelp } from './help';
import { handleRegister, handleRegistrationStep } from './register';
import { handleSessions } from './sessions';
import { handleCreate } from './create';
import { handleJoin } from './join';
import { handleCheckin } from './checkin';
import { handleStats } from './stats';
import { handleVenues } from './venues';
import { handleLeaderboard } from './leaderboard';
import { handleTournaments, handleTournamentRegister } from './tournaments';

export async function handleMessage(from: string, body: string): Promise<string> {
  try {
    let player = getPlayer(from);

    // ── Handle active registration flow ────────────────────────────────────────
    if (player && player.registrationStep !== 'done') {
      return handleRegistrationStep(player, body);
    }

    // ── Handle active create session flow ──────────────────────────────────────
    if (player && player.tempData?.createStep) {
      return handleCreate(from, body);
    }

    // ── Handle active tournament registration flow ─────────────────────────────
    if (player && player.tempData?.tournamentStep) {
      return handleTournaments(from, body);
    }

    // ── Handle active checkin multi-session selection flow ─────────────────────
    if (player && player.tempData?.checkinStep) {
      return handleCheckin(from, body);
    }

    // ── Parse command ──────────────────────────────────────────────────────────
    const parsed = parseCommand(body);

    // ── Route to handler ───────────────────────────────────────────────────────
    switch (parsed.command) {
      case 'start': {
        if (!player) {
          // First-time user — start registration
          const newPlayer = createNewPlayer(from);
          savePlayer(newPlayer);
          return `👋 Welcome to Daily Play! I'm your sports bot.\n\nFirst, what's your name?`;
        }
        if (player.registrationStep !== 'done') {
          return handleRegistrationStep(player, body);
        }
        return `Hey ${player.name}! 👋 Good to see you back!\n\nType *help* to see all commands, or *play* to find a game near you.`;
      }

      case 'register':
        return handleRegister(from, body);

      case 'sessions':
        return handleSessions(from);

      case 'create':
        return handleCreate(from, body);

      case 'join':
        return handleJoin(from, parsed.args);

      case 'checkin':
        return handleCheckin(from, body);

      case 'stats':
        return handleStats(from);

      case 'venues':
        return handleVenues(from);

      case 'leaderboard':
        return handleLeaderboard(from);

      case 'tournaments':
        return handleTournaments(from, body);

      case 'tournament_register':
        return handleTournamentRegister(from, parsed.args);

      case 'help':
        return handleHelp();

      case 'number': {
        // A bare number — could be answering a list question
        // Default: treat as join attempt if player has session map
        if (player && player.tempData?.sessionMap) {
          return handleJoin(from, parsed.args);
        }
        // Fall through to unknown
        return `Hmm, I didn't catch that 🤔\nType *help* to see what I can do!`;
      }

      case 'unknown':
      default: {
        // If player not registered, nudge to register
        if (!player) {
          return `👋 Welcome to Daily Play!\n\nI'm your sports companion bot — no app needed!\n\nType *register* to create your profile and start playing. 🏏`;
        }
        if (player.registrationStep !== 'done') {
          return handleRegistrationStep(player, body);
        }
        return `Hmm, I didn't catch that 🤔\nType *help* to see what I can do!`;
      }
    }
  } catch (err) {
    console.error('Error handling message:', err);
    return `Oops, something went wrong on my end 😅 Try again in a moment!`;
  }
}
