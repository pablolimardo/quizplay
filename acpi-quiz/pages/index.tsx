// pages/index.tsx
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-8">
      {/* Logo */}
      <div className="text-center slide-up">
        <div className="text-7xl mb-4">🤖</div>
        <h1 className="text-5xl font-bold mb-2" style={{ color: "#a78bfa" }}>
          ACPI Quiz
        </h1>
        <p className="text-gray-400 text-lg">
          Taller de Programación · 3er Año · EI N°9
        </p>
      </div>

      {/* Cards */}
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
        {/* Jugador */}
        <button
          onClick={() => router.push("/play")}
          className="flex-1 rounded-2xl p-8 text-center transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #1a1030, #2d1f4e)",
            border: "2px solid #7c3aed",
          }}
        >
          <div className="text-5xl mb-3">🎮</div>
          <div className="text-2xl font-bold text-white mb-1">Jugar</div>
          <div className="text-sm text-gray-400">Soy alumno/a</div>
        </button>

        {/* Host */}
        <button
          onClick={() => router.push("/host")}
          className="flex-1 rounded-2xl p-8 text-center transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #1a1030, #1f2d30)",
            border: "2px solid #0ea5e9",
          }}
        >
          <div className="text-5xl mb-3">📡</div>
          <div className="text-2xl font-bold text-white mb-1">Host</div>
          <div className="text-sm text-gray-400">Soy el profe</div>
        </button>
      </div>

      <p className="text-gray-600 text-sm">
        Escuela Industrial N°9 &quot;15 de Noviembre&quot; · El Calafate
      </p>
    </div>
  );
}
