// pages/api/presence.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { redis } from "../../lib/redis";

const PRESENCE_KEY = "acpi_quiz_presence";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { playerName, status } = req.body as {
    playerName: string;
    status: "active" | "away";
  };

  if (!playerName || !["active", "away"].includes(status)) {
    return res.status(400).json({ error: "Datos inválidos" });
  }

  const key = playerName.toLowerCase().trim();
  const data = JSON.stringify({
    presence: status,
    lastPresenceUpdate: Date.now(),
  });

  // Guardar en hash independiente sin tocar acpi_quiz_state
  // Esto elimina la race condition que sobrescribía respuestas y puntajes de los alumnos
  await redis.hset(PRESENCE_KEY, { [key]: data });
  await redis.expire(PRESENCE_KEY, 60 * 60 * 4);

  return res.status(200).json({ ok: true });
}
