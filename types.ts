export interface Country {
  name: string;
  code: string; // ISO 3166-1 alpha-2
  fact: string;
}

export interface Question {
  correctAnswer: Country;
  options: string[];
  flagUrl: string;
}

export interface Player {
  id: number;
  name: string;
  score: number;
}

export type GameState = 'welcome' | 'party-setup' | 'playing' | 'turn-start' | 'results';
export type GameMode = 'classic' | 'timed' | 'party';

export interface AnswerRecord {
  question: Question;
  userAnswer: string | null; // null if timed out
  isCorrect: boolean;
}