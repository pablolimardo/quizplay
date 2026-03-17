// pages/api/presence.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { redis } from "../../lib/redis";
import { GameState, DEFAULT_STATE } from "../../lib/gameState";

const KEY = "acpi_quiz_state";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { playerName, status } = req.body as {
    playerName: string;
    status: "active" | "away";
  };

  if (!playerName || !["active", "away"].includes(status)) {
    return res.status(400).json({ error: "Datos inválidos" });
  }

  const state: GameState = (await redis.get<GameState>(KEY)) ?? { ...DEFAULT_STATE };
  const key = playerName.toLowerCase();

  if (!state.players[key]) {
    return res.status(404).json({ error: "Jugador no encontrado" });
  }

  state.players[key].presence = status;
  state.players[key].lastPresenceUpdate = Date.now();
  state.updatedAt = Date.now();
  await redis.set(KEY, JSON.stringify(state), { ex: 60 * 60 * 4 });

  return res.status(200).json({ ok: true });
}
