import { redis } from "../redis";
import { getQuizById, getQuestionsByQuizId, QUIZ_LIST, QuizDefinition } from "./index";
import { Question } from "../questions";
import { GameState } from "../gameState";

const CUSTOM_SET = "custom_quizzes_set";

export async function getAllCustomQuizzes(): Promise<QuizDefinition[]> {
  const ids = await redis.smembers(CUSTOM_SET);
  const result: QuizDefinition[] = [];
  for (const id of ids) {
    const meta = await redis.get(`quiz_meta:${id}`);
    const questionsRaw = await redis.get(`quiz_questions:${id}`);
    if (meta) {
      const parsed = typeof meta === "string" ? JSON.parse(meta) : meta;
      const parsedQuestions = questionsRaw ? (typeof questionsRaw === "string" ? JSON.parse(questionsRaw) : questionsRaw) : [];
      result.push({ ...parsed, questions: parsedQuestions });
    }
  }
  return result;
}

export async function getAllQuizzesCombined(): Promise<{ static: QuizDefinition[], custom: QuizDefinition[] }> {
  const custom = await getAllCustomQuizzes();
  return { static: QUIZ_LIST, custom };
}

export async function getQuizFromDb(quizId: string) {
  const isCustom = await redis.sismember(CUSTOM_SET, quizId);
  if (isCustom) {
    const meta = await redis.get(`quiz_meta:${quizId}`);
    const questions = await redis.get(`quiz_questions:${quizId}`);
    return {
      meta: meta ? (typeof meta === "string" ? JSON.parse(meta) : meta) : null,
      questions: (questions ? (typeof questions === "string" ? JSON.parse(questions) : questions) : []) as Question[],
      isCustom: true
    };
  }
  // Fallback a los estáticos
  const staticQuiz = getQuizById(quizId);
  return {
    meta: staticQuiz,
    questions: staticQuiz?.questions || [],
    isCustom: false
  };
}

export async function getQuestionsFromDb(quizId: string): Promise<Question[]> {
  const { questions } = await getQuizFromDb(quizId);
  return questions;
}

/** 
 * Adjunta la data completa de la pregunta actual (si la hay) al Payload del State.
 * Así `play` y `host` en frontend evitan tener configurados los arrays de preguntas fijos.
 */
export async function enhanceStateWithQuestion(state: GameState): Promise<GameState & { questionData?: Question }> {
  if (state.status === "question" || state.status === "answer_reveal") {
    const questions = await getQuestionsFromDb(state.selectedQuiz || "programacion");
    const qIdx = state.questionOrder[state.currentQuestion];
    if (qIdx !== undefined && questions[qIdx]) {
       return { ...state, questionData: questions[qIdx] };
    }
  }
  return state;
}
