export interface Game {
  division: string;

  date: string;
  time: string;
  location: string;

  gameId: string;

  white: string;
  dark: string;

  whiteScore: any;
  darkScore: any;

  comments?: string;
}
