// pages/api/host.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { redis } from "../../lib/redis";
import { GameState, DEFAULT_STATE } from "../../lib/gameState";
import { QUESTIONS } from "../../lib/questions";

const KEY = "acpi_quiz_state";
const HOST_CODE = process.env.HOST_CODE ?? "acpi2026";
const QUESTIONS_PER_ROUND = 10;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Selecciona preguntas evitando las de la ronda anterior */
function pickQuestions(previous: number[], count: number): number[] {
  const allIndices = QUESTIONS.map((_, i) => i);
  // Filtrar las de la ronda anterior
  const available = allIndices.filter(i => !previous.includes(i));
  // Si no hay suficientes disponibles (pocas preguntas), usar todas
  const pool = available.length >= count ? available : allIndices;
  return shuffle(pool).slice(0, count);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { action, code } = req.body;

  if (code !== HOST_CODE) {
    return res.status(401).json({ error: "Código incorrecto" });
  }

  const state: GameState = (await redis.get<GameState>(KEY)) ?? { ...DEFAULT_STATE };

  // Asegurar compatibilidad con estados viejos que no tienen los campos nuevos
  if (state.timeMultiplier === undefined) state.timeMultiplier = 2;
  if (state.previousQuestions === undefined) state.previousQuestions = [];

  switch (action) {
    case "set_time": {
      const { multiplier } = req.body;
      if (typeof multiplier === "number" && multiplier >= 0.5 && multiplier <= 5) {
        state.timeMultiplier = multiplier;
        state.updatedAt = Date.now();
        await redis.set(KEY, JSON.stringify(state), { ex: 60 * 60 * 4 });
      }
      return res.status(200).json(state);
    }

    case "reset": {
      // Guardar las preguntas actuales como "anteriores" para no repetir
      const prevQuestions = state.questionOrder.length > 0 ? [...state.questionOrder] : state.previousQuestions;
      const fresh: GameState = {
        ...DEFAULT_STATE,
        hostCode: HOST_CODE,
        timeMultiplier: state.timeMultiplier, // Mantener el multiplicador de tiempo
        previousQuestions: prevQuestions,
        questionOrder: pickQuestions(prevQuestions, QUESTIONS_PER_ROUND),
        updatedAt: Date.now(),
      };
      await redis.set(KEY, JSON.stringify(fresh), { ex: 60 * 60 * 4 });
      return res.status(200).json(fresh);
    }

    case "start_question": {
      // Si no hay preguntas mezcladas, inicializarlas (primera vez)
      if (state.questionOrder.length === 0) {
        state.questionOrder = pickQuestions(state.previousQuestions, QUESTIONS_PER_ROUND);
        state.currentQuestion = 0;
        // Limpiar respuestas previas de los jugadores (por si hubo una ronda anterior)
        for (const key of Object.keys(state.players)) {
          state.players[key].score = 0;
          state.players[key].streak = 0;
          state.players[key].answers = [];
        }
      }
      state.status = "question";
      state.questionStartedAt = Date.now();
      state.updatedAt = Date.now();
      await redis.set(KEY, JSON.stringify(state), { ex: 60 * 60 * 4 });
      return res.status(200).json(state);
    }

    case "reveal": {
      state.status = "answer_reveal";
      state.updatedAt = Date.now();
      await redis.set(KEY, JSON.stringify(state), { ex: 60 * 60 * 4 });
      return res.status(200).json(state);
    }

    case "next_question": {
      const nextIdx = state.currentQuestion + 1;
      if (nextIdx >= state.questionOrder.length) {
        state.status = "finished";
      } else {
        state.currentQuestion = nextIdx;
        state.status = "question";
        state.questionStartedAt = Date.now();
      }
      state.updatedAt = Date.now();
      await redis.set(KEY, JSON.stringify(state), { ex: 60 * 60 * 4 });
      return res.status(200).json(state);
    }

    case "show_leaderboard": {
      state.status = "leaderboard";
      state.updatedAt = Date.now();
      await redis.set(KEY, JSON.stringify(state), { ex: 60 * 60 * 4 });
      return res.status(200).json(state);
    }

    default:
      return res.status(400).json({ error: "Acción desconocida" });
  }
}

