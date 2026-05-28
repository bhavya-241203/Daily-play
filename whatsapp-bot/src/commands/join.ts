import { getPlayer, savePlayer, updateSession, getPlayer as getPlayerById } from '../store/db';
import { getSessionById, getOpenSessions } from '../store/sessions';
import { sportEmoji, friendlyDate, friendlyTime } from '../utils/formatter';

export async function handleJoin(from: string, args: string[]): Promise<string> {
  const player = getPlayer(from);

  if (!player || player.registrationStep !== 'done') {
    return `Please register first! Type *register* to get started.`;
  }

  // Get the session number from args
  const numStr = args[0];
  if (!numStr) {
    return `Which session do you want to join? Type *play* to see open sessions, then reply *join [number]*.`;
  }

  const num = parseInt(numStr, 10);
  if (isNaN(num) || num < 1) {
    return `Please provide a valid session number. Type *play* to see open sessions.`;
  }

  // Look up session ID from tempData sessionMap
  const sessionMap = player.tempData?.sessionMap as Record<string, string> | undefined;
  let sessionId: string | undefined;

  if (sessionMap && sessionMap[String(num)]) {
    sessionId = sessionMap[String(num)];
  } else {
    // Fallback: use position in open sessions list for this player's city
    const openSessions = getOpenSessions(player.city);
    const session = openSessions[num - 1];
    if (session) sessionId = session.id;
  }

  if (!sessionId) {
    return `I couldn't find session #${num} 🤔\n\nType *play* to see the latest open sessions.`;
  }

  const session = getSessionById(sessionId);
  if (!session) {
    return `That session no longer exists. Type *play* to see open sessions.`;
  }

  if (session.status === 'full') {
    return `😔 That session is full. Type *play* to find another one.`;
  }
  if (session.status === 'cancelled') {
    return `That session has been cancelled. Type *play* to find another one.`;
  }
  if (session.status === 'completed') {
    return `That session has already completed. Type *play* to find another one.`;
  }

  // Check if already in it
  if (session.currentPlayers.includes(player.name)) {
    return `You're already in this session! 😄\n\n${sportEmoji(session.sport)} *${session.title}*\n📅 ${friendlyDate(session.date)} at ${friendlyTime(session.time)}\n📍 ${session.venue}`;
  }

  // Add player
  const updatedPlayers = [...session.currentPlayers, player.name];
  const newStatus = updatedPlayers.length >= session.maxPlayers ? 'full' : 'open';

  updateSession(session.id, {
    currentPlayers: updatedPlayers,
    status: newStatus,
  });

  const emoji = sportEmoji(session.sport);
  const dateStr = friendlyDate(session.date);
  const timeStr = friendlyTime(session.time);
  const n = updatedPlayers.length;

  return `🎉 *You're in!*

${emoji} *${session.title}*
📅 ${dateStr} at ${timeStr}
📍 ${session.venue}
👥 Now ${n}/${session.maxPlayers === 99 ? '∞' : session.maxPlayers} players

${newStatus === 'full' ? "🔥 Session is now full — you got the last spot!" : "The host will be in touch. See you there! 💪"}

(When you arrive, type *checkin* to earn XP)`;
}
