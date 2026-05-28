import { getPlayer, readDB } from '../store/db';

interface CommunityMember {
  name: string;
  city: string;
  totalSessions: number;
  streak: number;
  level: number;
  title: string;
}

const COMMUNITY_MEMBERS: CommunityMember[] = [
  // Bangalore
  { name: 'Rahul K.', city: 'Bangalore', totalSessions: 47, streak: 12, level: 18, title: 'Club Player' },
  { name: 'Priya S.', city: 'Bangalore', totalSessions: 38, streak: 7, level: 15, title: 'Club Player' },
  { name: 'Arjun M.', city: 'Bangalore', totalSessions: 32, streak: 5, level: 12, title: 'Dedicated' },
  { name: 'Deepa N.', city: 'Bangalore', totalSessions: 28, streak: 4, level: 10, title: 'Dedicated' },
  { name: 'Kiran R.', city: 'Bangalore', totalSessions: 22, streak: 3, level: 8, title: 'Club Player' },
  { name: 'Sneha P.', city: 'Bangalore', totalSessions: 19, streak: 6, level: 7, title: 'Regular' },
  { name: 'Vikram B.', city: 'Bangalore', totalSessions: 15, streak: 2, level: 6, title: 'Regular' },
  { name: 'Ananya T.', city: 'Bangalore', totalSessions: 12, streak: 1, level: 5, title: 'Regular' },
  { name: 'Rohan G.', city: 'Bangalore', totalSessions: 8, streak: 0, level: 4, title: 'Newcomer' },
  { name: 'Meera L.', city: 'Bangalore', totalSessions: 5, streak: 0, level: 3, title: 'Newcomer' },
  // Mumbai
  { name: 'Aditya C.', city: 'Mumbai', totalSessions: 55, streak: 15, level: 22, title: 'Veteran' },
  { name: 'Riya D.', city: 'Mumbai', totalSessions: 41, streak: 9, level: 17, title: 'Enthusiast' },
  { name: 'Saurav N.', city: 'Mumbai', totalSessions: 33, streak: 6, level: 13, title: 'Dedicated' },
  { name: 'Pooja H.', city: 'Mumbai', totalSessions: 24, streak: 3, level: 9, title: 'Club Player' },
  { name: 'Nikhil S.', city: 'Mumbai', totalSessions: 18, streak: 4, level: 7, title: 'Regular' },
  // Pune
  { name: 'Gaurav M.', city: 'Pune', totalSessions: 39, streak: 8, level: 16, title: 'Club Player' },
  { name: 'Shreya K.', city: 'Pune', totalSessions: 27, streak: 5, level: 11, title: 'Dedicated' },
  { name: 'Amit P.', city: 'Pune', totalSessions: 20, streak: 3, level: 8, title: 'Club Player' },
  { name: 'Kavya R.', city: 'Pune', totalSessions: 14, streak: 2, level: 6, title: 'Regular' },
  { name: 'Rohit J.', city: 'Pune', totalSessions: 9, streak: 1, level: 4, title: 'Newcomer' },
  // Hyderabad
  { name: 'Sai V.', city: 'Hyderabad', totalSessions: 44, streak: 11, level: 19, title: 'Club Player' },
  { name: 'Lakshmi B.', city: 'Hyderabad', totalSessions: 31, streak: 6, level: 12, title: 'Dedicated' },
  { name: 'Prasad N.', city: 'Hyderabad', totalSessions: 23, streak: 4, level: 9, title: 'Club Player' },
  // Delhi
  { name: 'Mohit S.', city: 'Delhi', totalSessions: 51, streak: 14, level: 21, title: 'Veteran' },
  { name: 'Nisha G.', city: 'Delhi', totalSessions: 36, streak: 8, level: 14, title: 'Dedicated' },
  { name: 'Akash T.', city: 'Delhi', totalSessions: 25, streak: 5, level: 10, title: 'Dedicated' },
  // Chennai
  { name: 'Karthik R.', city: 'Chennai', totalSessions: 42, streak: 10, level: 17, title: 'Enthusiast' },
  { name: 'Divya M.', city: 'Chennai', totalSessions: 29, streak: 7, level: 12, title: 'Dedicated' },
  // Kolkata
  { name: 'Sourav D.', city: 'Kolkata', totalSessions: 48, streak: 13, level: 20, title: 'Veteran' },
  { name: 'Asha B.', city: 'Kolkata', totalSessions: 34, streak: 6, level: 14, title: 'Dedicated' },
];

const MEDALS = ['🥇', '🥈', '🥉'];

export async function handleLeaderboard(from: string): Promise<string> {
  const player = getPlayer(from);

  if (!player || player.registrationStep !== 'done') {
    return `Please register first! Type *register* to get started.`;
  }

  const city = player.city;

  // Merge community members with registered players from DB
  const db = readDB();
  const registeredInCity = db.players
    .filter((p) => p.city === city && p.registrationStep === 'done')
    .map((p) => ({
      name: p.name,
      city: p.city,
      totalSessions: p.totalSessions,
      streak: p.streak,
      level: p.level,
      title: p.title,
      isCurrentUser: p.id === from,
    }));

  // Combine and deduplicate by name
  const communityInCity = COMMUNITY_MEMBERS.filter((m) => m.city === city);
  const allPlayers: Array<{ name: string; totalSessions: number; streak: number; level: number; title: string; isCurrentUser?: boolean }> = [
    ...communityInCity,
    ...registeredInCity.filter((r) => !communityInCity.find((c) => c.name === r.name)),
  ];

  // Sort by totalSessions desc, then level desc
  allPlayers.sort((a, b) => b.totalSessions - a.totalSessions || b.level - a.level);

  const top10 = allPlayers.slice(0, 10);

  // Find current player's rank
  const playerRank = allPlayers.findIndex((p) => p.isCurrentUser) + 1;
  const playerEntry = allPlayers.find((p) => p.isCurrentUser);

  const lines: string[] = [`🏅 *Top Players in ${city}*\n`];

  top10.forEach((p, i) => {
    const medal = MEDALS[i] || `${i + 1}.`;
    const marker = p.isCurrentUser ? ' ← *You*' : '';
    lines.push(`${medal} ${p.name} — ${p.totalSessions} sessions · 🔥 ${p.streak} day streak${marker}`);
  });

  lines.push('');
  if (playerRank > 0 && playerEntry) {
    lines.push(`You're ranked #${playerRank} with ${player.totalSessions} sessions.`);
  } else {
    lines.push(`You haven't played any sessions yet.`);
  }
  lines.push(`Play more to climb the board! ⬆️`);

  return lines.join('\n');
}

export { COMMUNITY_MEMBERS };
