# 🤖 ACPI Quiz — Guía de Despliegue

App de quiz en tiempo real para el Taller de Programación · 3er Año · EI N°9.

---

## ⚡ Despliegue en Vercel (15 minutos)

### Paso 1: Subir el código a GitHub

1. Creá un repositorio nuevo en [github.com](https://github.com)
2. Subí todos estos archivos al repositorio
3. (O usá `git init && git add . && git commit -m "first" && git remote add origin TU_REPO && git push`)

### Paso 2: Importar en Vercel

1. Entrá a [vercel.com](https://vercel.com) con tu cuenta
2. Hacé clic en **"Add New Project"**
3. Seleccioná el repositorio que acabás de crear
4. Dejá todo por defecto y hacé clic en **"Deploy"**

### Paso 3: Crear el KV Store (base de datos)

1. En el dashboard de tu proyecto en Vercel, andá a la pestaña **"Storage"**
2. Hacé clic en **"Create Database"** → elegí **"KV"**
3. Dale un nombre (por ej. `acpi-quiz-db`) y confirmá
4. Vercel va a conectar automáticamente las variables de entorno al proyecto

### Paso 4: ¡Listo!

Tu app va a estar disponible en: `https://nombre-del-proyecto.vercel.app`

---

## 🎮 Cómo usar en clase

### En el proyector (vos):
- Abrí `/host`
- Ingresá el código: `acpi2026`
- Presioná **"Preparar juego"**

### En las notebooks (alumnos):
- Abren `/play`
- Ingresan su nombre
- ¡A jugar!

### Flujo del juego:
1. Esperás que todos entren (se ven las fichas en el dashboard)
2. Presionás **"Iniciar juego"**
3. Aparece la pregunta → los alumnos responden contra el reloj
4. Presionás **"Ver respuesta"** → se muestra la respuesta correcta y la explicación
5. Presionás **"Siguiente"** y así sucesivamente
6. Al final, aparece el leaderboard con el ranking

---

## 📝 Temas cubiertos (20 preguntas)

- **Python**: tipos de datos, funciones, loops, listas, map(), slice
- **Paradigmas**: Imperativo, Funcional, POO
- **Arduino**: setup/loop, digitalWrite, analogRead, Blink
- **PyFirmata**: conexión Python ↔ Arduino
- **HTML**: estructura, etiquetas semánticas
- **CSS**: selectores, propiedades básicas

---

## 🔧 Cambiar el código de acceso

En Vercel → Settings → Environment Variables → agrega `HOST_CODE` con el valor que quieras.

---

## 🎨 Personalización

Para agregar preguntas, editá el archivo `lib/questions.ts`.
