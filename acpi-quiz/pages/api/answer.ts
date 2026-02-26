// pages/api/answer.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";
import { GameState, DEFAULT_STATE } from "../../lib/gameState";
import { QUESTIONS } from "../../lib/questions";

const KEY = "acpi_quiz_state";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { playerName, answerIndex } = req.body as { playerName: string; answerIndex: number };

  const state: GameState = (await kv.get<GameState>(KEY)) ?? { ...DEFAULT_STATE };

  if (state.status !== "question") {
    return res.status(400).json({ error: "No hay pregunta activa" });
  }

  const key = playerName.toLowerCase();
  const player = state.players[key];
  if (!player) {
    return res.status(404).json({ error: "Jugador no encontrado" });
  }

  const qIdx = state.questionOrder[state.currentQuestion];
  const question = QUESTIONS[qIdx];

  // Verificar si ya respondió esta pregunta
  if (player.answers.length > state.currentQuestion) {
    return res.status(400).json({ error: "Ya respondiste esta pregunta" });
  }

  const isCorrect = answerIndex === question.correct;
  const elapsed = Date.now() - state.questionStartedAt;
  const timeLimit = question.timeLimit * 1000;

  let points = 0;
  if (isCorrect) {
    // Más puntos si respondés más rápido (máximo bonus = puntos base)
    const speedBonus = Math.round(question.points * Math.max(0, (timeLimit - elapsed) / timeLimit));
    points = question.points + speedBonus;
    player.streak += 1;
    if (player.streak >= 3) points = Math.round(points * 1.5); // bonus racha
  } else {
    player.streak = 0;
  }

  player.score += points;
  player.answers.push(isCorrect);
  player.lastAnswerTime = elapsed;
  state.players[key] = player;
  state.updatedAt = Date.now();

  await kv.set(KEY, state, { ex: 60 * 60 * 4 });

  return res.status(200).json({
    correct: isCorrect,
    points,
    correctAnswer: question.correct,
    explanation: question.explanation,
    streak: player.streak,
  });
}
