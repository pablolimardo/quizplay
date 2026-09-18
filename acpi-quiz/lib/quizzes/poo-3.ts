// lib/quizzes/poo-3.ts
import { Question } from "../questions";

export const POO_3_QUESTIONS: Question[] = [
  {
    id: 1,
    topic: "POO Compleja",
    type: "code",
    language: "python",
    question: "¿Qué imprime el estado del calefactor tras llamar a regular(21)?",
    code: `class Termostato:
    def __init__(self, temp_objetivo):
        self.temp_objetivo = temp_objetivo
        self.calefactor_encendido = False

    def regular(self, temp_actual):
        if self.debe_calentar(temp_actual):
            self.calefactor_encendido = True
        else:
            self.calefactor_encendido = False

    def debe_calentar(self, temp_actual):
        return temp_actual < self.temp_objetivo - 2

t = Termostato(22)
t.regular(21)
print(t.calefactor_encendido)`,
    options: [
      "False",
      "True",
      "20",
      "21"
    ],
    correct: 0,
    explanation: "self.temp_objetivo - 2 es 20. Al llamar con temp_actual = 21, la condición 21 < 20 es False. Por lo tanto debe_calentar() retorna False y el calefactor queda en False.",
    timeLimit: 30,
    points: 150,
  },
  {
    id: 2,
    topic: "POO Compleja",
    type: "code",
    language: "python",
    question: "¿Cuáles son los saldos finales de ambos usuarios tras las dos transferencias?",
    code: `class BilleteraVirtual:
    def __init__(self, usuario, saldo):
        self.usuario = usuario
        self.saldo = saldo

    def transferir(self, destino, monto):
        if self.saldo >= monto:
            self.saldo -= monto
            destino.saldo += monto
            return True
        return False

u1 = BilleteraVirtual("Nico", 500)
u2 = BilleteraVirtual("Mora", 300)
u1.transferir(u2, 200)
u2.transferir(u1, 100)
print(f"{u1.saldo}-{u2.saldo}")`,
    options: [
      "300-500",
      "400-400",
      "500-300",
      "200-600"
    ],
    correct: 1,
    explanation: "u1 transfiere 200 a u2 (u1 queda en 300 y u2 en 500). Luego u2 le transfiere 100 a u1 (u2 queda en 400 y u1 en 400). Por eso el formato final imprime '400-400'.",
    timeLimit: 30,
    points: 150,
  },
  {
    id: 3,
    topic: "POO Compleja",
    type: "code",
    language: "python",
    question: "¿Qué promedio de notas aprobadas (>= 6) calcula este método?",
    code: `class RegistroNotas:
    def __init__(self):
        self.notas = []

    def cargar(self, *calificaciones):
        for n in calificaciones:
            if n >= 1 and n <= 10:
                self.notas.append(n)

    def promedio_aprobadas(self):
        aprobadas = [n for n in self.notas if n >= 6]
        if not aprobadas:
            return 0
        return sum(aprobadas) // len(aprobadas)

r = RegistroNotas()
r.cargar(4, 8, 10, 2, 6)
print(r.promedio_aprobadas())`,
    options: [
      "6",
      "7",
      "8",
      "30"
    ],
    correct: 2,
    explanation: "Las notas cargadas son [4, 8, 10, 2, 6]. El filtro n >= 6 selecciona únicamente [8, 10, 6]. La suma es 24 y la longitud es 3. La división entera 24 // 3 devuelve 8.",
    timeLimit: 30,
    points: 150,
  },
  {
    id: 4,
    topic: "POO Compleja",
    type: "code",
    language: "python",
    question: "¿En qué color termina el semáforo tras avanzar 5 pasos cíclicos?",
    code: `class SemaforoInteligente:
    def __init__(self):
        self.fases = ["VERDE", "AMARILLO", "ROJO"]
        self.indice = 0

    def avanzar(self, pasos):
        self.indice = (self.indice + pasos) % len(self.fases)

    def estado_actual(self):
        return self.fases[self.indice]

s = SemaforoInteligente()
s.avanzar(5)
print(s.estado_actual())`,
    options: [
      "VERDE",
      "AMARILLO",
      "5",
      "ROJO"
    ],
    correct: 3,
    explanation: "El array tiene 3 elementos (índices 0, 1, 2). Avanzar 5 pasos calcula (0 + 5) % 3 = 2. El índice 2 corresponde a 'ROJO'.",
    timeLimit: 25,
    points: 150,
  },
  {
    id: 5,
    topic: "POO Compleja",
    type: "code",
    language: "python",
    question: "¿Cuál es el nivel final del tanque y el volumen de desborde?",
    code: `class TanqueAgua:
    def __init__(self, capacidad_maxima):
        self.max = capacidad_maxima
        self.nivel = 0

    def llenar(self, litros):
        if self.nivel + litros > self.max:
            sobrante = (self.nivel + litros) - self.max
            self.nivel = self.max
            return sobrante
        self.nivel += litros
        return 0

t = TanqueAgua(100)
t.llenar(70)
desborde = t.llenar(50)
print(f"Nivel: {t.nivel}, Desborde: {desborde}")`,
    options: [
      "Nivel: 100, Desborde: 20",
      "Nivel: 120, Desborde: 0",
      "Nivel: 70, Desborde: 50",
      "Nivel: 100, Desborde: 0"
    ],
    correct: 0,
    explanation: "Con el primer llenado llega a 70 litros. Al agregar 50 más, sumaría 120, superando el máximo de 100. El método topa el nivel en 100 y calcula el sobrante: 120 - 100 = 20.",
    timeLimit: 30,
    points: 150,
  },
  {
    id: 6,
    topic: "POO Compleja",
    type: "code",
    language: "python",
    question: "¿Qué imprime al consultar el atributo de clase compartido total_sensores?",
    code: `class SensorIoT:
    total_sensores = 0

    def __init__(self, id_sensor):
        self.id = id_sensor
        SensorIoT.total_sensores += 1

s1 = SensorIoT("S-01")
s2 = SensorIoT("S-02")
s3 = SensorIoT("S-03")
print(f"{s1.id} de {s2.total_sensores}")`,
    options: [
      "S-01 de 1",
      "S-01 de 3",
      "S-02 de 3",
      "S-03 de 0"
    ],
    correct: 1,
    explanation: "total_sensores es un atributo de clase compartido por todas las instancias. Como se crearon 3 sensores, su valor es 3. s1.id es 'S-01' y s2.total_sensores lee el valor global 3.",
    timeLimit: 25,
    points: 150,
  },
  {
    id: 7,
    topic: "POO Compleja",
    type: "code",
    language: "python",
    question: "¿Cuál es el texto final tras ejecutar las acciones y el método deshacer()?",
    code: `class EditorTexto:
    def __init__(self):
        self.historial = []

    def escribir(self, palabra):
        self.historial.append(palabra)

    def deshacer(self):
        if self.historial:
            self.historial.pop()

    def texto_final(self):
        return " ".join(self.historial)

ed = EditorTexto()
ed.escribir("Hola")
ed.escribir("Mundo")
ed.escribir("Python")
ed.deshacer()
ed.escribir("Tecnica")
print(ed.texto_final())`,
    options: [
      "Hola Mundo Python Tecnica",
      "Hola Tecnica",
      "Hola Mundo Tecnica",
      "Mundo Tecnica"
    ],
    correct: 2,
    explanation: "El método deshacer() elimina el último elemento con pop(), quitando 'Python'. Luego se agrega 'Tecnica', quedando la lista ['Hola', 'Mundo', 'Tecnica'].",
    timeLimit: 25,
    points: 150,
  },
  {
    id: 8,
    topic: "POO Compleja",
    type: "code",
    language: "python",
    question: "¿Qué porcentaje de carga le queda a la batería al final?",
    code: `class BateriaAuto:
    def __init__(self):
        self.carga = 100

    def encender_luces(self, minutos):
        consumo = minutos * 2
        self.carga = max(0, self.carga - consumo)

    def cargar_con_alternador(self, minutos):
        recarga = minutos * 3
        self.carga = min(100, self.carga + recarga)

b = BateriaAuto()
b.encender_luces(40)
b.cargar_con_alternador(10)
print(b.carga)`,
    options: [
      "20",
      "100",
      "30",
      "50"
    ],
    correct: 3,
    explanation: "Inicia en 100. encender_luces(40) consume 40 * 2 = 80 puntos (100 - 80 = 20). Luego cargar_con_alternador(10) recupera 10 * 3 = 30 puntos (20 + 30 = 50).",
    timeLimit: 30,
    points: 150,
  },
  {
    id: 9,
    topic: "POO Compleja",
    type: "code",
    language: "python",
    question: "¿Qué candidato resulta ganador según el diccionario interno de votos?",
    code: `class Votacion:
    def __init__(self):
        self.votos = {}

    def votar(self, candidato):
        if candidato in self.votos:
            self.votos[candidato] += 1
        else:
            self.votos[candidato] = 1

    def ganador(self):
        return max(self.votos, key=self.votos.get)

v = Votacion()
for c in ["Azul", "Rojo", "Azul", "Verde", "Rojo", "Rojo"]:
    v.votar(c)

print(v.ganador())`,
    options: [
      "Azul",
      "Rojo",
      "Verde",
      "3"
    ],
    correct: 1,
    explanation: "El método acumula votos en un diccionario: 'Azul' tiene 2, 'Verde' tiene 1 y 'Rojo' tiene 3. El método ganador() devuelve la clave con más votos: 'Rojo'.",
    timeLimit: 30,
    points: 150,
  },
  {
    id: 10,
    topic: "POO Compleja",
    type: "code",
    language: "python",
    question: "¿Qué valores de vida y escudo le quedan al luchador tras absorber el impacto?",
    code: `class Luchador:
    def __init__(self, nombre, vida, escudo):
        self.nombre = nombre
        self.vida = vida
        self.escudo = escudo

    def recibir_impacto(self, poder):
        danio_restante = max(0, poder - self.escudo)
        self.escudo = max(0, self.escudo - poder)
        self.vida -= danio_restante

p1 = Luchador("Thor", 100, 30)
p1.recibir_impacto(50)
print(f"Vida: {p1.vida}, Escudo: {p1.escudo}")`,
    options: [
      "Vida: 50, Escudo: 0",
      "Vida: 70, Escudo: 10",
      "Vida: 80, Escudo: 0",
      "Vida: 100, Escudo: -20"
    ],
    correct: 2,
    explanation: "El escudo absorbe 30 puntos de daño y queda en 0. Los 20 puntos de daño sobrantes (50 - 30) impactan directo en la vida: 100 - 20 = 80.",
    timeLimit: 30,
    points: 150,
  },
];
