// pages/api/host.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { redis } from "../../lib/redis";
import { GameState, DEFAULT_STATE } from "../../lib/gameState";
import { getQuestionsFromDb, enhanceStateWithQuestion, getAllQuizzesCombined } from "../../lib/quizzes/db";

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
async function pickQuestions(previous: number[], count: number, quizId: string): Promise<number[]> {
  const questions = await getQuestionsFromDb(quizId);
  const allIndices = questions.map((_, i) => i);
  // Filtrar las de la ronda anterior
  const available = allIndices.filter(i => !previous.includes(i));
  // Si no hay suficientes disponibles (pocas preguntas), usar todas
  const pool = available.length >= count ? available : allIndices;
  return shuffle(pool).slice(0, count);
}

/** Genera permutaciones aleatorias de las opciones para cada pregunta de la ronda */
async function generateOptionShuffles(questionOrder: number[], quizId: string): Promise<number[][]> {
  const questions = await getQuestionsFromDb(quizId);
  return questionOrder.map(qIdx => {
    const q = questions[qIdx];
    if (!q || !q.options) return [0, 1, 2, 3];
    const indices = q.options.map((_: string, i: number) => i);
    return shuffle(indices); // ej: [2, 0, 3, 1]
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") return res.status(405).end();

    const { action, code } = req.body;

    // Verificación simple con clave en variables de entorno (o default local)
    if (code !== HOST_CODE) {
      return res.status(401).json({ error: "Código incorrecto" });
    }

  const state: GameState = (await redis.get<GameState>(KEY)) ?? { ...DEFAULT_STATE };
  if (!state.selectedQuiz) state.selectedQuiz = "programacion";
  if (!state.optionShuffles) state.optionShuffles = [];

  switch (action) {
    case "set_time": {
      const { multiplier } = req.body;
      if (typeof multiplier === "number" && multiplier >= 0.5 && multiplier <= 5) {
        state.timeMultiplier = multiplier;
        state.updatedAt = Date.now();
        await redis.set(KEY, JSON.stringify(state), { ex: 60 * 60 * 4 });
      }
      return res.status(200).json(await enhanceStateWithQuestion(state));
    }

    case "select_quiz": {
      const { quizId } = req.body;
      // Validar que el quizId exista en los combinados
      const allQz = await getAllQuizzesCombined();
      const exists = allQz.static.find(q => q.id === quizId) || allQz.custom.find(q => q.id === quizId);
      if (typeof quizId === "string" && exists) {
        state.selectedQuiz = quizId;
        // Resetear preguntas anteriores al cambiar de quiz
        state.previousQuestions = [];
        state.questionOrder = await pickQuestions([], QUESTIONS_PER_ROUND, quizId);
        state.optionShuffles = await generateOptionShuffles(state.questionOrder, quizId);
        state.updatedAt = Date.now();
        await redis.set(KEY, JSON.stringify(state), { ex: 60 * 60 * 4 });
      }
      return res.status(200).json(await enhanceStateWithQuestion(state));
    }

    case "reset": {
      // Guardar las preguntas actuales como "anteriores" para no repetir
      const prevQuestions = state.questionOrder.length > 0 ? [...state.questionOrder] : state.previousQuestions;
      const newQuestionOrder = await pickQuestions(prevQuestions, QUESTIONS_PER_ROUND, state.selectedQuiz);
      const fresh: GameState = {
        ...DEFAULT_STATE,
        hostCode: HOST_CODE,
        timeMultiplier: state.timeMultiplier,
        selectedQuiz: state.selectedQuiz,
        previousQuestions: prevQuestions,
        questionOrder: newQuestionOrder,
        optionShuffles: await generateOptionShuffles(newQuestionOrder, state.selectedQuiz),
        updatedAt: Date.now(),
      };
      await redis.set(KEY, JSON.stringify(fresh), { ex: 60 * 60 * 4 });
      return res.status(200).json(await enhanceStateWithQuestion(fresh));
    }

    case "start_question": {
      // Si no hay preguntas mezcladas, inicializarlas (primera vez)
      if (state.questionOrder.length === 0) {
        state.questionOrder = await pickQuestions(state.previousQuestions, QUESTIONS_PER_ROUND, state.selectedQuiz);
        if (state.questionOrder.length === 0) {
           return res.status(400).json({ error: "Este cuestionario está vacío. Agregá preguntas en el menú de Gestión." });
        }
        state.optionShuffles = await generateOptionShuffles(state.questionOrder, state.selectedQuiz);
        state.currentQuestion = 0;
        // Limpiar respuestas previas
        for (const key of Object.keys(state.players)) {
          state.players[key].score = 0;
          state.players[key].streak = 0;
          state.players[key].answers = [];
        }
      }
      if (!state.optionShuffles || state.optionShuffles.length === 0) {
        state.optionShuffles = await generateOptionShuffles(state.questionOrder, state.selectedQuiz);
      }
      state.status = "question";
      state.questionStartedAt = Date.now();
      state.updatedAt = Date.now();
      await redis.set(KEY, JSON.stringify(state), { ex: 60 * 60 * 4 });
      return res.status(200).json(await enhanceStateWithQuestion(state));
    }

    case "reveal": {
      state.status = "answer_reveal";
      state.updatedAt = Date.now();
      await redis.set(KEY, JSON.stringify(state), { ex: 60 * 60 * 4 });
      return res.status(200).json(await enhanceStateWithQuestion(state));
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
      return res.status(200).json(await enhanceStateWithQuestion(state));
    }

    case "show_leaderboard": {
      state.status = "leaderboard";
      state.updatedAt = Date.now();
      await redis.set(KEY, JSON.stringify(state), { ex: 60 * 60 * 4 });
      return res.status(200).json(await enhanceStateWithQuestion(state));
    }

    default:
      return res.status(400).json({ error: "Acción desconocida" });
    }
  } catch (error: any) {
    console.error("API Host Error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
