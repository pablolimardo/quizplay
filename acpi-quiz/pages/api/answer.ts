// pages/api/answer.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { redis } from "../../lib/redis";
import { GameState, DEFAULT_STATE } from "../../lib/gameState";
import { getQuestionsFromDb } from "../../lib/quizzes/db";

const KEY = "acpi_quiz_state";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { playerName, answerIndex } = req.body as { playerName: string; answerIndex: number };

  const state: GameState = (await redis.get<GameState>(KEY)) ?? { ...DEFAULT_STATE };

  if (state.status !== "question") {
    return res.status(400).json({ error: "No hay pregunta activa" });
  }

  const key = playerName.toLowerCase();
  const player = state.players[key];
  if (!player) {
    return res.status(404).json({ error: "Jugador no encontrado" });
  }

  const questions = await getQuestionsFromDb(state.selectedQuiz || "programacion");
  const qIdx = state.questionOrder[state.currentQuestion];
  const question = questions[qIdx];

  // Verificar si ya respondió esta pregunta
  if (player.answers.length > state.currentQuestion) {
    return res.status(400).json({ error: "Ya respondiste esta pregunta" });
  }

  // Mapear el índice de la respuesta shuffled al índice original
  const optionShuffle = state.optionShuffles?.[state.currentQuestion];
  // Si hay shuffle, answerIndex es la posición en la vista mezclada → mapear al original
  // Si no hay shuffle (backward compat), usar directamente
  const originalAnswerIndex = optionShuffle ? optionShuffle[answerIndex] : answerIndex;
  const isCorrect = originalAnswerIndex === question.correct;

  // Encontrar la posición de la respuesta correcta en la vista mezclada (para mostrar al alumno)
  const shuffledCorrectIndex = optionShuffle
    ? optionShuffle.indexOf(question.correct)
    : question.correct;

  const elapsed = Date.now() - state.questionStartedAt;
  const multiplier = state.timeMultiplier ?? 2;
  const timeLimit = question.timeLimit * multiplier * 1000;

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

  await redis.set(KEY, JSON.stringify(state), { ex: 60 * 60 * 4 });

  return res.status(200).json({
    correct: isCorrect,
    points,
    correctAnswer: shuffledCorrectIndex, // posición correcta en la vista mezclada
    explanation: question.explanation,
    streak: player.streak,
  });
}
