import { Question } from "../questions";

export const PROG_3_IMPERATIVO_2_QUESTIONS: Question[] = [

  // ── VARIABLES Y TIPOS ────────────────────────────────────────

  {
    id: 1,
    topic: "Variables y Tipos",
    type: "code",
    language: "python",
    question: "¿Qué imprime este programa?",
    code: `x = 10\nx = x + 5\nprint(x)`,
    options: [
      "10",
      "15",
      "x + 5",
      "Error: no se puede usar x dos veces",
    ],
    correct: 1,
    explanation: "Primero x vale 10. Luego x = x + 5 toma el valor actual de x (10), le suma 5, y guarda el resultado (15) de nuevo en x. La variable se puede reasignar cuantas veces queramos.",
    timeLimit: 20,
    points: 100,
  },

  {
    id: 2,
    topic: "Variables y Tipos",
    type: "code",
    language: "python",
    question: "¿Qué imprime este código?",
    code: `a = "5"\nb = "3"\nprint(a + b)`,
    options: [
      "8",
      "53",
      "Error: no se pueden sumar strings",
      "5 + 3",
    ],
    correct: 1,
    explanation: "Como 'a' y 'b' son strings (tienen comillas), el operador + CONCATENA los textos en vez de sumarlos. '5' + '3' = '53'. Para obtener 8 habría que escribir a = 5 y b = 3 (sin comillas).",
    timeLimit: 20,
    points: 100,
  },

  {
    id: 3,
    topic: "Variables y Tipos",
    type: "theory",
    question: "¿Cuál es la diferencia entre el int 25 y el str '25' en Python?",
    options: [
      "No hay diferencia, Python los trata igual",
      "El int 25 es un número con el que se puede operar; el str '25' es texto y no se puede usar en cuentas matemáticas",
      "El str '25' es más preciso que el int 25",
      "El int 25 solo funciona dentro de un print()",
    ],
    correct: 1,
    explanation: "El int 25 es un número: podemos sumar, restar, multiplicar. El str '25' es texto: si hacemos '25' + '25' obtenemos '2525' (concatenación), no 50. Por eso usamos int() o float() para convertir texto a número.",
    timeLimit: 20,
    points: 100,
  },

  // ── ENTRADA Y SALIDA ─────────────────────────────────────────

  {
    id: 4,
    topic: "Entrada y Salida",
    type: "code",
    language: "python",
    question: "El usuario escribe 10. ¿Qué pasa al ejecutar este código?",
    code: `edad = input("Tu edad: ")\nprint(edad + 5)`,
    options: [
      "Imprime 15",
      "Imprime 105",
      "Da error porque no se puede sumar str + int",
      "Imprime '10 5'",
    ],
    correct: 2,
    explanation: "input() devuelve siempre un str. Intentar sumar '10' + 5 genera un TypeError porque Python no puede sumar texto con número. La solución es convertir: edad = int(input('Tu edad: ')).",
    timeLimit: 25,
    points: 150,
  },

  {
    id: 5,
    topic: "Entrada y Salida",
    type: "code",
    language: "python",
    question: "¿Qué imprime este programa si el usuario escribe 12?",
    code: `valor = int(input("Ingrese un número: "))\ndoble = valor * 2\nprint(f"El doble de {valor} es {doble}")`,
    options: [
      "El doble de 12 es 12",
      "El doble de 12 es 24",
      "El doble de valor es doble",
      "Error: int no funciona con input",
    ],
    correct: 1,
    explanation: "int(input(...)) convierte el texto '12' al número entero 12. Luego doble = 12 * 2 = 24. El f-string reemplaza {valor} por 12 y {doble} por 24 dentro del mensaje.",
    timeLimit: 20,
    points: 100,
  },

  // ── OPERADORES ───────────────────────────────────────────────

  {
    id: 6,
    topic: "Operadores",
    type: "code",
    language: "python",
    question: "¿Qué imprime este código?",
    code: `numero = 17\nresto = numero % 2\nprint(resto)`,
    options: [
      "8.5",
      "8",
      "1",
      "0",
    ],
    correct: 2,
    explanation: "El operador % devuelve el RESTO de la división. 17 ÷ 2 = 8 con resto 1. Entonces 17 % 2 = 1. Si el resto es 0 el número es par; si es 1 es impar. En este caso 17 es impar.",
    timeLimit: 20,
    points: 100,
  },

  {
    id: 7,
    topic: "Operadores",
    type: "code",
    language: "python",
    question: "¿Qué imprime este código? Atención al orden de las operaciones.",
    code: `resultado = 2 + 3 * 4\nprint(resultado)`,
    options: [
      "20",
      "14",
      "24",
      "Error",
    ],
    correct: 1,
    explanation: "Python respeta la precedencia matemática: primero multiplica 3 * 4 = 12, luego suma 2 + 12 = 14. Si quisiéramos que sume primero, habría que usar paréntesis: (2 + 3) * 4 = 20.",
    timeLimit: 20,
    points: 100,
  },

  // ── OPERADORES LÓGICOS ───────────────────────────────────────

  {
    id: 8,
    topic: "Operadores Lógicos",
    type: "code",
    language: "python",
    question: "Una alarma se activa si temperatura > 90 OR presión > 6. Si temp = 85 y presión = 7, ¿qué imprime?",
    code: `temperatura = 85\npresion = 7\nif temperatura > 90 or presion > 6:\n    print("ALARMA ACTIVA")\nelse:\n    print("Sistema normal")`,
    options: [
      "Sistema normal",
      "ALARMA ACTIVA",
      "Error: no se pueden combinar dos condiciones",
      "No imprime nada",
    ],
    correct: 1,
    explanation: "temperatura > 90 es False (85 no supera 90). presion > 6 es True (7 supera 6). False OR True = True. Basta que UNA condición sea verdadera para que or devuelva True, por eso se activa la alarma.",
    timeLimit: 20,
    points: 100,
  },

  // ── CONDICIONALES ────────────────────────────────────────────

  {
    id: 9,
    topic: "Estructuras Condicionales",
    type: "code",
    language: "python",
    question: "¿Qué imprime si el usuario escribe 150?",
    code: `valor = int(input("Ingrese tensión: "))\nif valor < 200:\n    print("Tensión BAJA")\nelif valor <= 240:\n    print("Tensión NORMAL")\nelse:\n    print("Tensión ALTA")`,
    options: [
      "Tensión NORMAL",
      "Tensión BAJA",
      "Tensión ALTA",
      "No imprime nada",
    ],
    correct: 1,
    explanation: "150 < 200 es True, entonces entra al primer bloque e imprime 'Tensión BAJA'. Como ya entró en un bloque, el elif y el else se saltan. No importa que 150 también cumpla <= 240.",
    timeLimit: 20,
    points: 100,
  },

  {
    id: 10,
    topic: "Estructuras Condicionales",
    type: "code",
    language: "python",
    question: "Un motor arranca solo si tensión está entre 210 y 230 AND corriente < 15. Si tensión = 220 y corriente = 16, ¿qué imprime?",
    code: `tension = 220\ncorriente = 16\nif tension >= 210 and tension <= 230 and corriente < 15:\n    print("Arranque seguro")\nelse:\n    print("Arranque bloqueado")`,
    options: [
      "Arranque seguro",
      "Arranque bloqueado",
      "Error: demasiadas condiciones",
      "No imprime nada",
    ],
    correct: 1,
    explanation: "tension >= 210 es True, tension <= 230 es True, pero corriente < 15 es False (16 no es menor que 15). Como usamos and, TODAS deben ser True. True AND True AND False = False, entonces imprime 'Arranque bloqueado'.",
    timeLimit: 25,
    points: 150,
  },

];
