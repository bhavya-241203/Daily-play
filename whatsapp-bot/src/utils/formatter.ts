// Formatter utilities for WhatsApp messages

export function sportEmoji(sport: string): string {
  const map: Record<string, string> = {
    cricket: '🏏',
    badminton: '🏸',
    pickleball: '🥒',
    football: '⚽',
    gym: '💪',
    ps5: '🎮',
    tennis: '🎾',
    basketball: '🏀',
    volleyball: '🏐',
    default: '🏅',
  };
  return map[sport.toLowerCase()] || map['default'];
}

export function avatarEmoji(level: number): string {
  if (level >= 43) return '👑';
  if (level >= 35) return '🏆';
  if (level >= 28) return '⭐';
  if (level >= 17) return '🔥';
  if (level >= 8) return '💪';
  return '🌱';
}

export function friendlyDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.getTime() === today.getTime()) return 'Today';
  if (date.getTime() === tomorrow.getTime()) return 'Tomorrow';

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dayDiff = Math.round((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (dayDiff > 0 && dayDiff <= 6) {
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  }

  return `${months[date.getMonth()]} ${date.getDate()}`;
}

export function friendlyTime(timeStr: string): string {
  const [hourStr, minStr] = timeStr.split(':');
  const hour = parseInt(hourStr, 10);
  const min = parseInt(minStr || '0', 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  const displayMin = min === 0 ? '' : `:${String(min).padStart(2, '0')}`;
  return `${displayHour}${displayMin} ${ampm}`;
}

export function progressBar(current: number, max: number, length = 10): string {
  const filled = Math.round((current / max) * length);
  const empty = length - filled;
  return '█'.repeat(Math.max(0, filled)) + '░'.repeat(Math.max(0, empty));
}

export function truncate(str: string, len: number): string {
  if (str.length <= len) return str;
  return str.substring(0, len - 3) + '...';
}

export function cityFromList(input: string): string | null {
  const cities: Record<string, string> = {
    '1': 'Bangalore',
    '2': 'Mumbai',
    '3': 'Pune',
    '4': 'Hyderabad',
    '5': 'Delhi',
    '6': 'Chennai',
    '7': 'Kolkata',
    bangalore: 'Bangalore',
    mumbai: 'Mumbai',
    pune: 'Pune',
    hyderabad: 'Hyderabad',
    delhi: 'Delhi',
    chennai: 'Chennai',
    kolkata: 'Kolkata',
    bengaluru: 'Bangalore',
    bombay: 'Mumbai',
    blr: 'Bangalore',
    bom: 'Mumbai',
  };
  return cities[input.trim().toLowerCase()] || null;
}

export function sportsFromInput(input: string): string[] {
  const sportsMap: Record<string, string> = {
    '1': 'cricket',
    '2': 'badminton',
    '3': 'pickleball',
    '4': 'football',
    '5': 'gym',
    '6': 'ps5',
    cricket: 'cricket',
    badminton: 'badminton',
    pickleball: 'pickleball',
    football: 'football',
    gym: 'gym',
    ps5: 'ps5',
    soccer: 'football',
  };
  const tokens = input.trim().toLowerCase().split(/[\s,]+/);
  const sports: string[] = [];
  for (const token of tokens) {
    const mapped = sportsMap[token];
    if (mapped && !sports.includes(mapped)) sports.push(mapped);
  }
  return sports;
}

export function sportFromInput(input: string): string | null {
  const trimmed = input.trim().toLowerCase();
  const sportsMap: Record<string, string> = {
    '1': 'cricket',
    '2': 'badminton',
    '3': 'pickleball',
    '4': 'football',
    '5': 'gym',
    '6': 'ps5',
    cricket: 'cricket',
    badminton: 'badminton',
    pickleball: 'pickleball',
    football: 'football',
    gym: 'gym',
    ps5: 'ps5',
    soccer: 'football',
  };
  return sportsMap[trimmed] || null;
}

export function skillLevelFromInput(input: string): string | null {
  const trimmed = input.trim().toLowerCase();
  const map: Record<string, string> = {
    '1': 'Beginner',
    '2': 'Intermediate',
    '3': 'Advanced',
    '4': 'Open to all',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    open: 'Open to all',
    'open to all': 'Open to all',
    all: 'Open to all',
  };
  return map[trimmed] || null;
}
