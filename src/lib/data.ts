export type Event = {
  id: string;
  game:
    | 'Valorant'
    | 'Apex Legends'
    | 'League of Legends'
    | 'Free Fire'
    | 'Minecraft'
    | 'Pubg'
    | 'Call of Duty';
  name: string;
  date: string; // Should be ISO string
  status: 'Open' | 'Closed' | 'Live';
  prize: number;
  fee: number;
  description: string;
};

export type Registration = {
  id: string;
  userId: string;
  eventId: string;
  registrationDate: string; // ISO string
  teamName: string;
  whatsAppNumber: string;
  teamLogoUrl: string; // Placeholder for file upload URL
  paymentProofUrl: string; // Placeholder for file upload URL
  youtubeProofUrls: string[]; // Placeholder for file upload URLs
};


// This mock data is no longer used by the application but is kept for reference.
export const events: Event[] = [
  {
    id: '1',
    game: 'Valorant',
    name: 'Syndicate Showdown: Valorant Series',
    date: '2024-10-15T12:00:00.000Z',
    status: 'Open',
    prize: 5000,
    fee: 25,
    description: "Valorant tournament"
  },
  {
    id: '2',
    game: 'Apex Legends',
    name: 'Apex Arena: Season 3',
    date: '2024-10-22T12:00:00.000Z',
    status: 'Open',
    prize: 10000,
    fee: 25,
    description: "Apex legends tournament"
  },
  {
    id: '3',
    game: 'League of Legends',
    name: 'Rift Rivals: NA vs EU',
    date: '2024-11-05T12:00:00.000Z',
    status: 'Open',
    prize: 20000,
    fee: 50,
    description: "League of legends tournament"
  },
  {
    id: '4',
    game: 'Valorant',
    name: 'Valorant Champions Tour: Stage 3',
    date: '2024-11-12T12:00:00.000Z',
    status: 'Closed',
    prize: 2500,
    fee: 0,
    description: "Valorant tournament"
  },
  {
    id: '5',
    game: 'Apex Legends',
    name: "Legend's Gauntlet",
    date: '2024-12-01T12:00:00.000Z',
    status: 'Open',
    prize: 7500,
    fee: 25,
    description: "Apex legends tournament"
  },
  {
    id: '6',
    game: 'League of Legends',
    name: "Summoner's Spectacle",
    date: '2024-12-10T12:00:00.000Z',
    status: 'Live',
    prize: 15000,
    fee: 0,
    description: "League of legends tournament"
  },
];
