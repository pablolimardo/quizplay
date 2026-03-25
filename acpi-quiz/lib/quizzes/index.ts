// lib/quizzes/index.ts
// Registro central de todos los quizzes disponibles
import { Question } from "../questions";
import { PROGRAMACION_QUESTIONS } from "./programacion";
import { ACPI_GENERAL_QUESTIONS } from "./acpi-general";
import { MMO_QUESTIONS } from "./mmo";
import { ESCUELA_QUESTIONS } from "./escuela";
import { PROG_GENERAL_QUESTIONS } from "./prog-general";
import { PROG_ESTRUCTURADA_QUESTIONS } from "./prog-estructurada";
import { PROG_3_IMPERATIVO_QUESTIONS } from "./prog-imperativo";

export interface QuizDefinition {
  id: string;
  name: string;
  emoji: string;
  description: string;
  questions: Question[];
}

export const QUIZ_LIST: QuizDefinition[] = [
  {
    id: "programacion",
    name: "Programación (ACPI)",
    emoji: "💻",
    description: "Python, algoritmos, POO, paradigma funcional, ESP32 y sensores",
    questions: PROGRAMACION_QUESTIONS,
  },
  {
    id: "acpi-general",
    name: "Tecnicatura ACPI",
    emoji: "⚙️",
    description: "Automatización, control, instrumentación, PLC, SCADA, electricidad",
    questions: ACPI_GENERAL_QUESTIONS,
  },
  {
    id: "mmo",
    name: "Tecnicatura MMO",
    emoji: "🔧",
    description: "Mantenimiento, mecánica, soldadura, hidráulica, neumática, materiales",
    questions: MMO_QUESTIONS,
  },
  {
    id: "escuela",
    name: "Cultura General / Escuela",
    emoji: "🎓",
    description: "Ciencia, tecnología, educación técnica, cultura escolar",
    questions: ESCUELA_QUESTIONS,
  },
  {
    id: "prog-general-3ro",
    name: "Programación 3° - General",
    emoji: "🚀",
    description: "Diseño, Funcional, Imperativo y POO - 10 preguntas",
    questions: PROG_GENERAL_QUESTIONS,
  },
  {
    id: "prog-estructurada-3ro",
    name: "Programación 3° - Algoritmos",
    emoji: "🧠",
    description: "Diseño de algoritmos, paradigma imperativo, secuencias y selección - 5 preguntas",
    questions: PROG_ESTRUCTURADA_QUESTIONS,
  },
  {
    id: "prog31-a2",
    name: "Prog31 A2",
    emoji: "🐍",
    description: "Variables, tipos, E/S, operadores, comparación, lógica y condicionales en Python - 20 preguntas",
    questions: PROG_3_IMPERATIVO_QUESTIONS,
  },
];

/** Obtiene un quiz por su ID. Si no existe, retorna el primero. */
export function getQuizById(quizId: string): QuizDefinition {
  return QUIZ_LIST.find(q => q.id === quizId) ?? QUIZ_LIST[0];
}

/** Obtiene las preguntas de un quiz por su ID */
export function getQuestionsByQuizId(quizId: string): Question[] {
  return getQuizById(quizId).questions;
}
