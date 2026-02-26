// pages/api/state.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";
import { GameState, DEFAULT_STATE } from "../../lib/gameState";

const KEY = "acpi_quiz_state";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const state = (await kv.get<GameState>(KEY)) ?? DEFAULT_STATE;
    return res.status(200).json(state);
  }

  if (req.method === "POST") {
    const state: GameState = req.body;
    state.updatedAt = Date.now();
    await kv.set(KEY, state, { ex: 60 * 60 * 4 }); // TTL 4 horas
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
