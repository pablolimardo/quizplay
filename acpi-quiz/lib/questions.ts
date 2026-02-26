// lib/questions.ts
export interface Question {
  id: number;
  topic: string;
  type: "code" | "theory";
  language?: "python" | "arduino" | "html" | "css";
  question: string;
  code?: string;
  options: string[];
  correct: number;
  explanation: string;
  timeLimit: number;
  points: number;
}

export const QUESTIONS: Question[] = [
  // ── PYTHON ──────────────────────────────────────────────────────────────
  {
    id: 1,
    topic: "Python",
    type: "code",
    language: "python",
    question: "¿Qué imprime este código?",
    code: `x = 10
y = 3
print(x // y)`,
    options: ["3.33", "3", "4", "Error"],
    correct: 1,
    explanation: "// es la división entera en Python. 10 // 3 = 3 (descarta el resto).",
    timeLimit: 20,
    points: 100,
  },
  {
    id: 2,
    topic: "Python",
    type: "code",
    language: "python",
    question: "¿Cuál es el resultado?",
    code: `def saludar(nombre, mensaje="Hola"):
    return f"{mensaje}, {nombre}!"

print(saludar("Juan"))`,
    options: ["Error: falta argumento", "Hola, Juan!", "mensaje, Juan!", "None"],
    correct: 1,
    explanation: '"mensaje" tiene un valor por defecto ("Hola"), por lo que no es obligatorio pasarlo.',
    timeLimit: 25,
    points: 150,
  },
  {
    id: 3,
    topic: "Python",
    type: "code",
    language: "python",
    question: "¿Qué imprime este bucle?",
    code: `resultado = 0
for i in range(1, 5):
    resultado += i
print(resultado)`,
    options: ["10", "15", "4", "14"],
    correct: 0,
    explanation: "range(1,5) genera [1,2,3,4]. La suma es 1+2+3+4 = 10.",
    timeLimit: 25,
    points: 150,
  },
  {
    id: 4,
    topic: "Python",
    type: "code",
    language: "python",
    question: "¿Qué tipo de dato es esto?",
    code: `datos = [1, "hola", True, 3.14]
print(type(datos))`,
    options: ["<class 'tuple'>", "<class 'dict'>", "<class 'list'>", "<class 'set'>"],
    correct: 2,
    explanation: "Los corchetes [] definen una lista en Python. Puede contener elementos de distintos tipos.",
    timeLimit: 20,
    points: 100,
  },
  {
    id: 5,
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
    explanation: "i toma valores 0,1,2,3,4. Los pares son 0, 2 y 4 → se imprime 3 veces.",
    timeLimit: 30,
    points: 200,
  },
  {
    id: 6,
    topic: "Python",
    type: "code",
    language: "python",
    question: "¿Qué devuelve esta función?",
    code: `def misterio(lista):
    return lista[-1]

print(misterio([10, 20, 30, 40]))`,
    options: ["10", "Error", "40", "None"],
    correct: 2,
    explanation: "El índice -1 accede al ÚLTIMO elemento de una lista. La lista tiene 4 elementos, el último es 40.",
    timeLimit: 20,
    points: 100,
  },
  {
    id: 7,
    topic: "Python",
    type: "theory",
    question: "¿Qué paradigma de programación se caracteriza por ejecutar instrucciones paso a paso, como una receta?",
    options: ["Orientado a Objetos", "Funcional", "Imperativo", "Declarativo"],
    correct: 2,
    explanation: "El paradigma Imperativo describe CÓMO hacer las cosas, paso a paso. Es el más parecido a una receta de cocina.",
    timeLimit: 20,
    points: 100,
  },
  {
    id: 8,
    topic: "Python",
    type: "code",
    language: "python",
    question: "¿Cuál es el OUTPUT de este código?",
    code: `numeros = [5, 2, 8, 1, 9]
numeros.sort()
print(numeros[0])`,
    options: ["5", "9", "1", "2"],
    correct: 2,
    explanation: ".sort() ordena la lista de menor a mayor. Después del sort: [1,2,5,8,9]. El índice 0 es 1.",
    timeLimit: 25,
    points: 150,
  },

  // ── PARADIGMAS ──────────────────────────────────────────────────────────
  {
    id: 9,
    topic: "Paradigmas",
    type: "theory",
    question: "En Programación Orientada a Objetos, ¿cómo se llama el 'molde' que usás para crear objetos?",
    options: ["Función", "Módulo", "Clase", "Variable"],
    correct: 2,
    explanation: "La CLASE es el molde o plano. A partir de una clase creás múltiples objetos (instancias) con las mismas propiedades.",
    timeLimit: 20,
    points: 100,
  },
  {
    id: 10,
    topic: "Paradigmas",
    type: "theory",
    question: "En el paradigma Funcional, ¿qué característica tienen las funciones puras?",
    options: [
      "Modifican variables globales",
      "Siempre devuelven el mismo resultado para los mismos inputs",
      "Solo pueden recibir un argumento",
      "Deben usar bucles for",
    ],
    correct: 1,
    explanation: "Una función pura siempre da el mismo resultado si le das los mismos inputs, y no tiene efectos secundarios.",
    timeLimit: 25,
    points: 150,
  },
  {
    id: 11,
    topic: "Paradigmas",
    type: "code",
    language: "python",
    question: "Este código usa el paradigma...",
    code: `class Sensor:
    def __init__(self, nombre):
        self.nombre = nombre
    def leer(self):
        return f"{self.nombre}: activo"

s = Sensor("Temperatura")
print(s.leer())`,
    options: ["Imperativo", "Funcional", "Orientado a Objetos", "Declarativo"],
    correct: 2,
    explanation: "Usamos class, __init__, self y creamos una instancia (s). Eso es POO (Programación Orientada a Objetos).",
    timeLimit: 25,
    points: 150,
  },

  // ── ARDUINO ─────────────────────────────────────────────────────────────
  {
    id: 12,
    topic: "Arduino",
    type: "code",
    language: "arduino",
    question: "¿Qué hace este fragmento de código Arduino?",
    code: `void setup() {
  pinMode(13, OUTPUT);
}
void loop() {
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
}`,
    options: [
      "Lee un sensor cada 1 segundo",
      "Hace parpadear el LED del pin 13 cada 1 segundo",
      "Enciende el LED 13 para siempre",
      "Genera un error: falta Serial.begin()",
    ],
    correct: 1,
    explanation: "HIGH enciende el LED → espera 1s → LOW lo apaga → espera 1s → repite. ¡Es el clásico Blink!",
    timeLimit: 25,
    points: 150,
  },
  {
    id: 13,
    topic: "Arduino",
    type: "theory",
    question: "¿Para qué sirve la función setup() en Arduino?",
    options: [
      "Se ejecuta en bucle infinito",
      "Lee valores analógicos",
      "Se ejecuta UNA sola vez al iniciar el programa",
      "Configura la conexión WiFi",
    ],
    correct: 2,
    explanation: "setup() corre una sola vez al encender o resetear el Arduino. Ahí configurás pines, Serial, etc.",
    timeLimit: 20,
    points: 100,
  },
  {
    id: 14,
    topic: "Arduino",
    type: "theory",
    question: "¿Qué rango de valores devuelve analogRead() en Arduino UNO?",
    options: ["0 a 100", "0 a 255", "0 a 1023", "0 a 5"],
    correct: 2,
    explanation: "Arduino UNO tiene un ADC de 10 bits: 2^10 = 1024 valores posibles, de 0 a 1023.",
    timeLimit: 20,
    points: 100,
  },
  {
    id: 15,
    topic: "Arduino",
    type: "theory",
    question: "En PyFirmata, ¿qué biblioteca de Python usamos para controlar Arduino?",
    options: ["pygame", "pyfirmata", "pyserial directamente", "opencv"],
    correct: 1,
    explanation: "PyFirmata es la biblioteca que permite controlar un Arduino desde Python usando el protocolo Firmata.",
    timeLimit: 20,
    points: 100,
  },
  {
    id: 16,
    topic: "Arduino",
    type: "code",
    language: "python",
    question: "¿Qué hace este código con PyFirmata?",
    code: `import pyfirmata
board = pyfirmata.Arduino('/dev/ttyUSB0')
led = board.get_pin('d:13:o')
led.write(1)`,
    options: [
      "Lee el estado del pin 13",
      "Enciende el LED conectado al pin digital 13",
      "Configura el pin 13 como entrada analógica",
      "Genera un error de conexión",
    ],
    correct: 1,
    explanation: "'d:13:o' = pin Digital 13, modo Output. write(1) lo pone en HIGH → enciende el LED.",
    timeLimit: 30,
    points: 200,
  },

  // ── HTML / CSS ───────────────────────────────────────────────────────────
  {
    id: 17,
    topic: "HTML",
    type: "code",
    language: "html",
    question: "¿Qué etiqueta usamos para el título principal de una página?",
    code: `<!DOCTYPE html>
<html>
  <body>
    <___>Mi Proyecto Arduino</___ >
    <p>Descripción del sensor</p>
  </body>
</html>`,
    options: ["<title>", "<h1>", "<header>", "<main>"],
    correct: 1,
    explanation: "<h1> es el encabezado más importante (hay del h1 al h6). <title> es el nombre en la pestaña del navegador.",
    timeLimit: 20,
    points: 100,
  },
  {
    id: 18,
    topic: "CSS",
    type: "code",
    language: "css",
    question: "¿Qué hace este estilo CSS?",
    code: `h1 {
  color: red;
  font-size: 32px;
  text-align: center;
}`,
    options: [
      "Cambia el fondo de h1 a rojo",
      "Centra el h1, lo pone rojo y de 32px",
      "Solo cambia el color del texto",
      "Aplica a todos los elementos de la página",
    ],
    correct: 1,
    explanation: "Ese bloque CSS aplica 3 estilos al h1: color de texto rojo, tamaño 32px y alineado al centro.",
    timeLimit: 20,
    points: 100,
  },
  {
    id: 19,
    topic: "HTML",
    type: "theory",
    question: "¿Cuál es la diferencia entre <div> y <span>?",
    options: [
      "No hay diferencia, son sinónimos",
      "<div> es bloque (ocupa toda la línea), <span> es en línea",
      "<span> solo se usa para imágenes",
      "<div> es para CSS y <span> es para HTML",
    ],
    correct: 1,
    explanation: "<div> es un contenedor de bloque (rompe la línea). <span> es inline, no interrumpe el flujo del texto.",
    timeLimit: 25,
    points: 150,
  },
  {
    id: 20,
    topic: "Python",
    type: "code",
    language: "python",
    question: "¿Cuánto vale 'resultado' al final?",
    code: `def doble(n):
    return n * 2

numeros = [1, 2, 3, 4, 5]
resultado = list(map(doble, numeros))
print(resultado[2])`,
    options: ["3", "4", "6", "10"],
    correct: 2,
    explanation: "map() aplica doble() a cada elemento: [2,4,6,8,10]. El índice [2] es el tercer elemento: 6.",
    timeLimit: 30,
    points: 200,
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;
