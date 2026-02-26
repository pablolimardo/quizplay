// pages/api/host.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";
import { GameState, DEFAULT_STATE } from "../../lib/gameState";
import { QUESTIONS } from "../../lib/questions";

const KEY = "acpi_quiz_state";
const HOST_CODE = process.env.HOST_CODE ?? "acpi2026";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { action, code } = req.body;

  if (code !== HOST_CODE) {
    return res.status(401).json({ error: "Código incorrecto" });
  }

  const state: GameState = (await kv.get<GameState>(KEY)) ?? { ...DEFAULT_STATE };

  switch (action) {
    case "reset": {
      const fresh: GameState = {
        ...DEFAULT_STATE,
        hostCode: HOST_CODE,
        questionOrder: shuffle(QUESTIONS.map((_, i) => i)).slice(0, 10), // 10 preguntas mezcladas
        updatedAt: Date.now(),
      };
      await kv.set(KEY, fresh, { ex: 60 * 60 * 4 });
      return res.status(200).json(fresh);
    }

    case "start_question": {
      state.status = "question";
      state.questionStartedAt = Date.now();
      state.updatedAt = Date.now();
      await kv.set(KEY, state, { ex: 60 * 60 * 4 });
      return res.status(200).json(state);
    }

    case "reveal": {
      state.status = "answer_reveal";
      state.updatedAt = Date.now();
      await kv.set(KEY, state, { ex: 60 * 60 * 4 });
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
      await kv.set(KEY, state, { ex: 60 * 60 * 4 });
      return res.status(200).json(state);
    }

    case "show_leaderboard": {
      state.status = "leaderboard";
      state.updatedAt = Date.now();
      await kv.set(KEY, state, { ex: 60 * 60 * 4 });
      return res.status(200).json(state);
    }

    default:
      return res.status(400).json({ error: "Acción desconocida" });
  }
}
