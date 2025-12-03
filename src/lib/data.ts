export type Event = {
  id: string;
  game:
    | 'Valorant'
    | 'Free Fire'
    | 'Minecraft'
    | 'Pubg';
  name: string;
  date: string; // Should be ISO string
  time: string;
  status: 'Open' | 'Closed' | 'Live' | 'Coming Soon';
  prize: number;
  fee: number;
  description: string;
  maxTeams: number;
  registeredTeams: number;
  gameMode?: string;
  map?: string;
  releaseDate?: string; // Optional ISO string for scheduled release
};

export type SquadMember = {
  name: string;
  gameId: string;
};

export type Registration = {
  id: string;
  userId: string;
  eventId: string;
  registrationDate: string; // ISO string
  teamName: string;
  teamLeaderFullName: string;
  teamLeaderGameId: string;
  teamLeaderEmail: string;
  whatsAppNumber: string;
  squadMembers: SquadMember[];
  teamLogoUrl: string; // Placeholder for file upload URL
  paymentProofUrl?: string; // Placeholder for file upload URL
  youtubeProofUrl?: string; // Placeholder for file upload URL
  isTeamCreated: boolean; // Flag to check if a team has been created from this app
};

export type User = {
  id: string;
  username: string;
  email: string;
  staff: boolean;
};

export type Team = {
    id: string;
    name: string;
    logoUrl: string;
    captainName: string;
    squadMembers: SquadMember[];
    wins: number;
    rank: 'Pro' | 'Elite' | 'Champion' | 'Unranked';
    tournamentsWon: string[]; // Array of event IDs
};


// This mock data is no longer used by the application but is kept for reference.
export const events: Event[] = [
  {
    id: '1',
    game: 'Valorant',
    name: 'Syndicate Showdown: Valorant Series',
    date: '2024-10-15T12:00:00.000Z',
    time: '6:00 PM IST',
    status: 'Open',
    prize: 5000,
    fee: 25,
    description: "Valorant tournament",
    maxTeams: 128,
    registeredTeams: 64,
  },
  {
    id: '4',
    game: 'Valorant',
    name: 'Valorant Champions Tour: Stage 3',
    date: '2024-11-12T12:00:00.000Z',
    time: '7:00 PM IST',
    status: 'Closed',
    prize: 2500,
    fee: 0,
    description: "Valorant tournament",
    maxTeams: 64,
    registeredTeams: 32,
  },
];
