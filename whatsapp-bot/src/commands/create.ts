import { DBPlayer, getPlayer, savePlayer } from '../store/db';
import { DBSession, saveSession } from '../store/db';
import { generateSessionId } from '../store/sessions';
import { sportEmoji, sportFromInput, skillLevelFromInput, friendlyDate, friendlyTime } from '../utils/formatter';
import { parseDateTime } from '../utils/parser';

const SPORT_LIST = `What sport?
1. 🏏 Cricket
2. 🏸 Badminton
3. 🥒 Pickleball
4. ⚽ Football
5. 💪 Gym
6. 🎮 PS5`;

const SKILL_LIST = `🎯 Skill level?
1. Beginner
2. Intermediate
3. Advanced
4. Open to all`;

export async function handleCreate(from: string, body: string): Promise<string> {
  const player = getPlayer(from);

  if (!player || player.registrationStep !== 'done') {
    return `Please register first! Type *register* to get started.`;
  }

  const createStep = player.tempData?.createStep as string | undefined;

  if (!createStep) {
    // Step 1: Ask for sport
    player.tempData = { ...player.tempData, createStep: 'awaiting_sport' };
    savePlayer(player);
    return `🏆 *Let's create a session!*\n\n${SPORT_LIST}`;
  }

  return handleCreateStep(player, body, createStep);
}

async function handleCreateStep(player: DBPlayer, body: string, step: string): Promise<string> {
  switch (step) {
    case 'awaiting_sport': {
      const sport = sportFromInput(body);
      if (!sport) {
        return `Please pick a sport:\n\n${SPORT_LIST}`;
      }
      player.tempData = { ...player.tempData, createStep: 'awaiting_datetime', createSport: sport };
      savePlayer(player);
      return `📅 When? (e.g. *tomorrow 7am*, *sunday 6pm*, *june 3 8am*)`;
    }

    case 'awaiting_datetime': {
      const parsed = parseDateTime(body);
      if (!parsed) {
        return `I couldn't parse that date/time 🤔\n\nTry something like: *tomorrow 7am*, *sunday 6pm*, or *june 15 8am*`;
      }
      player.tempData = {
        ...player.tempData,
        createStep: 'awaiting_venue',
        createDate: parsed.date,
        createTime: parsed.time,
      };
      savePlayer(player);
      return `📍 Where? (venue name or address)`;
    }

    case 'awaiting_venue': {
      const venue = body.trim();
      if (!venue || venue.length < 2) {
        return `Please enter a venue name or address.`;
      }
      player.tempData = { ...player.tempData, createStep: 'awaiting_max_players', createVenue: venue };
      savePlayer(player);
      return `👥 Max players? (e.g. *6*, *8*, or *open* for no limit)`;
    }

    case 'awaiting_max_players': {
      const input = body.trim().toLowerCase();
      let maxPlayers = 10;
      if (input === 'open' || input === 'no limit' || input === 'unlimited') {
        maxPlayers = 99;
      } else {
        const num = parseInt(input, 10);
        if (isNaN(num) || num < 2 || num > 100) {
          return `Please enter a number between 2 and 100, or *open* for no limit.`;
        }
        maxPlayers = num;
      }
      player.tempData = { ...player.tempData, createStep: 'awaiting_skill', createMaxPlayers: maxPlayers };
      savePlayer(player);
      return SKILL_LIST;
    }

    case 'awaiting_skill': {
      const skill = skillLevelFromInput(body);
      if (!skill) {
        return `Please pick a skill level:\n\n${SKILL_LIST}`;
      }

      // Create the session
      const sport = player.tempData?.createSport as string;
      const date = player.tempData?.createDate as string;
      const time = player.tempData?.createTime as string;
      const venue = player.tempData?.createVenue as string;
      const maxPlayers = player.tempData?.createMaxPlayers as number;

      const sessionId = generateSessionId();
      const title = `${sport.charAt(0).toUpperCase() + sport.slice(1)} session with ${player.name}`;
      const emoji = sportEmoji(sport);

      const session: DBSession = {
        id: sessionId,
        sport,
        title,
        date,
        time,
        venue,
        city: player.city,
        maxPlayers,
        currentPlayers: [player.name],
        hostId: player.id,
        hostName: player.name,
        skillLevel: skill,
        notes: '',
        status: 'open',
        checkedIn: [],
      };

      saveSession(session);

      // Clear create flow from tempData
      const { createStep, createSport, createDate, createTime, createVenue, createMaxPlayers, ...rest } = player.tempData || {};
      void createStep; void createSport; void createDate; void createTime; void createVenue; void createMaxPlayers;
      player.tempData = rest;
      savePlayer(player);

      const dateStr = friendlyDate(date);
      const timeStr = friendlyTime(time);

      return `✅ *Session Created!*

${emoji} *${title}*
📅 ${dateStr} at ${timeStr}
📍 ${venue}, ${player.city}
👥 1/${maxPlayers === 99 ? '∞' : maxPlayers} players · ${skill}

Share this with your friends:
"Join my ${sport} session on Daily Play! Reply *join* to the bot."

Your session ID: *#${sessionId}*`;
    }

    default:
      // Reset create flow
      player.tempData = { ...player.tempData, createStep: 'awaiting_sport' };
      savePlayer(player);
      return `🏆 *Let's create a session!*\n\n${SPORT_LIST}`;
  }
}
