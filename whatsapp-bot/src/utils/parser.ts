// Natural language command parser

export interface ParsedCommand {
  command: string;
  args: string[];
  raw: string;
}

export function parseCommand(text: string): ParsedCommand {
  const raw = text;
  const normalized = text.toLowerCase().trim();

  // Greeting / start
  if (/^(hi|hello|hey|start|hii|helo|hai)/.test(normalized)) {
    return { command: 'start', args: [], raw };
  }

  // Register
  if (/\b(register|sign up|signup|join daily play|join dailyplay)\b/.test(normalized)) {
    return { command: 'register', args: [], raw };
  }

  // Leaderboard
  if (/\b(leaderboard|rankings|top players|ranking)\b/.test(normalized)) {
    return { command: 'leaderboard', args: [], raw };
  }

  // Checkin — before sessions/play to avoid "i'm here for sessions" confusion
  if (/\b(checkin|check in|checked in|i'm here|im here|i am here|arrived|i've arrived)\b/.test(normalized)) {
    return { command: 'checkin', args: [], raw };
  }

  // Create session
  if (/\b(create|host|organis[e|z]e|start a game|start a session|create session|host a game|host game)\b/.test(normalized)) {
    return { command: 'create', args: [], raw };
  }

  // Join [number or title]
  const joinMatch = normalized.match(/^join\s+(.*)/);
  if (joinMatch) {
    // Could be "join 2" or "register tournament 1"
    if (!normalized.includes('tournament')) {
      return { command: 'join', args: joinMatch[1].trim().split(/\s+/), raw };
    }
  }

  // Tournament register: "register tournament 1"
  if (/\b(register tournament|join tournament)\b/.test(normalized)) {
    const m = normalized.match(/\b(?:register|join)\s+tournament\s+(\d+)/);
    return { command: 'tournament_register', args: m ? [m[1]] : [], raw };
  }

  // Sessions / play / find game
  if (/\b(play|sessions|find game|find sessions|what('|')s on|whats on|games|find a game|open sessions)\b/.test(normalized)) {
    return { command: 'sessions', args: [], raw };
  }

  // Stats / profile
  if (/\b(my stats|stats|career|profile|my profile|my career)\b/.test(normalized)) {
    return { command: 'stats', args: [], raw };
  }

  // Venues
  if (/\b(venues|turfs|courts|find turf|turf|court|ground|arena)\b/.test(normalized)) {
    return { command: 'venues', args: [], raw };
  }

  // Tournaments (list)
  if (/\b(tournaments?|compete|competition|cup)\b/.test(normalized)) {
    return { command: 'tournaments', args: [], raw };
  }

  // Help
  if (/\b(help|commands|what can you do|menu|options)\b/.test(normalized)) {
    return { command: 'help', args: [], raw };
  }

  // Pure number — could be answering a list
  if (/^\d+$/.test(normalized)) {
    return { command: 'number', args: [normalized], raw };
  }

  return { command: 'unknown', args: [], raw };
}

export function parseDateTime(input: string): { date: string; time: string } | null {
  const normalized = input.toLowerCase().trim();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let targetDate: Date | null = null;
  let targetTime = '18:00'; // default 6pm

  // Extract time first
  const timeMatch = normalized.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (timeMatch) {
    let hour = parseInt(timeMatch[1], 10);
    const min = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
    const meridiem = timeMatch[3]?.toLowerCase();

    if (meridiem === 'pm' && hour < 12) hour += 12;
    if (meridiem === 'am' && hour === 12) hour = 0;
    if (!meridiem && hour < 6) hour += 12; // assume PM for ambiguous small hours

    targetTime = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
  }

  // Date parsing
  if (/tomorrow/.test(normalized)) {
    targetDate = new Date(today);
    targetDate.setDate(today.getDate() + 1);
  } else if (/today/.test(normalized)) {
    targetDate = new Date(today);
  } else if (/next week/.test(normalized)) {
    targetDate = new Date(today);
    targetDate.setDate(today.getDate() + 7);
  } else {
    // Day of week
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    for (let i = 0; i < days.length; i++) {
      if (normalized.includes(days[i])) {
        const currentDay = today.getDay();
        let diff = i - currentDay;
        if (diff <= 0) diff += 7;
        targetDate = new Date(today);
        targetDate.setDate(today.getDate() + diff);
        break;
      }
    }

    if (!targetDate) {
      // Try "june 15", "15/6", "15-6", "15 june" etc.
      const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

      let foundMonth = -1;
      let foundDay = -1;

      for (let i = 0; i < months.length; i++) {
        if (normalized.includes(months[i]) || normalized.includes(monthNames[i])) {
          foundMonth = i;
          const dayMatch = normalized.match(/\b(\d{1,2})\b/);
          if (dayMatch) foundDay = parseInt(dayMatch[1], 10);
          break;
        }
      }

      if (foundMonth !== -1 && foundDay !== -1) {
        targetDate = new Date(today.getFullYear(), foundMonth, foundDay);
        if (targetDate < today) targetDate.setFullYear(today.getFullYear() + 1);
      } else {
        // Try DD/MM or DD-MM
        const slashMatch = normalized.match(/(\d{1,2})[\/\-](\d{1,2})/);
        if (slashMatch) {
          const day = parseInt(slashMatch[1], 10);
          const month = parseInt(slashMatch[2], 10) - 1;
          targetDate = new Date(today.getFullYear(), month, day);
          if (targetDate < today) targetDate.setFullYear(today.getFullYear() + 1);
        }
      }
    }
  }

  if (!targetDate) return null;

  const dateStr = targetDate.toISOString().split('T')[0];
  return { date: dateStr, time: targetTime };
}
