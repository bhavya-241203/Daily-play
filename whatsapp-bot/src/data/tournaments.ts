export interface Tournament {
  id: string;
  name: string;
  sport: string;
  city: string;
  venue: string;
  date: string;
  entryFee: number;
  maxTeams: number;
  registeredTeams: number;
  format: string;
  prizePool: number;
}

export const TOURNAMENTS: Tournament[] = [
  {
    id: 't1',
    name: 'Koramangala Cup 2026',
    sport: 'cricket',
    city: 'Bangalore',
    venue: 'Koramangala Sports Arena',
    date: '2026-06-15',
    entryFee: 300,
    maxTeams: 16,
    registeredTeams: 8,
    format: 'knockout',
    prizePool: 5000,
  },
  {
    id: 't2',
    name: 'Indiranagar Badminton Open',
    sport: 'badminton',
    city: 'Bangalore',
    venue: 'Indiranagar Badminton Club',
    date: '2026-06-22',
    entryFee: 150,
    maxTeams: 12,
    registeredTeams: 5,
    format: 'round-robin',
    prizePool: 3000,
  },
  {
    id: 't3',
    name: 'Mumbai Pickleball Fest',
    sport: 'pickleball',
    city: 'Mumbai',
    venue: 'Andheri Sports Complex',
    date: '2026-07-05',
    entryFee: 200,
    maxTeams: 8,
    registeredTeams: 3,
    format: 'knockout',
    prizePool: 2500,
  },
  {
    id: 't4',
    name: 'Pune Football League',
    sport: 'football',
    city: 'Pune',
    venue: 'Kalyani Nagar Ground',
    date: '2026-07-20',
    entryFee: 500,
    maxTeams: 8,
    registeredTeams: 2,
    format: 'round-robin',
    prizePool: 8000,
  },
  {
    id: 't5',
    name: 'Hyderabad Smash Cup',
    sport: 'badminton',
    city: 'Hyderabad',
    venue: 'Hitech City Sports Zone',
    date: '2026-07-12',
    entryFee: 200,
    maxTeams: 16,
    registeredTeams: 6,
    format: 'knockout',
    prizePool: 4000,
  },
];
