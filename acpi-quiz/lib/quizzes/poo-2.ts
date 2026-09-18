// lib/quizzes/poo-2.ts
import { Question } from "../questions";

export const POO_2_QUESTIONS: Question[] = [
  {
    id: 1,
    topic: "POO Básica 2",
    type: "code",
    language: "python",
    question: "¿Qué valor imprime en pantalla tras preparar dos cafés?",
    code: `class Cafetera:
    def __init__(self, capacidad):
        self.agua = capacidad

    def preparar_cafe(self):
        self.agua -= 50

c = Cafetera(200)
c.preparar_cafe()
c.preparar_cafe()
print(c.agua)`,
    options: [
        "150",
        "100",
        "200",
        "50"
    ],
    correct: 1,
    explanation: "La cafetera arranca con 200 de agua. Cada llamada a preparar_cafe() descuenta 50 de self.agua. Al ejecutarse 2 veces (200 - 50 - 50), el agua restante es 100.",
    timeLimit: 20,
    points: 100,
  },
  {
    id: 2,
    topic: "POO Básica 2",
    type: "code",
    language: "python",
    question: "¿Qué velocidad final tiene el ventilador?",
    code: `class Ventilador:
    def __init__(self):
        self.velocidad = 0

    def aumentar(self):
        if self.velocidad < 3:
            self.velocidad += 1

v = Ventilador()
v.aumentar()
v.aumentar()
v.aumentar()
v.aumentar()
print(v.velocidad)`,
    options: [
        "4",
        "3",
        "0",
        "Error"
    ],
    correct: 1,
    explanation: "El método aumentar() suma 1 solo si self.velocidad < 3. Tras las primeras 3 llamadas la velocidad llega a 3. En la 4ta llamada la condición 3 < 3 es falsa, por lo que no suma y se queda en 3.",
    timeLimit: 25,
    points: 150,
  },
  {
    id: 3,
    topic: "POO Básica 2",
    type: "code",
    language: "python",
    question: "¿Qué mensaje devuelve e imprime el método retirar()?",
    code: `class Cuenta:
    def __init__(self, titular, saldo):
        self.titular = titular
        self.saldo = saldo

    def retirar(self, monto):
        if monto <= self.saldo:
            self.saldo -= monto
            return "Retiro exitoso"
        return "Fondos insuficientes"

cta = Cuenta("Ana", 1000)
print(cta.retirar(1200))`,
    options: [
        "Retiro exitoso",
        "Fondos insuficientes",
        "-200",
        "None"
    ],
    correct: 1,
    explanation: "La cuenta tiene saldo 1000. Al intentar retirar 1200, la condición monto <= self.saldo (1200 <= 1000) es False, por lo que salta directo al return 'Fondos insuficientes'.",
    timeLimit: 25,
    points: 100,
  },
  {
    id: 4,
    topic: "POO Básica 2",
    type: "code",
    language: "python",
    question: "¿A qué color pasa el semáforo al invocar cambiar()?",
    code: `class Semaforo:
    def __init__(self):
        self.color = "Rojo"

    def cambiar(self):
        if self.color == "Rojo":
            self.color = "Verde"
        elif self.color == "Verde":
            self.color = "Amarillo"

s = Semaforo()
s.cambiar()
print(s.color)`,
    options: [
        "Verde",
        "Amarillo",
        "Rojo",
        "None"
    ],
    correct: 0,
    explanation: "Inicialmente self.color es 'Rojo'. El if evalúa si self.color == 'Rojo' (True), cambia self.color a 'Verde' y finaliza la estructura condicional.",
    timeLimit: 20,
    points: 100,
  },
  {
    id: 5,
    topic: "POO Básica 2",
    type: "code",
    language: "python",
    question: "¿Qué imprime la comparación entre ambos jugadores?",
    code: `class Jugador:
    def __init__(self, nombre, puntos):
        self.nombre = nombre
        self.puntos = puntos

    def ganar_puntos(self, cantidad):
        self.puntos += cantidad

j1 = Jugador("Marcos", 10)
j2 = Jugador("Sofia", 20)
j1.ganar_puntos(15)
print(j1.puntos > j2.puntos)`,
    options: [
        "False",
        "True",
        "25",
        "20"
    ],
    correct: 1,
    explanation: "j1 arranca con 10 y suma 15 (10 + 15 = 25). j2 mantiene sus 20 puntos. Como 25 > 20 es verdadero, el print imprime True.",
    timeLimit: 25,
    points: 150,
  },
  {
    id: 6,
    topic: "POO Básica 2",
    type: "code",
    language: "python",
    question: "¿Qué valor tiene el temporizador tras reiniciar?",
    code: `class Temporizador:
    def __init__(self, segundos):
        self.segundos = segundos

    def reiniciar(self):
        self.segundos = 0

t = Temporizador(120)
t.reiniciar()
print(t.segundos)`,
    options: [
        "120",
        "0",
        "60",
        "None"
    ],
    correct: 1,
    explanation: "El método reiniciar() asigna directamente 0 al atributo self.segundos, pisando el valor anterior de 120.",
    timeLimit: 15,
    points: 100,
  },
  {
    id: 7,
    topic: "POO Básica 2",
    type: "code",
    language: "python",
    question: "¿Qué imprime el método es_critico()?",
    code: `class Sensor:
    def __init__(self, tipo):
        self.tipo = tipo
        self.lectura = 0

    def actualizar(self, valor):
        self.lectura = valor

    def es_critico(self):
        return self.lectura > 75

s = Sensor("Caldera")
s.actualizar(80)
print(s.es_critico())`,
    options: [
        "False",
        "True",
        "80",
        "Caldera"
    ],
    correct: 1,
    explanation: "s.actualizar(80) guarda 80 en self.lectura. Al llamar a s.es_critico(), evalúa 80 > 75, que resulta True y se devuelve con return.",
    timeLimit: 20,
    points: 100,
  },
  {
    id: 8,
    topic: "POO Básica 2",
    type: "code",
    language: "python",
    question: "¿Se abre la puerta con la clave ingresada?",
    code: `class PuertaSegura:
    def __init__(self, clave_correcta):
        self.clave = clave_correcta
        self.abierta = False

    def ingresar_clave(self, intento):
        if intento == self.clave:
            self.abierta = True

p = PuertaSegura(1234)
p.ingresar_clave(9999)
print(p.abierta)`,
    options: [
        "True",
        "False",
        "1234",
        "Error: clave incorrecta"
    ],
    correct: 1,
    explanation: "La clave correcta guardada en __init__ es 1234. Al llamar p.ingresar_clave(9999), el if (9999 == 1234) es False, por lo que self.abierta nunca cambia a True y permanece en False.",
    timeLimit: 20,
    points: 100,
  },
  {
    id: 9,
    topic: "POO Básica 2",
    type: "code",
    language: "python",
    question: "¿Qué elemento de la lista imprime el print?",
    code: `class Libreta:
    def __init__(self):
        self.notas = []

    def anotar(self, texto):
        self.notas.append(texto)

lib = Libreta()
lib.anotar("Comprar cable")
lib.anotar("Revisar placa")
print(lib.notas[0])`,
    options: [
        "Revisar placa",
        "Comprar cable",
        "['Comprar cable', 'Revisar placa']",
        "1"
    ],
    correct: 1,
    explanation: "La lista contiene ['Comprar cable', 'Revisar placa']. El índice [0] accede al primer elemento de la lista agregada con self.notas.append(), que es 'Comprar cable'.",
    timeLimit: 20,
    points: 100,
  },
  {
    id: 10,
    topic: "POO Básica 2",
    type: "code",
    language: "python",
    question: "¿Qué resultado acumulado imprime la calculadora?",
    code: `class Calculadora:
    def __init__(self):
        self.total = 0

    def sumar(self, n):
        self.total += n

    def multiplicar(self, n):
        self.total *= n

calc = Calculadora()
calc.sumar(5)
calc.multiplicar(3)
calc.sumar(2)
print(calc.total)`,
    options: [
        "17",
        "15",
        "25",
        "10"
    ],
    correct: 0,
    explanation: "El total arranca en 0. calc.sumar(5) lo lleva a 5. calc.multiplicar(3) hace 5 * 3 = 15. Finalmente calc.sumar(2) hace 15 + 2 = 17.",
    timeLimit: 25,
    points: 150,
  },
];
