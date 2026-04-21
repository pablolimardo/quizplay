// pages/api/state.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { redis } from "../../lib/redis";
import { GameState, DEFAULT_STATE } from "../../lib/gameState";
import { enhanceStateWithQuestion } from "../../lib/quizzes/db";

const KEY = "acpi_quiz_state";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const rawState = (await redis.get<GameState>(KEY)) ?? DEFAULT_STATE;
      const state = await enhanceStateWithQuestion(rawState as GameState);
      return res.status(200).json(state);
    }

    if (req.method === "POST") {
      const state: GameState = req.body;
      state.updatedAt = Date.now();
      await redis.set(KEY, JSON.stringify(state), { ex: 60 * 60 * 4 });
      return res.status(200).json({ ok: true });
    }

    res.status(405).end();
  } catch (error: any) {
    console.error("API State Error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
