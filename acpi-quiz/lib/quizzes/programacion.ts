// lib/quizzes/programacion.ts
// Quiz original de Programación (ACPI)
import { Question } from "../questions";

export const PROGRAMACION_QUESTIONS: Question[] = [
  // ══════════════════════════════════════════════════════════════════════════
  // 1° TRIMESTRE — PARADIGMA IMPERATIVO
  // ══════════════════════════════════════════════════════════════════════════

  // ── Algoritmos y pseudocódigo ──────────────────────────────────────────
  {
    id: 1,
    topic: "Algoritmos",
    type: "theory",
    question: "¿Qué es un algoritmo?",
    options: [
      "Un programa escrito en Python",
      "Una secuencia ordenada y finita de pasos para resolver un problema",
      "Un tipo de dato numérico",
      "Un diagrama de flujo",
    ],
    correct: 1,
    explanation: "Un algoritmo es una secuencia ordenada y finita de pasos que resuelve un problema. Se puede representar en pseudocódigo, diagrama de flujo o código, pero el algoritmo es la IDEA, no el formato.",
    timeLimit: 20,
    points: 100,
  },
  {
    id: 2,
    topic: "Algoritmos",
    type: "theory",
    question: "En un diagrama de flujo, ¿qué forma geométrica representa una decisión (if/else)?",
    options: [
      "Rectángulo",
      "Óvalo",
      "Rombo",
      "Paralelogramo",
    ],
    correct: 2,
    explanation: "El rombo (diamante) representa una decisión con dos caminos posibles (Sí/No). El rectángulo es un proceso, el óvalo es inicio/fin, y el paralelogramo es entrada/salida de datos.",
    timeLimit: 20,
    points: 100,
  },

  // ── Variables, tipos de datos y expresiones ────────────────────────────
  {
    id: 3,
    topic: "Python",
    type: "code",
    language: "python",
    question: "¿Qué imprime este código?",
    code: `x = 10
y = 3
print(x // y)`,
    options: ["3.33", "3", "4", "Error"],
    correct: 1,
    explanation: "// es la división entera en Python. 10 // 3 = 3 (descarta la parte decimal, queda solo la parte entera).",
    timeLimit: 20,
    points: 100,
  },
  {
    id: 4,
    topic: "Python",
    type: "code",
    language: "python",
    question: "¿Qué tipo de dato es la variable 'dato'?",
    code: `dato = "25"
print(type(dato))`,
    options: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'bool'>"],
    correct: 2,
    explanation: "Las comillas hacen que '25' sea un STRING (texto), no un número. Para que sea un entero debería escribirse sin comillas: dato = 25.",
    timeLimit: 20,
    points: 100,
  },

  // ── Estructuras de control: selección e iteración ──────────────────────
  {
    id: 5,
    topic: "Python",
    type: "code",
    language: "python",
    question: "¿Qué imprime este código si temperatura = 32?",
    code: `temperatura = 32

if temperatura > 30:
    print("Activar ventilador")
elif temperatura > 20:
    print("Temperatura OK")
else:
    print("Activar calefacción")`,
    options: [
      "Temperatura OK",
      "Activar ventilador",
      "Activar calefacción",
      "Activar ventilador y Temperatura OK",
    ],
    correct: 1,
    explanation: "32 > 30 es True, así que entra en el primer bloque if y ejecuta 'Activar ventilador'. Como ya entró en un bloque, los elif y else se ignoran.",
    timeLimit: 25,
    points: 150,
  },
  {
    id: 6,
    topic: "Python",
    type: "code",
    language: "python",
    question: "¿Cuántas veces se imprime 'beep'?",
    code: `i = 0
while i < 5:
    if i % 2 == 0:
        print("beep")
    i += 1`,
    options: ["2", "3", "4", "5"],
    correct: 1,
    explanation: "i toma valores 0, 1, 2, 3, 4. Los pares (i % 2 == 0) son 0, 2 y 4 → se imprime 'beep' 3 veces.",
    timeLimit: 25,
    points: 150,
  },
  {
    id: 7,
    topic: "Python",
    type: "code",
    language: "python",
    question: "¿Qué imprime este bucle for?",
    code: `resultado = 0
for i in range(1, 5):
    resultado += i
print(resultado)`,
    options: ["10", "15", "4", "14"],
    correct: 0,
    explanation: "range(1, 5) genera los números 1, 2, 3, 4 (el 5 NO se incluye). La suma es 1+2+3+4 = 10.",
    timeLimit: 25,
    points: 150,
  },

  // ── Funciones, parámetros y modularización ─────────────────────────────
  {
    id: 8,
    topic: "Python",
    type: "code",
    language: "python",
    question: "¿Cuál es el resultado?",
    code: `def saludar(nombre, mensaje="Hola"):
    return f"{mensaje}, {nombre}!"

print(saludar("Juan"))`,
    options: ["Error: falta argumento", "Hola, Juan!", "mensaje, Juan!", "None"],
    correct: 1,
    explanation: '"mensaje" tiene un valor por defecto ("Hola"), por lo que no es obligatorio pasarlo. Se le pasa solo "Juan" como nombre, y mensaje queda como "Hola".',
    timeLimit: 25,
    points: 150,
  },
  {
    id: 9,
    topic: "Python",
    type: "theory",
    question: "¿Qué significa 'modularizar' un programa?",
    options: [
      "Escribir todo el código en un solo bloque largo",
      "Dividir el programa en funciones con responsabilidades claras",
      "Usar solo variables globales",
      "Eliminar los comentarios del código",
    ],
    correct: 1,
    explanation: "Modularizar es dividir un programa en partes más pequeñas (funciones/módulos) donde cada una tiene una responsabilidad clara. Esto hace el código más legible, reutilizable y fácil de depurar.",
    timeLimit: 20,
    points: 100,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 2° TRIMESTRE — PARADIGMA FUNCIONAL + HARDWARE
  // ══════════════════════════════════════════════════════════════════════════

  // ── Paradigma funcional ────────────────────────────────────────────────
  {
    id: 10,
    topic: "Funcional",
    type: "theory",
    question: "¿Cuál es la principal diferencia entre el paradigma imperativo y el funcional?",
    options: [
      "El funcional solo usa números, el imperativo usa texto",
      "El imperativo modifica el estado del programa paso a paso, el funcional opera sin modificar estado",
      "No hay diferencia, son sinónimos",
      "El funcional no puede usar variables",
    ],
    correct: 1,
    explanation: "En el paradigma imperativo, cambiás el estado del programa con asignaciones y bucles. En el funcional, operás sobre datos sin modificar el estado original: las funciones reciben datos y devuelven nuevos datos.",
    timeLimit: 25,
    points: 150,
  },
  {
    id: 11,
    topic: "Funcional",
    type: "code",
    language: "python",
    question: "¿Cuánto vale resultado[2]?",
    code: `def doble(n):
    return n * 2

numeros = [1, 2, 3, 4, 5]
resultado = list(map(doble, numeros))
print(resultado[2])`,
    options: ["3", "4", "6", "10"],
    correct: 2,
    explanation: "map() aplica la función doble() a cada elemento de la lista: [2, 4, 6, 8, 10]. El índice [2] es el tercer elemento: 6.",
    timeLimit: 25,
    points: 150,
  },
  {
    id: 12,
    topic: "Funcional",
    type: "code",
    language: "python",
    question: "¿Qué devuelve esta función recursiva con factorial(4)?",
    code: `def factorial(n):
    if n <= 1:      # condición de terminación
        return 1
    return n * factorial(n - 1)

print(factorial(4))`,
    options: ["4", "10", "24", "Error: recursión infinita"],
    correct: 2,
    explanation: "factorial(4) = 4 × factorial(3) = 4 × 3 × factorial(2) = 4 × 3 × 2 × factorial(1) = 4 × 3 × 2 × 1 = 24. La condición de terminación (n <= 1) frena la recursión.",
    timeLimit: 30,
    points: 200,
  },
  {
    id: 13,
    topic: "Funcional",
    type: "code",
    language: "python",
    question: "¿Qué imprime este código que usa filter()?",
    code: `temperaturas = [18, 25, 31, 22, 35, 28]
altas = list(filter(lambda t: t > 30, temperaturas))
print(altas)`,
    options: ["[18, 25, 22, 28]", "[31, 35]", "[35]", "Error"],
    correct: 1,
    explanation: "filter() filtra los elementos que cumplen la condición. lambda t: t > 30 deja solo los valores mayores a 30: el 31 y el 35. Resultado: [31, 35].",
    timeLimit: 30,
    points: 200,
  },

  // ── ESP32, PyFirmata y sensores ────────────────────────────────────────
  {
    id: 14,
    topic: "ESP32",
    type: "theory",
    question: "¿Qué ventaja tiene el ESP32 sobre el Arduino UNO clásico?",
    options: [
      "El ESP32 es más grande y pesado",
      "El ESP32 tiene WiFi y Bluetooth integrados",
      "El Arduino UNO tiene más memoria",
      "No hay diferencia, son la misma placa",
    ],
    correct: 1,
    explanation: "El ESP32 tiene WiFi y Bluetooth integrados, más memoria, más pines y doble núcleo. Es ideal para proyectos IoT como nuestro sistema de climatización.",
    timeLimit: 20,
    points: 100,
  },
  {
    id: 15,
    topic: "Sensores",
    type: "theory",
    question: "¿Cuál es la diferencia entre una señal analógica y una digital?",
    options: [
      "La analógica solo vale 0 o 1, la digital tiene muchos valores",
      "La digital solo vale 0 o 1 (HIGH/LOW), la analógica varía en un rango continuo",
      "No hay diferencia, son lo mismo",
      "La analógica se mide en grados y la digital en voltios",
    ],
    correct: 1,
    explanation: "Una señal DIGITAL tiene solo dos estados: 0 (LOW) o 1 (HIGH). Una señal ANALÓGICA varía de forma continua en un rango (por ejemplo, 0 a 3.3V en el ESP32), y se convierte a un número con el ADC.",
    timeLimit: 25,
    points: 150,
  },
  {
    id: 16,
    topic: "Sensores",
    type: "theory",
    question: "El sensor DHT22 mide...",
    options: [
      "Solo temperatura",
      "Solo humedad",
      "Temperatura y humedad",
      "Presión atmosférica",
    ],
    correct: 2,
    explanation: "El DHT22 es un sensor que mide tanto temperatura como humedad relativa del ambiente. Es una señal digital que se lee desde un solo pin de datos.",
    timeLimit: 15,
    points: 100,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 3° TRIMESTRE — PARADIGMA ORIENTADO A OBJETOS
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 17,
    topic: "POO",
    type: "theory",
    question: "En Programación Orientada a Objetos, ¿cómo se llama el 'molde' que usás para crear objetos?",
    options: ["Función", "Módulo", "Clase", "Variable"],
    correct: 2,
    explanation: "La CLASE es el molde o plano. A partir de una clase creás múltiples objetos (instancias) con las mismas propiedades y comportamientos.",
    timeLimit: 20,
    points: 100,
  },
  {
    id: 18,
    topic: "POO",
    type: "code",
    language: "python",
    question: "¿Qué imprime este código?",
    code: `class Sensor:
    def __init__(self, nombre, unidad):
        self.nombre = nombre
        self.unidad = unidad
    def describir(self):
        return f"{self.nombre} (mide en {self.unidad})"

s = Sensor("DHT22", "°C")
print(s.describir())`,
    options: [
      "Error: falta self",
      "DHT22 (mide en °C)",
      "Sensor (mide en unidad)",
      "None",
    ],
    correct: 1,
    explanation: "Se crea una instancia 's' de la clase Sensor con nombre='DHT22' y unidad='°C'. Al llamar s.describir(), usa self.nombre y self.unidad para armar el string.",
    timeLimit: 30,
    points: 200,
  },
  {
    id: 19,
    topic: "POO",
    type: "code",
    language: "python",
    question: "¿Qué concepto de POO se aplica acá?",
    code: `class Dispositivo:
    def encender(self):
        print("Dispositivo encendido")

class Ventilador(Dispositivo):
    def encender(self):
        print("Ventilador girando")

v = Ventilador()
v.encender()`,
    options: [
      "Encapsulamiento",
      "Herencia y polimorfismo",
      "Recursión",
      "Paradigma funcional",
    ],
    correct: 1,
    explanation: "Ventilador HEREDA de Dispositivo (class Ventilador(Dispositivo)). Además hay POLIMORFISMO: Ventilador redefine el método encender() con su propio comportamiento. Se imprime 'Ventilador girando'.",
    timeLimit: 30,
    points: 200,
  },
  {
    id: 20,
    topic: "Proyecto",
    type: "theory",
    question: "En el proyecto integrador del Sistema de Climatización, ¿qué función cumple el relay (relé)?",
    options: [
      "Mide la temperatura del ambiente",
      "Actúa como interruptor controlado eléctricamente para encender/apagar el actuador",
      "Envía datos por WiFi al celular",
      "Almacena los datos de temperatura en la nube",
    ],
    correct: 1,
    explanation: "El relay es un interruptor electromagnético. El ESP32 le envía una señal digital (HIGH/LOW) para encender o apagar un actuador (ventilador, calefactor) según la lógica del programa.",
    timeLimit: 25,
    points: 150,
  },
];
