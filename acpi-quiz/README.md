<p align="center">
  <img src="banner.png" alt="ACPI Quiz Banner" width="100%" />
</p>

<h1 align="center">🤖 ACPI Quiz</h1>
<h3 align="center">Plataforma de quiz en tiempo real para el aula</h3>

<p align="center">
  <strong>Taller de Programación · 3er Año · Escuela Industrial N°9</strong>
</p>

<p align="center">
  <a href="https://quizplayacpi.vercel.app/play">🎮 Jugar</a> · 
  <a href="https://quizplayacpi.vercel.app/host">📡 Panel del Profe</a> · 
  <a href="https://github.com/pablolimardo/quizplay">📂 Código fuente</a>
</p>

---

## 📖 ¿Qué es ACPI Quiz?

**ACPI Quiz** es una aplicación web que permite realizar **trivia en vivo** durante la clase, con contenido propio del Taller de Programación.

El profesor proyecta las preguntas en la pantalla del aula y los alumnos responden desde sus **notebooks**, usando la misma herramienta con la que programan. Todo es **en tiempo real**: las respuestas, el ranking y los puntajes se actualizan al instante.

### 🎯 Objetivo pedagógico

Transformar la evaluación y el repaso de contenidos en una experiencia **lúdica y motivadora**, donde los alumnos compiten sanamente mientras refuerzan lo aprendido en clase. La herramienta aprovecha las notebooks como **recurso pedagógico**, fomentando un uso responsable y productivo de la tecnología.

---

## ✨ Características principales

| Característica | Descripción |
|---|---|
| 🎮 **Quiz en tiempo real** | Los alumnos responden desde sus notebooks |
| 💻 **Sin instalación** | No requiere descargar nada, funciona directamente en el navegador |
| ⏱ **Tiempo configurable** | El profe elige la velocidad: Normal (1x), Doble (2x) o Triple (3x) |
| 🏆 **Ranking y puntaje** | Sistema de puntos con bonus por rapidez y rachas de aciertos |
| 🔄 **Preguntas inteligentes** | Las preguntas no se repiten entre rondas consecutivas |
| 💾 **Sesión persistente** | Si el alumno o el profe refresca la página, no pierde su sesión |
| 📊 **Estadísticas en vivo** | El profe ve cuántos respondieron, cuántos acertaron, etc. |
| 💡 **Explicaciones** | Después de cada pregunta, se muestra la respuesta correcta con explicación |

---

## 🎮 ¿Cómo se usa en clase?

### Paso 1 — El profe prepara el juego

1. Abre **[quizplayacpi.vercel.app/host](https://quizplayacpi.vercel.app/host)** en la computadora del aula
2. Ingresa el código de acceso
3. Configura el tiempo por pregunta (Normal, Doble o Triple)
4. Espera a que los alumnos se conecten

### Paso 2 — Los alumnos se unen

1. Abren **[quizplayacpi.vercel.app/play](https://quizplayacpi.vercel.app/play)** desde su notebook
2. Escriben su nombre o apodo
3. Aparecen en la pantalla del profe en tiempo real

### Paso 3 — ¡A jugar!

1. El profe presiona **"▶ Iniciar juego"**
2. Aparece la pregunta en todas las pantallas
3. Los alumnos eligen una opción antes de que se agote el tiempo
4. El profe presiona **"Ver respuesta"** → se muestra la correcta con explicación
5. Se pasa a la siguiente pregunta
6. Al final: **🏆 Ranking con los ganadores**

### Pantalla del profe (proyector):
> Se proyecta la pregunta con las opciones, un timer circular, y un mini-leaderboard con los puntajes en tiempo real.

### Pantalla del alumno (notebook):
> Ven la pregunta, las opciones como botones claros y accesibles, el tiempo restante, y su puntaje acumulado.

---

## 📚 Contenidos evaluados

La app incluye **20 preguntas** alineadas con la planificación del Taller de Programación 2026:

| Trimestre | Tema | Ejemplos de contenidos |
|-----------|------|------------------------|
| **1°** | 🧮 **Algoritmos** | Pseudocódigo, diagramas de flujo, concepto de algoritmo |
| **1°** | 🐍 **Python imperativo** | Variables, tipos de datos, `if/elif/else`, `for`, `while`, funciones |
| **1°** | 🧩 **Modularización** | Funciones con parámetros, responsabilidades claras |
| **2°** | λ **Paradigma funcional** | `map()`, `filter()`, `lambda`, recursión con condición de terminación |
| **2°** | 🔌 **ESP32 y sensores** | Señales analógicas vs digitales, DHT22, PyFirmata |
| **3°** | 🏗 **POO** | Clases, atributos, métodos, `__init__`, `self`, herencia, polimorfismo |
| **3°** | 🌡 **Proyecto integrador** | Sistema de climatización con ESP32 + DHT22 + relay |

> Las preguntas incluyen **fragmentos de código real** que los alumnos deben interpretar, y cada respuesta viene acompañada de una **explicación didáctica**. Varias preguntas están contextualizadas en el proyecto integrador del Sistema de Climatización.

---

## 🏅 Sistema de puntaje

El sistema de puntos está diseñado para premiar tanto el **conocimiento** como la **velocidad de respuesta**:

- **Puntos base**: Cada pregunta tiene un valor (100, 150 o 200 puntos según dificultad)
- **Bonus por velocidad**: Cuanto más rápido respondés correctamente, más puntos extras ganás
- **🔥 Bonus por racha**: Si acertás 3 o más preguntas seguidas, tus puntos se multiplican x1.5
- **Sin penalización**: Responder mal no resta puntos (los alumnos no tienen miedo de intentar)

---

## 🛠 Información técnica

> *Esta sección es para quienes quieran entender cómo funciona por dentro.*

| Componente | Tecnología |
|---|---|
| Frontend | Next.js + React + Tailwind CSS |
| Backend | API Routes de Next.js (serverless) |
| Base de datos | Upstash Redis (almacenamiento en tiempo real) |
| Hosting | Vercel (deploy automático desde GitHub) |
| Repositorio | [github.com/pablolimardo/quizplay](https://github.com/pablolimardo/quizplay) |

### Estructura del proyecto

```
acpi-quiz/
├── pages/
│   ├── index.tsx        → Página de inicio
│   ├── play.tsx         → Interfaz del alumno
│   ├── host.tsx         → Panel del profesor
│   └── api/
│       ├── state.ts     → Consulta del estado del juego
│       ├── join.ts      → Registro de alumnos
│       ├── host.ts      → Acciones del profesor
│       └── answer.ts    → Procesamiento de respuestas
├── lib/
│   ├── gameState.ts     → Modelo de datos del juego
│   ├── questions.ts     → Banco de preguntas
│   └── redis.ts         → Conexión a la base de datos
└── styles/
    └── globals.css      → Estilos visuales
```

---

## 👨‍💻 Autor

**Pablo Limardo** — Profesor del Taller de Programación  
Escuela Industrial N° 9 · ACPI · 3er Año · 2026

---

<p align="center">
  Hecho con 💜 para el aula
</p>
