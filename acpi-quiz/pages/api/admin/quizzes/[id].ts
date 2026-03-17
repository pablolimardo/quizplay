import type { NextApiRequest, NextApiResponse } from "next";
import { redis } from "../../../../lib/redis";
import { getQuizFromDb } from "../../../../lib/quizzes/db";

const CUSTOM_SET = "custom_quizzes_set";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const quizId = typeof id === "string" ? id : id?.[0] || "";

  if (req.method === "GET") {
    const { meta, questions, isCustom } = await getQuizFromDb(quizId);
    if (!meta) return res.status(404).json({ error: "Cuestionario no encontrado" });
    return res.status(200).json({ meta, questions, isCustom });
  }

  // Las modificaciones de PUT (guardar preguntas) y DELETE sólo aplican a los generados en BD
  const isCustom = await redis.sismember(CUSTOM_SET, quizId);
  if (!isCustom) {
    return res.status(403).json({ error: "No se puede modificar un quiz grabado en el código. Creá uno personalizado primero." });
  }

  if (req.method === "PUT") {
    // Actualizar metadata del quiz (si envían) y/o las preguntas
    const { questions, meta } = req.body;
    if (questions && Array.isArray(questions)) {
      await redis.set(`quiz_questions:${quizId}`, JSON.stringify(questions));
    }
    if (meta && meta.name) {
      await redis.set(`quiz_meta:${quizId}`, JSON.stringify(meta));
    }
    return res.status(200).json({ success: true });
  }

  if (req.method === "DELETE") {
    // Eliminar todo rastro del quiz en Redis
    await redis.srem(CUSTOM_SET, quizId);
    await redis.del(`quiz_meta:${quizId}`);
    await redis.del(`quiz_questions:${quizId}`);
    return res.status(200).json({ success: true });
  }

  return res.status(405).end();
}
