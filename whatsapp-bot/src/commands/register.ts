import { DBPlayer, getPlayer, savePlayer } from '../store/db';
import { createNewPlayer } from '../store/players';
import { cityFromList, sportsFromInput } from '../utils/formatter';

const CITY_LIST = `Which city are you in?
1. Bangalore
2. Mumbai
3. Pune
4. Hyderabad
5. Delhi
6. Chennai
7. Kolkata

(Reply with the number or city name)`;

const SPORTS_LIST = `Which sports do you play? (Reply with numbers, e.g. *1 3* for multiple)
1. 🏏 Cricket
2. 🏸 Badminton
3. 🥒 Pickleball
4. ⚽ Football
5. 💪 Gym
6. 🎮 PS5`;

function formatSportsList(sports: string[]): string {
  const emojiMap: Record<string, string> = {
    cricket: '🏏 Cricket',
    badminton: '🏸 Badminton',
    pickleball: '🥒 Pickleball',
    football: '⚽ Football',
    gym: '💪 Gym',
    ps5: '🎮 PS5',
  };
  return sports.map((s) => emojiMap[s] || s).join(', ');
}

function avatarForLevel(level: number): string {
  if (level >= 43) return '👑';
  if (level >= 28) return '🏆';
  if (level >= 8) return '💪';
  return '🌱';
}

export async function handleRegister(from: string, body: string): Promise<string> {
  const existingPlayer = getPlayer(from);

  // Player exists and is fully registered
  if (existingPlayer && existingPlayer.registrationStep === 'done') {
    return `Welcome back ${existingPlayer.name}! 👋 Type *help* to see what you can do.`;
  }

  // New player — start registration
  if (!existingPlayer) {
    const newPlayer = createNewPlayer(from);
    savePlayer(newPlayer);
    return `👋 Welcome to Daily Play! I'm your sports bot.\n\nFirst, what's your name?`;
  }

  // Player in middle of registration — handle their input
  return handleRegistrationStep(existingPlayer, body);
}

export async function handleRegistrationStep(player: DBPlayer, body: string): Promise<string> {
  switch (player.registrationStep) {
    case 'awaiting_name': {
      const name = body.trim();
      if (!name || name.length < 2) {
        return "Please enter your name (at least 2 characters).";
      }
      player.name = name;
      player.registrationStep = 'awaiting_city';
      savePlayer(player);
      return `Nice to meet you, ${name}! 🎉\n\n${CITY_LIST}`;
    }

    case 'awaiting_city': {
      const city = cityFromList(body);
      if (!city) {
        return `I didn't recognise that city 🤔\n\n${CITY_LIST}`;
      }
      player.city = city;
      player.registrationStep = 'awaiting_sports';
      savePlayer(player);
      return `Great! 🙌\n\n${SPORTS_LIST}`;
    }

    case 'awaiting_sports': {
      const sports = sportsFromInput(body);
      if (sports.length === 0) {
        return `Please pick at least one sport!\n\n${SPORTS_LIST}`;
      }
      player.sports = sports;
      player.registrationStep = 'done';
      const avatar = avatarForLevel(player.level);
      savePlayer(player);

      return `✅ *Profile Created!*

${avatar} *${player.name}*
📍 ${player.city}
🎮 ${formatSportsList(sports)}

🏆 Level 1 · Rookie
⚡ 0 XP · 0 streak

You're all set! Your career starts now.
Type *play* to find a game near you. 🚀`;
    }

    default:
      return `👋 Welcome to Daily Play! I'm your sports bot.\n\nFirst, what's your name?`;
  }
}
