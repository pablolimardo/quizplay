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
    question: "¿Qué tipo de dato devuelve type() para cada variable?",
    code: `sensor_pin = 7\ntemperatura = 85.3\nnombre = "DHT11"\nalarma = True\nprint(type(sensor_pin))`,
    options: [
      "<class 'float'>",
      "<class 'str'>",
      "<class 'int'>",
      "<class 'bool'>",
    ],
    correct: 2,
    explanation: "sensor_pin = 7 es un número entero sin decimales, entonces Python lo reconoce como int. Si hubiera sido 7.0 ya sería float. La función type() nos permite verificar el tipo de cualquier variable.",
    timeLimit: 25,
    points: 150,
  },

  {
    id: 4,
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
    id: 5,
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
    id: 6,
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

  // ── OPERADORES ARITMÉTICOS ───────────────────────────────────

  {
    id: 7,
    topic: "Operadores Aritméticos",
    type: "theory",
    question: "¿Qué hace el operador % (módulo) en Python?",
    options: [
      "Calcula el porcentaje entre dos números",
      "Devuelve el cociente entero de una división",
      "Devuelve el resto de la división entre dos números",
      "Multiplica dos números y divide por 100",
    ],
    correct: 2,
    explanation: "El operador % devuelve el RESTO de la división. Por ejemplo, 17 % 5 = 2 porque 17 = 5×3 + 2. Es muy útil para saber si un número es par (n % 2 == 0) o para ciclos que se repiten cada N pasos.",
    timeLimit: 20,
    points: 100,
  },

  {
    id: 8,
    topic: "Operadores Aritméticos",
    type: "code",
    language: "python",
    question: "Una bomba consume 2.5 kW/hora. ¿Cuánto imprime este programa si funcionó 8 horas?",
    code: `horas = 8\nconsumo_kw = 2.5\ntotal = consumo_kw * horas\ncosto = total * 180\nprint(f"Consumo: {total} kWh | Costo: \${costo}")`,
    options: [
      "Consumo: 10.5 kWh | Costo: $1800",
      "Consumo: 20.0 kWh | Costo: $3600",
      "Consumo: 2.5 kWh | Costo: $450",
      "Consumo: 10.0 kWh | Costo: $3600",
    ],
    correct: 3,
    explanation: "Consumo total = 2.5 × 8 = 20.0 kWh. Costo = 20.0 × 180 = 3600. El f-string muestra ambos resultados en una sola línea. Cuidado: la respuesta C confunde el consumo por hora con el total.",
    timeLimit: 25,
    points: 150,
  },

  {
    id: 9,
    topic: "Operadores Aritméticos",
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

  // ── OPERADORES DE COMPARACIÓN ────────────────────────────────

  {
    id: 10,
    topic: "Operadores de Comparación",
    type: "theory",
    question: "¿Qué tipo de dato devuelve siempre una expresión de comparación como temperatura > 80?",
    options: [
      "int — devuelve 0 o 1",
      "float — devuelve el resultado decimal",
      "bool — devuelve True o False",
      "str — devuelve 'mayor' o 'menor'",
    ],
    correct: 2,
    explanation: "Cualquier comparación en Python devuelve un valor booleano: True (verdadero) o False (falso). Es por eso que podemos usar comparaciones directamente en un if: el if evalúa si la condición es True o False.",
    timeLimit: 20,
    points: 100,
  },

  {
    id: 11,
    topic: "Operadores de Comparación",
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

  {
    id: 12,
    topic: "Operadores de Comparación",
    type: "code",
    language: "python",
    question: "Un sensor mide presión. ¿Qué imprime este programa si presion = 4.2?",
    code: `presion = 4.2\nif presion >= 4.0 and presion <= 6.0:\n    print("Presión normal")\nelif presion < 4.0:\n    print("Presión baja")\nelse:\n    print("Presión alta")`,
    options: [
      "Presión baja",
      "Presión alta",
      "Presión normal",
      "No imprime nada",
    ],
    correct: 2,
    explanation: "4.2 cumple la condición 4.2 >= 4.0 (verdadero) AND 4.2 <= 6.0 (verdadero). Como ambas son verdaderas, la condición completa es True y entra al primer bloque imprimiendo 'Presión normal'.",
    timeLimit: 25,
    points: 150,
  },

  // ── OPERADORES LÓGICOS ───────────────────────────────────────

  {
    id: 13,
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

  {
    id: 14,
    topic: "Operadores Lógicos",
    type: "theory",
    question: "¿Cuándo devuelve True el operador or?",
    options: [
      "Solo cuando ambas condiciones son verdaderas",
      "Cuando al menos una de las condiciones es verdadera",
      "Solo cuando la primera condición es verdadera",
      "Cuando ninguna condición es verdadera",
    ],
    correct: 1,
    explanation: "El operador or es más permisivo: devuelve True si AL MENOS UNA condición es verdadera. Solo devuelve False cuando TODAS son falsas. Es como una alarma que suena si hay humo OR si hay calor — basta con una sola condición.",
    timeLimit: 20,
    points: 100,
  },

  {
    id: 15,
    topic: "Operadores Lógicos",
    type: "code",
    language: "python",
    question: "Un motor arranca solo si tensión está entre 210V y 230V AND corriente < 15A. Si tension = 220 y corriente = 16, ¿qué imprime?",
    code: `tension = 220\ncorriente = 16\ntension_ok = tension >= 210 and tension <= 230\ncorriente_ok = corriente < 15\nif tension_ok and corriente_ok:\n    print("Arranque seguro")\nelse:\n    print("Arranque bloqueado")`,
    options: [
      "Arranque seguro",
      "Arranque bloqueado",
      "Error: condición inválida",
      "No imprime nada",
    ],
    correct: 1,
    explanation: "tension_ok = (220 >= 210 AND 220 <= 230) = True. corriente_ok = (16 < 15) = False. La condición final es True AND False = False. Como la condición completa es False, entra al else e imprime 'Arranque bloqueado'.",
    timeLimit: 25,
    points: 150,
  },

  {
    id: 16,
    topic: "Operadores Lógicos",
    type: "code",
    language: "python",
    question: "Una alarma se activa si temperatura > 90 OR presion > 6. Si temp = 85 y presion = 7, ¿qué imprime?",
    code: `temperatura = 85\npresion = 7\nif temperatura > 90 or presion > 6:\n    print("ALARMA ACTIVA")\nelse:\n    print("Sistema normal")`,
    options: [
      "Sistema normal",
      "ALARMA ACTIVA",
      "Error: dos condiciones no se pueden combinar",
      "No imprime nada",
    ],
    correct: 1,
    explanation: "temperatura > 90 es False (85 no supera 90). presion > 6 es True (7 supera 6). False OR True = True. Basta que UNA condición sea verdadera para que or devuelva True, por eso se activa la alarma.",
    timeLimit: 20,
    points: 100,
  },

  // ── CONDICIONALES ────────────────────────────────────────────

  {
    id: 17,
    topic: "Estructuras Condicionales",
    type: "theory",
    question: "¿Cuál es la diferencia entre usar elif y usar un segundo if independiente?",
    options: [
      "No hay diferencia, son equivalentes siempre",
      "elif solo se evalúa si el if anterior fue False; un segundo if se evalúa siempre",
      "elif es más rápido que if en todos los casos",
      "elif permite más de dos opciones, if solo dos",
    ],
    correct: 1,
    explanation: "Con elif, si el primer if es True, Python saltea todos los elif siguientes. Con un segundo if independiente, Python lo evalúa siempre, aunque el primero ya haya sido True. Esto importa cuando las condiciones no son excluyentes.",
    timeLimit: 25,
    points: 150,
  },

  {
    id: 18,
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
    id: 19,
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

  {
    id: 20,
    topic: "Estructuras Condicionales",
    type: "code",
    language: "python",
    question: "Un sistema habilita el arranque si puerta == 'cerrada' AND presion > 4 AND codigo == 1234. Si solo falla la presión (es 3.5), ¿qué imprime?",
    code: `puerta = "cerrada"\npresion = 3.5\ncodigo = 1234\nif puerta == "cerrada" and presion > 4 and codigo == 1234:\n    print("Arranque habilitado")\nelif puerta != "cerrada":\n    print("Bloqueado: puerta abierta")\nelif presion <= 4:\n    print("Bloqueado: presión insuficiente")\nelse:\n    print("Bloqueado: código incorrecto")`,
    options: [
      "Arranque habilitado",
      "Bloqueado: puerta abierta",
      "Bloqueado: presión insuficiente",
      "Bloqueado: código incorrecto",
    ],
    correct: 2,
    explanation: "El primer if es False porque presion > 4 falla (3.5 no supera 4). El primer elif compara puerta != 'cerrada', que es False. El segundo elif evalúa presion <= 4, que es True (3.5 <= 4), entonces imprime 'Bloqueado: presión insuficiente'.",
    timeLimit: 30,
    points: 200,
  },

];
