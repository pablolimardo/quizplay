import { Question } from "../questions";

export const PROG_3_IMPERATIVO_QUESTIONS: Question[] = [

  // ── VARIABLES Y TIPOS ────────────────────────────────────────

  {
    id: 1,
    topic: "Variables y Tipos",
    type: "theory",
    question: "¿Cuál es la mejor analogía para entender qué es una variable en Python?",
    options: [
      "Una operación matemática que se ejecuta sola",
      "Una caja con etiqueta: el nombre es la etiqueta y el dato guardado es el contenido",
      "Un archivo guardado en el disco rígido de la computadora",
      "Un cable de conexión entre dos dispositivos",
    ],
    correct: 1,
    explanation: "Una variable es un espacio en memoria con nombre propio. Cuando escribimos temperatura = 85.3, 'temperatura' es la etiqueta y 85.3 es el contenido. Podemos cambiar el contenido cuando queramos sin cambiar la etiqueta.",
    timeLimit: 20,
    points: 100,
  },

  {
    id: 2,
    topic: "Variables y Tipos",
    type: "theory",
    question: "¿Cuáles son los cuatro tipos de datos básicos que vimos en Python?",
    options: [
      "numero, texto, logico, decimal",
      "int, float, str, bool",
      "entero, cadena, verdadero, lista",
      "input, output, print, variable",
    ],
    correct: 1,
    explanation: "Los cuatro tipos básicos son: int (enteros, ej. 7), float (decimales, ej. 85.3), str (texto, ej. 'DHT11') y bool (verdadero o falso, ej. True). Python detecta el tipo automáticamente según el valor que asignamos.",
    timeLimit: 20,
    points: 100,
  },

  {
    id: 3,
    topic: "Variables y Tipos",
    type: "code",
    language: "python",
    question: "¿Cuál de estas declaraciones de variable es incorrecta según las reglas de Python?",
    options: [
      "temperatura_maxima = 90",
      "pin_sensor = 7",
      "1er_sensor = 'DHT11'",
      "estado_bomba = True",
    ],
    correct: 2,
    explanation: "Los nombres de variables no pueden empezar con un número. '1er_sensor' es inválido porque empieza con '1'. La convención en Python es usar snake_case: palabras en minúscula separadas por guión bajo, comenzando siempre con una letra.",
    timeLimit: 20,
    points: 100,
  },

  // ── ENTRADA Y SALIDA ─────────────────────────────────────────

  {
    id: 4,
    topic: "Entrada y Salida",
    type: "theory",
    question: "¿Por qué hay que usar float(input(...)) y no solo input(...) cuando queremos leer un número decimal?",
    options: [
      "Porque input() solo funciona con números enteros",
      "Porque input() siempre devuelve texto (str), y no se puede operar matemáticamente con texto",
      "Porque float() es más rápido que input()",
      "No es necesario, Python convierte el tipo automáticamente",
    ],
    correct: 1,
    explanation: "input() devuelve SIEMPRE una cadena de texto (str), aunque el usuario escriba un número. Si intentamos hacer '85.3' + 10 Python da error porque no puede sumar texto y número. Con float(input()) convertimos el texto a decimal antes de operar.",
    timeLimit: 25,
    points: 150,
  },

  {
    id: 5,
    topic: "Entrada y Salida",
    type: "code",
    language: "python",
    question: "¿Qué imprime este programa si el usuario escribe 25?",
    code: `lectura = float(input("Temperatura: "))\nprint(f"En Fahrenheit: {lectura * 9/5 + 32}")`,
    options: [
      "En Fahrenheit: 25",
      "En Fahrenheit: 77.0",
      "Error: no se puede convertir",
      "En Fahrenheit: 45.0",
    ],
    correct: 1,
    explanation: "La fórmula de conversión es °F = °C × 9/5 + 32. Con 25°C: 25 × 9/5 + 32 = 45 + 32 = 77.0°F. El f-string permite insertar el resultado de la expresión directamente dentro del mensaje.",
    timeLimit: 25,
    points: 150,
  },

  // ── OPERADORES ───────────────────────────────────────────────

  {
    id: 6,
    topic: "Operadores",
    type: "code",
    language: "python",
    question: "¿Cuál es la diferencia entre / y // en Python?",
    code: `a = 17\nprint(a / 5)\nprint(a // 5)`,
    options: [
      "Ambas imprimen 3",
      "/ imprime 3.4 y // imprime 3",
      "/ imprime 3 y // imprime 3.4",
      "// imprime el resto, / el cociente",
    ],
    correct: 1,
    explanation: "El operador / siempre devuelve un float con decimales (17/5 = 3.4). El operador // es la división entera y descarta los decimales (17//5 = 3). Son operadores distintos con resultados distintos.",
    timeLimit: 20,
    points: 100,
  },

  {
    id: 7,
    topic: "Operadores",
    type: "code",
    language: "python",
    question: "¿Cuál es la diferencia entre = y == en Python?",
    code: `temperatura = 85\nprint(temperatura == 85)\nprint(temperatura == 90)`,
    options: [
      "Son lo mismo, ambos comparan valores",
      "= asigna un valor a una variable, == compara si dos valores son iguales",
      "== asigna, = compara",
      "= compara números, == compara texto",
    ],
    correct: 1,
    explanation: "= es el operador de ASIGNACIÓN: guarda un valor en una variable. == es el operador de COMPARACIÓN: pregunta si dos valores son iguales y devuelve True o False. Confundirlos es uno de los errores más comunes al empezar.",
    timeLimit: 20,
    points: 100,
  },

  // ── OPERADORES LÓGICOS ───────────────────────────────────────

  {
    id: 8,
    topic: "Operadores Lógicos",
    type: "theory",
    question: "¿Cuándo devuelve True el operador and?",
    options: [
      "Cuando al menos una de las dos condiciones es verdadera",
      "Cuando ninguna de las dos condiciones es verdadera",
      "Solo cuando ambas condiciones son verdaderas al mismo tiempo",
      "Siempre que la primera condición sea verdadera",
    ],
    correct: 2,
    explanation: "El operador and es exigente: necesita que TODAS las condiciones sean True para devolver True. Si alguna es False, el resultado es False. Es como el enclavamiento de seguridad de una máquina: todas las condiciones deben cumplirse para arrancar.",
    timeLimit: 20,
    points: 100,
  },

  // ── CONDICIONALES ────────────────────────────────────────────

  {
    id: 9,
    topic: "Estructuras Condicionales",
    type: "code",
    language: "python",
    question: "¿Qué imprime este programa si temperatura = 95?",
    code: `temperatura = 95\nif temperatura > 90:\n    estado = "CRÍTICO"\nelif temperatura > 80:\n    estado = "ATENCIÓN"\nelif temperatura > 60:\n    estado = "NORMAL"\nelse:\n    estado = "FRÍO"\nprint(estado)`,
    options: [
      "NORMAL",
      "ATENCIÓN",
      "CRÍTICO",
      "FRÍO",
    ],
    correct: 2,
    explanation: "95 > 90 es True, entonces estado = 'CRÍTICO' y Python saltea todos los elif y el else. Aunque 95 también cumpliría temperatura > 80 y temperatura > 60, esas condiciones nunca se evalúan porque la primera ya fue verdadera.",
    timeLimit: 20,
    points: 100,
  },

  {
    id: 10,
    topic: "Estructuras Condicionales",
    type: "code",
    language: "python",
    question: "El programa tiene un error lógico. ¿Cuál es?",
    code: `nota = float(input("Nota: "))\nif nota >= 7:\n    print("Aprobado")\nif nota < 7:\n    print("Desaprobado")\nif nota > 10:\n    print("Nota inválida")`,
    options: [
      "Falta el else al final",
      "Se usan tres if independientes: si nota es 11, imprime 'Aprobado' y 'Nota inválida' al mismo tiempo",
      "float() no funciona con input()",
      "El programa no tiene errores",
    ],
    correct: 1,
    explanation: "Con tres if independientes, si nota = 11: el primero (>=7) es True → imprime 'Aprobado'. El segundo (<7) es False → no imprime. El tercero (>10) es True → imprime 'Nota inválida'. Se imprimen dos mensajes para una sola nota. La solución es usar elif y mover la validación al principio.",
    timeLimit: 30,
    points: 200,
  },

];
