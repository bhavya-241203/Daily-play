import { getPlayer, savePlayer } from '../store/db';
import { getOpenSessions } from '../store/sessions';
import { sportEmoji, friendlyDate, friendlyTime } from '../utils/formatter';

export async function handleSessions(from: string): Promise<string> {
  const player = getPlayer(from);

  if (!player || player.registrationStep !== 'done') {
    return `Please register first! Type *register* to get started.`;
  }

  const sessions = getOpenSessions(player.city);

  if (sessions.length === 0) {
    return `No open sessions in ${player.city} right now.\n\nBe the first! Type *create* to host a game. 💪`;
  }

  // Store session index mapping in player tempData
  const sessionMap: Record<string, string> = {};
  sessions.forEach((s, i) => {
    sessionMap[String(i + 1)] = s.id;
  });

  player.tempData = { ...player.tempData, sessionMap, lastView: 'sessions' };
  savePlayer(player);

  const lines: string[] = [`📋 *Open Sessions in ${player.city}*\n`];

  sessions.forEach((session, i) => {
    const emoji = sportEmoji(session.sport);
    const dateStr = friendlyDate(session.date);
    const timeStr = friendlyTime(session.time);
    const spotsLeft = session.maxPlayers - session.currentPlayers.length;

    lines.push(`${i + 1}. ${emoji} *${session.title}*`);
    lines.push(`   📅 ${dateStr} at ${timeStr}`);
    lines.push(`   📍 ${session.venue}`);
    lines.push(`   👥 ${session.currentPlayers.length}/${session.maxPlayers} players · ${session.skillLevel}`);
    if (session.notes) lines.push(`   💬 ${session.notes}`);
    if (spotsLeft <= 2 && spotsLeft > 0) lines.push(`   ⚠️ Only ${spotsLeft} spot${spotsLeft === 1 ? '' : 's'} left!`);
    lines.push('');
  });

  lines.push(`Type *join [number]* to join a session.`);
  lines.push(`Type *create* to host your own.`);

  return lines.join('\n');
}
