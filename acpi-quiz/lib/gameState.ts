// lib/gameState.ts

export type GameStatus =
  | "waiting"
  | "question"
  | "answer_reveal"
  | "leaderboard"
  | "finished";

export interface Player {
  name: string;
  score: number;
  streak: number;
  answers: (boolean | null)[]; // null = no respondió
  lastAnswerTime?: number;
}

export interface GameState {
  status: GameStatus;
  currentQuestion: number; // índice en QUESTIONS
  questionStartedAt: number; // timestamp ms
  players: Record<string, Player>; // key = playerName lowercase
  hostCode: string; // código para que el host autentique
  questionOrder: number[]; // índices mezclados de preguntas
  previousQuestions: number[]; // preguntas de la ronda anterior (para no repetir)
  timeMultiplier: number; // multiplicador de tiempo (1 = normal, 2 = doble, etc.)
  selectedQuiz: string; // ID del quiz seleccionado
  updatedAt: number;
}

export const DEFAULT_STATE: GameState = {
  status: "waiting",
  currentQuestion: 0,
  questionStartedAt: 0,
  players: {},
  hostCode: "acpi2026",
  questionOrder: [],
  previousQuestions: [],
  timeMultiplier: 2, // doble de tiempo por defecto
  selectedQuiz: "programacion", // quiz por defecto
  updatedAt: Date.now(),
};
