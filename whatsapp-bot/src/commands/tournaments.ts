import { getPlayer, savePlayer } from '../store/db';
import { TOURNAMENTS } from '../data/tournaments';
import { sportEmoji, friendlyDate } from '../utils/formatter';

function formatTournamentDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

export async function handleTournaments(from: string, body: string): Promise<string> {
  const player = getPlayer(from);

  if (!player || player.registrationStep !== 'done') {
    return `Please register first! Type *register* to get started.`;
  }

  const tournamentStep = player.tempData?.tournamentStep as string | undefined;

  if (!tournamentStep) {
    // List tournaments
    const lines: string[] = [`🥊 *Upcoming Tournaments*\n`];

    // Store tournament index mapping
    const tournamentMap: Record<string, string> = {};
    TOURNAMENTS.forEach((t, i) => {
      tournamentMap[String(i + 1)] = t.id;
    });
    player.tempData = { ...player.tempData, tournamentMap };
    savePlayer(player);

    TOURNAMENTS.forEach((t, i) => {
      const emoji = sportEmoji(t.sport);
      lines.push(`${i + 1}. ${emoji} *${t.name}*`);
      lines.push(`   📅 ${formatTournamentDate(t.date)} · ${t.venue}, ${t.city}`);
      lines.push(`   💰 ₹${t.entryFee} entry · 🏆 ₹${t.prizePool} prize pool`);
      lines.push(`   🔄 ${t.format} · 👥 ${t.registeredTeams}/${t.maxTeams} teams registered`);
      lines.push(`   Type *register tournament ${i + 1}* to enter your team`);
      lines.push('');
    });

    return lines.join('\n').trim();
  }

  return handleTournamentFlow(player, body, tournamentStep);
}

export async function handleTournamentRegister(from: string, args: string[]): Promise<string> {
  const player = getPlayer(from);

  if (!player || player.registrationStep !== 'done') {
    return `Please register first! Type *register* to get started.`;
  }

  const numStr = args[0];
  const num = numStr ? parseInt(numStr, 10) : NaN;
  const tournamentMap = player.tempData?.tournamentMap as Record<string, string> | undefined;
  const tournamentId = tournamentMap?.[String(num)] || TOURNAMENTS[num - 1]?.id;

  if (!tournamentId || isNaN(num)) {
    return `Please specify which tournament to register for.\n\nType *tournaments* to see the list.`;
  }

  const tournament = TOURNAMENTS.find((t) => t.id === tournamentId);
  if (!tournament) {
    return `Tournament not found. Type *tournaments* to see the list.`;
  }

  if (tournament.registeredTeams >= tournament.maxTeams) {
    return `😔 ${tournament.name} is fully booked.\n\nType *tournaments* to see other options.`;
  }

  player.tempData = {
    ...player.tempData,
    tournamentStep: 'awaiting_team_name',
    selectedTournamentId: tournamentId,
  };
  savePlayer(player);

  return `⚽ *Registering for ${tournament.name}*\n\nWhat's your team name?`;
}

async function handleTournamentFlow(player: NonNullable<ReturnType<typeof getPlayer>>, body: string, step: string): Promise<string> {
  switch (step) {
    case 'awaiting_team_name': {
      const teamName = body.trim();
      if (!teamName || teamName.length < 2) {
        return `Please enter your team name.`;
      }
      player.tempData = {
        ...player.tempData,
        tournamentStep: 'awaiting_team_players',
        tournamentTeamName: teamName,
      };
      savePlayer(player);
      return `👥 Who's on your team? List up to 4 player names (comma-separated).\n\nExample: _Rahul, Priya, Arjun, Deepa_`;
    }

    case 'awaiting_team_players': {
      const playerNames = body.split(/[,\n]+/).map((n) => n.trim()).filter((n) => n.length > 0).slice(0, 4);

      if (playerNames.length === 0) {
        return `Please enter at least one player name.`;
      }

      const tournamentId = player.tempData?.selectedTournamentId as string;
      const teamName = player.tempData?.tournamentTeamName as string;
      const tournament = TOURNAMENTS.find((t) => t.id === tournamentId);

      if (!tournament) {
        const { tournamentStep: _ts, tournamentTeamName: _ttn, selectedTournamentId: _sti, ...rest } = player.tempData || {};
        void _ts; void _ttn; void _sti;
        player.tempData = rest;
        savePlayer(player);
        return `Something went wrong. Type *tournaments* to try again.`;
      }

      // Clear tournament flow
      const { tournamentStep: _ts, tournamentTeamName: _ttn, selectedTournamentId: _sti, ...rest } = player.tempData || {};
      void _ts; void _ttn; void _sti;
      player.tempData = rest;

      // Award tournament achievement
      if (!player.achievements.includes('tournament_reg')) {
        player.achievements.push('tournament_reg');
      }

      savePlayer(player);

      return `✅ *Team Registered!*

🏆 ${tournament.name}
👥 Team: *${teamName}*
Players: ${playerNames.join(', ')}
💰 Entry fee: ₹${tournament.entryFee}

See you on the court! 🎉`;
    }

    default: {
      const { tournamentStep: _ts, ...rest } = player.tempData || {};
      void _ts;
      player.tempData = rest;
      savePlayer(player);
      return handleTournaments(player.id, '');
    }
  }
}
