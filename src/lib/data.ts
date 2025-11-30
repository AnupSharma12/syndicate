export type Event = {
  id: string;
  game:
    | 'Valorant'
    | 'Free Fire'
    | 'Minecraft'
    | 'Pubg';
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
  youtubeProofUrl?: string; // Placeholder for file upload URL
};

export type User = {
  id: string;
  username: string;
  email: string;
  staff: boolean;
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
    id: '4',
    game: 'Valorant',
    name: 'Valorant Champions Tour: Stage 3',
    date: '2024-11-12T12:00:00.000Z',
    status: 'Closed',
    prize: 2500,
    fee: 0,
    description: "Valorant tournament"
  },
];

    