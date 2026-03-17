import type { NextApiRequest, NextApiResponse } from "next";
import { redis } from "../../../../lib/redis";
import { getAllQuizzesCombined } from "../../../../lib/quizzes/db";

const CUSTOM_SET = "custom_quizzes_set";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const quizzes = await getAllQuizzesCombined();
    return res.status(200).json(quizzes);
  }

  if (req.method === "POST") {
    const { id, name, emoji, description } = req.body;
    if (!id || !name) return res.status(400).json({ error: "Faltan datos obligatorios" });

    // Guardamos en Set
    await redis.sadd(CUSTOM_SET, id);
    // Guardamos metadata
    const meta = { id, name, emoji, description };
    await redis.set(`quiz_meta:${id}`, JSON.stringify(meta));
    // Inicializamos preguntas vacías
    await redis.set(`quiz_questions:${id}`, JSON.stringify([]));

    return res.status(201).json({ success: true, meta });
  }

  return res.status(405).end();
}
