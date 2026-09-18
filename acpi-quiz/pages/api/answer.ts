// pages/api/answer.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { redis } from "../../lib/redis";
import { GameState, DEFAULT_STATE } from "../../lib/gameState";
import { getQuestionsFromDb } from "../../lib/quizzes/db";

const KEY = "acpi_quiz_state";
const LOCK_KEY = "lock:acpi_quiz_state";

async function acquireLock(maxWaitMs: number = 3000): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    const res = await redis.set(LOCK_KEY, "1", { nx: true, px: 2500 });
    if (res === "OK") return true;
    await new Promise((resolve) => setTimeout(resolve, 35 + Math.floor(Math.random() * 35)));
  }
  return false;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { playerName, answerIndex } = req.body as { playerName: string; answerIndex: number };

  if (!playerName || typeof answerIndex !== "number") {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  // Adquirir lock distribuido para evitar que peticiones concurrentes se pisen
  const locked = await acquireLock(3500);
  if (!locked) {
    console.warn("Could not acquire lock for answer, proceeding anyway");
  }

  try {
    const state: GameState = (await redis.get<GameState>(KEY)) ?? { ...DEFAULT_STATE };

    if (state.status !== "question") {
      return res.status(400).json({ error: "No hay pregunta activa" });
    }

    const key = playerName.toLowerCase().trim();
    const player = state.players[key];
    if (!player) {
      return res.status(404).json({ error: "Jugador no encontrado" });
    }

    const questions = await getQuestionsFromDb(state.selectedQuiz || "programacion");
    const qIdx = state.questionOrder[state.currentQuestion];
    const question = questions[qIdx];

    if (!question) {
      return res.status(400).json({ error: "Pregunta no encontrada" });
    }

    // Verificar si ya respondió esta pregunta
    if (player.answers.length > state.currentQuestion) {
      return res.status(400).json({ error: "Ya respondiste esta pregunta" });
    }

    // Mapear el índice de la respuesta shuffled al índice original
    const optionShuffle = state.optionShuffles?.[state.currentQuestion];
    const originalAnswerIndex = optionShuffle ? optionShuffle[answerIndex] : answerIndex;
    const isCorrect = originalAnswerIndex === question.correct;

    // Encontrar la posición de la respuesta correcta en la vista mezclada
    const shuffledCorrectIndex = optionShuffle
      ? optionShuffle.indexOf(question.correct)
      : question.correct;

    const elapsed = Date.now() - state.questionStartedAt;
    const multiplier = state.timeMultiplier ?? 2;
    const timeLimit = question.timeLimit * multiplier * 1000;

    let points = 0;
    if (isCorrect) {
      const speedBonus = Math.round(question.points * Math.max(0, (timeLimit - elapsed) / timeLimit));
      points = question.points + speedBonus;
      player.streak = (player.streak || 0) + 1;
      if (player.streak >= 3) points = Math.round(points * 1.5);
    } else {
      player.streak = 0;
    }

    player.score = (player.score || 0) + points;
    player.answers.push(isCorrect);
    player.lastAnswerTime = elapsed;
    state.players[key] = player;
    state.updatedAt = Date.now();

    await redis.set(KEY, JSON.stringify(state), { ex: 60 * 60 * 4 });

    return res.status(200).json({
      correct: isCorrect,
      points,
      totalScore: player.score,
      correctAnswer: shuffledCorrectIndex,
      explanation: question.explanation,
      streak: player.streak,
    });
  } catch (error: any) {
    console.error("Error in /api/answer:", error);
    return res.status(500).json({ error: error.message || "Error al procesar respuesta" });
  } finally {
    if (locked) {
      await redis.del(LOCK_KEY).catch(() => {});
    }
  }
}
