export type Category = "TODOS" | "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS";

export type GameColor = "cyan" | "magenta" | "yellow" | "green";

export interface Game {
  id: string;
  title: string;
  short: string;        // descripción corta para card
  long: string;         // descripción larga para detalle
  cat: Exclude<Category, "TODOS">;
  cover: string;        // clase CSS para background
  color: GameColor;
  best: number;         // mejor puntuación global
  plays: string;        // ej. "12.4K"
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  date: string;         // formato DD/MM/YYYY
}
