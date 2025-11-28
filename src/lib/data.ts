export type Event = {
  id: string;
  game: 'Valorant' | 'Apex Legends' | 'League of Legends';
  name: string;
  date: string;
  status: 'Open' | 'Closed' | 'Live';
  prize: string;
  free: boolean;
  fee: number;
};

export const events: Event[] = [
  {
    id: '1',
    game: 'Valorant',
    name: 'Syndicate Showdown: Valorant Series',
    date: 'October 15, 2024',
    status: 'Open',
    prize: '$5,000',
    free: false,
    fee: 25,
  },
  {
    id: '2',
    game: 'Apex Legends',
    name: 'Apex Arena: Season 3',
    date: 'October 22, 2024',
    status: 'Open',
    prize: '$10,000',
    free: false,
    fee: 25,
  },
  {
    id: '3',
    game: 'League of Legends',
    name: 'Rift Rivals: NA vs EU',
    date: 'November 5, 2024',
    status: 'Open',
    prize: '$20,000',
    free: false,
    fee: 50,
  },
  {
    id: '4',
    game: 'Valorant',
    name: 'Valorant Champions Tour: Stage 3',
    date: 'November 12, 2024',
    status: 'Closed',
    prize: '$2,500',
    free: true,
    fee: 0,
  },
  {
    id: '5',
    game: 'Apex Legends',
    name: "Legend's Gauntlet",
    date: 'December 1, 2024',
    status: 'Open',
    prize: '$7,500',
    free: false,
    fee: 25,
  },
  {
    id: '6',
    game: 'League of Legends',
    name: "Summoner's Spectacle",
    date: 'December 10, 2024',
    status: 'Live',
    prize: '$15,000',
    free: true,
    fee: 0,
  },
];
