// pages/api/join.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { redis } from "../../lib/redis";
import { GameState, DEFAULT_STATE, Player } from "../../lib/gameState";

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

  const { name } = req.body as { name: string };
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ error: "Nombre inválido" });
  }

  const cleanName = name.trim().substring(0, 20);

  const locked = await acquireLock(3500);
  try {
    const state: GameState = (await redis.get<GameState>(KEY)) ?? { ...DEFAULT_STATE };

    if (state.status !== "waiting") {
      return res.status(400).json({ error: "El juego ya comenzó, esperá la próxima ronda." });
    }

    const key = cleanName.toLowerCase();
    if (!state.players[key]) {
      const player: Player = { name: cleanName, score: 0, streak: 0, answers: [] };
      state.players[key] = player;
      state.updatedAt = Date.now();
      await redis.set(KEY, JSON.stringify(state), { ex: 60 * 60 * 4 });
    }

    return res.status(200).json({ ok: true, name: cleanName });
  } finally {
    if (locked) {
      await redis.del(LOCK_KEY).catch(() => {});
    }
  }
}
