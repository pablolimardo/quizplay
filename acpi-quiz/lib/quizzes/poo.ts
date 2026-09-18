// lib/quizzes/poo.ts
import { Question } from "../questions";

export const POO_QUESTIONS: Question[] = [
  {
    id: 1,
    topic: "POO Básica",
    type: "code",
    language: "python",
    question: "¿Qué imprime este código al ejecutarse?",
    code: `class Alumno:
    def __init__(self, nombre):
        self.nombre = nombre

    def saludar(self):
        print(f"Hola, soy {self.nombre}")

alumno1 = Alumno("Lucas")
alumno1.saludar()`,
    options: [
        "Hola, soy Lucas",
        "Hola, soy nombre",
        "Hola, soy self.nombre",
        "Lucas"
    ],
    correct: 0,
    explanation: "Al instanciar Alumno('Lucas'), el método __init__ guarda 'Lucas' en el atributo self.nombre. Al llamar a alumno1.saludar(), accede a ese atributo e imprime 'Hola, soy Lucas'.",
    timeLimit: 20,
    points: 100,
  },
  {
    id: 2,
    topic: "POO Básica",
    type: "code",
    language: "python",
    question: "¿Qué valor imprime en pantalla?",
    code: `class Contador:
    def __init__(self):
        self.valor = 0

    def incrementar(self):
        self.valor += 1

c = Contador()
c.incrementar()
c.incrementar()
print(c.valor)`,
    options: [
        "0",
        "1",
        "2",
        "3"
    ],
    correct: 2,
    explanation: "El atributo valor inicia en 0. Cada llamada al método incrementar() suma 1 a self.valor. Como se ejecuta dos veces, el resultado final es 2.",
    timeLimit: 20,
    points: 100,
  },
  {
    id: 3,
    topic: "POO Básica",
    type: "code",
    language: "python",
    question: "¿Qué se muestra en consola tras llamar al método?",
    code: `class Lampara:
    def __init__(self):
        self.encendida = False

    def encender(self):
        self.encendida = True

l = Lampara()
l.encender()
print(l.encendida)`,
    options: [
        "False",
        "True",
        "encendida",
        "None"
    ],
    correct: 1,
    explanation: "Inicialmente self.encendida es False. Al invocar el método l.encender(), el atributo cambia a True, y eso es lo que imprime el print.",
    timeLimit: 20,
    points: 100,
  },
  {
    id: 4,
    topic: "POO Básica",
    type: "code",
    language: "python",
    question: "¿Qué imprime este código al pasar un argumento al método?",
    code: `class Billetera:
    def __init__(self, saldo_inicial):
        self.saldo = saldo_inicial

    def cargar(self, monto):
        self.saldo += monto

mi_billetera = Billetera(500)
mi_billetera.cargar(200)
print(mi_billetera.saldo)`,
    options: [
        "500",
        "200",
        "700",
        "300"
    ],
    correct: 2,
    explanation: "La billetera arranca con saldo 500. El método cargar recibe el parámetro monto = 200 y se lo suma a self.saldo (500 + 200 = 700).",
    timeLimit: 25,
    points: 100,
  },
  {
    id: 5,
    topic: "POO Básica",
    type: "code",
    language: "python",
    question: "¿Qué imprime el print final? (prestá atención a las dos instancias)",
    code: `class Termometro:
    def __init__(self, temp):
        self.temp = temp

    def subir(self, grados):
        self.temp += grados

t1 = Termometro(20)
t2 = Termometro(15)
t1.subir(5)
print(t2.temp)`,
    options: [
        "25",
        "15",
        "20",
        "5"
    ],
    correct: 1,
    explanation: "Cada objeto tiene su propio estado en memoria independiente. Subir la temperatura en t1 modifica solo t1.temp (pasa a 25), mientras que t2.temp permanece intacto en 15.",
    timeLimit: 25,
    points: 150,
  },
  {
    id: 6,
    topic: "POO Básica",
    type: "code",
    language: "python",
    question: "¿Qué imprime este método que retorna un cálculo?",
    code: `class Rectangulo:
    def __init__(self, base, altura):
        self.base = base
        self.altura = altura

    def calcular_area(self):
        return self.base * self.altura

r = Rectangulo(4, 5)
print(r.calcular_area())`,
    options: [
        "9",
        "20",
        "4, 5",
        "None"
    ],
    correct: 1,
    explanation: "El método calcular_area multiplica los atributos self.base (4) por self.altura (5) y devuelve 20 con return, que es lo que imprime el print.",
    timeLimit: 20,
    points: 100,
  },
  {
    id: 7,
    topic: "POO Básica",
    type: "code",
    language: "python",
    question: "¿Cuál es la salida al invocar el método acelerar()?",
    code: `class Auto:
    def __init__(self, combustible):
        self.combustible = combustible

    def acelerar(self):
        if self.combustible >= 10:
            self.combustible -= 10
            print("Avanzando")
        else:
            print("Sin nafta")

auto = Auto(5)
auto.acelerar()`,
    options: [
        "Avanzando",
        "Sin nafta",
        "5",
        "-5"
    ],
    correct: 1,
    explanation: "El auto se crea con 5 de combustible. Al ejecutar acelerar(), la condición self.combustible >= 10 es falsa (5 >= 10 es False), por lo que entra al else e imprime 'Sin nafta'.",
    timeLimit: 25,
    points: 150,
  },
  {
    id: 8,
    topic: "POO Básica",
    type: "code",
    language: "python",
    question: "¿Qué imprime en consola el método estado()?",
    code: `class Robot:
    def __init__(self, nombre):
        self.nombre = nombre
        self.bateria = 100

    def trabajar(self):
        self.bateria -= 35

    def estado(self):
        print(f"{self.nombre}: {self.bateria}%")

bot = Robot("Titan")
bot.trabajar()
bot.estado()`,
    options: [
        "Titan: 100%",
        "Titan: 35%",
        "Titan: 65%",
        "Titan: 0%"
    ],
    correct: 2,
    explanation: "La batería comienza en 100. El método trabajar() le resta 35 (100 - 35 = 65). Luego estado() imprime 'Titan: 65%'.",
    timeLimit: 25,
    points: 150,
  },
  {
    id: 9,
    topic: "POO Básica",
    type: "code",
    language: "python",
    question: "¿Qué número imprime al consultar la longitud de la lista?",
    code: `class Carrito:
    def __init__(self):
        self.productos = []

    def agregar(self, item):
        self.productos.append(item)

c = Carrito()
c.agregar("Mouse")
c.agregar("Teclado")
print(len(c.productos))`,
    options: [
        "0",
        "1",
        "2",
        "['Mouse', 'Teclado']"
    ],
    correct: 2,
    explanation: "La lista self.productos arranca vacía. Con las dos llamadas al método agregar(), se insertan 'Mouse' y 'Teclado'. Por lo tanto len(c.productos) es 2.",
    timeLimit: 20,
    points: 100,
  },
  {
    id: 10,
    topic: "POO Básica",
    type: "code",
    language: "python",
    question: "¿Qué vida final tiene el personaje tras llamar a ambos métodos?",
    code: `class Personaje:
    def __init__(self, vida):
        self.vida = vida

    def recibir_danio(self, cantidad):
        self.vida -= cantidad

    def curar(self, cantidad):
        self.vida += cantidad

heroe = Personaje(100)
heroe.recibir_danio(40)
heroe.curar(15)
print(heroe.vida)`,
    options: [
        "60",
        "75",
        "115",
        "100"
    ],
    correct: 1,
    explanation: "Inicia con 100 de vida. heroe.recibir_danio(40) reduce la vida a 60 (100 - 40). Luego heroe.curar(15) le suma 15 (60 + 15 = 75).",
    timeLimit: 25,
    points: 150,
  },
];
