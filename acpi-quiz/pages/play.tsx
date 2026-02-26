// pages/play.tsx
import { useEffect, useState, useCallback, useRef } from "react";
import { GameState } from "../lib/gameState";
import { QUESTIONS } from "../lib/questions";

const OPTION_LETTERS = ["A", "B", "C", "D"];
const OPTION_COLORS = ["#3b82f6", "#a855f7", "#f59e0b", "#ec4899"];
const AVATARS = ["😎", "🦊", "🐉", "🤖", "🦁", "⚡", "🎯", "🔥"];

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="code-block font-mono text-sm my-3 text-left">
      {code.split("\n").map((line, i) => (
        <div key={i}>
          <span style={{ color: "#4a5568", userSelect: "none" }} className="mr-3 select-none">
            {String(i + 1).padStart(2, " ")}
          </span>
          <span style={{ color: "#e2e8f0" }}>{line}</span>
        </div>
      ))}
    </div>
  );
}

export default function PlayPage() {
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [state, setState] = useState<GameState | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerResult, setAnswerResult] = useState<null | {
    correct: boolean; points: number; correctAnswer: number; explanation: string; streak: number;
  }>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prevQRef = useRef(-1);

  const fetchState = useCallback(async () => {
    const r = await fetch("/api/state");
    const s: GameState = await r.json();
    setState(s);
    return s;
  }, []);

  // Auto-reconectar desde localStorage al cargar la página
  useEffect(() => {
    const saved = localStorage.getItem("acpi_player_name");
    if (saved) {
      // Verificar que el jugador siga existiendo en el estado del juego
      fetch("/api/state")
        .then(r => r.json())
        .then((s: GameState) => {
          if (s.players[saved.toLowerCase()]) {
            setPlayerName(saved);
            setJoined(true);
          } else {
            // El jugador ya no existe (se hizo reset), limpiar localStorage
            localStorage.removeItem("acpi_player_name");
          }
        })
        .catch(() => {
          // Si falla la verificación, intentar reconectar igual
          setPlayerName(saved);
          setJoined(true);
        });
    }
  }, []);

  // Poll
  useEffect(() => {
    if (!joined) return;
    fetchState();
    pollRef.current = setInterval(fetchState, 1500);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [joined, fetchState]);

  // Reset answer state when question changes
  useEffect(() => {
    if (!state) return;
    if (state.currentQuestion !== prevQRef.current) {
      prevQRef.current = state.currentQuestion;
      setSelectedAnswer(null);
      setAnswerResult(null);
    }
  }, [state?.currentQuestion]);

  // Timer
  useEffect(() => {
    if (!state || state.status !== "question") { setTimeLeft(0); return; }
    const qIdx = state.questionOrder[state.currentQuestion];
    const q = QUESTIONS[qIdx];
    const multiplier = state.timeMultiplier ?? 2;
    const totalTime = Math.round(q.timeLimit * multiplier);
    const elapsed = Math.floor((Date.now() - state.questionStartedAt) / 1000);
    const tl = Math.max(0, totalTime - elapsed);
    setTimeLeft(tl);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((p) => { if (p <= 1) { clearInterval(timerRef.current!); return 0; } return p - 1; });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [state?.status, state?.currentQuestion, state?.questionStartedAt, state?.timeMultiplier]);

  const handleJoin = async () => {
    if (name.trim().length < 2) { setError("Ingresá al menos 2 caracteres"); return; }
    setLoading(true);
    try {
      const r = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await r.json();
      if (!r.ok) { setError(data.error); return; }
      setPlayerName(data.name);
      localStorage.setItem("acpi_player_name", data.name);
      setJoined(true);
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (idx: number) => {
    if (selectedAnswer !== null || answerResult !== null || timeLeft === 0) return;
    setSelectedAnswer(idx);
    try {
      const r = await fetch("/api/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName, answerIndex: idx }),
      });
      const data = await r.json();
      if (r.ok) setAnswerResult(data);
    } catch {
      // silent
    }
  };

  const avatar = AVATARS[playerName.charCodeAt(0) % 8] ?? "🎮";
  const myScore = state?.players[playerName.toLowerCase()]?.score ?? 0;

  // ── JOIN SCREEN ──
  if (!joined) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-7xl mb-4">🎮</div>
            <h1 className="text-4xl font-bold" style={{ color: "#a78bfa" }}>ACPI Quiz</h1>
            <p className="text-gray-400 mt-2">Ingresá tu nombre para entrar</p>
          </div>
          <div className="rounded-2xl p-6" style={{ background: "#1a1030", border: "2px solid #2d1f4e" }}>
            <input
              type="text" maxLength={20}
              placeholder="Tu nombre o apodo"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              className="w-full p-4 rounded-xl text-center text-xl font-bold mb-4 bg-black/40 border border-gray-700 outline-none focus:border-purple-500 text-white"
            />
            {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
            <button onClick={handleJoin} disabled={loading || name.trim().length < 2}
              className="w-full py-4 rounded-xl font-bold text-xl transition-all hover:scale-105 disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
              {loading ? "Conectando..." : "¡Entrar al juego! →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!state) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-purple-400 animate-pulse text-xl">Conectando...</p>
    </div>
  );

  // ── WAITING ──
  if (state.status === "waiting") {
    const count = Object.keys(state.players).length;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="text-7xl mb-4" style={{ animation: "pulse-neon 2s infinite" }}>{avatar}</div>
        <h2 className="text-3xl font-bold mb-2">¡{playerName}, estás dentro!</h2>
        <p className="text-gray-400 mb-8">El profe va a arrancar el juego pronto...</p>
        <div className="rounded-2xl p-6 w-full max-w-xs" style={{ background: "#1a1030", border: "1px solid #2d1f4e" }}>
          <div className="text-5xl font-bold mb-1" style={{ color: "#a78bfa" }}>{count}</div>
          <div className="text-gray-400 text-sm">{count === 1 ? "jugador conectado" : "jugadores conectados"}</div>
        </div>
        <div className="mt-6 flex gap-2 items-center">
          <div className="w-2 h-2 rounded-full bg-green-400" style={{ animation: "pulse 1s infinite" }}></div>
          <span className="text-sm text-gray-500">Esperando al profe...</span>
        </div>
      </div>
    );
  }

  // ── QUESTION ──
  if (state.status === "question") {
    const qIdx = state.questionOrder[state.currentQuestion];
    const q = QUESTIONS[qIdx];
    const alreadyAnswered = selectedAnswer !== null || answerResult !== null;
    const actualTimeLimit = Math.round(q.timeLimit * (state.timeMultiplier ?? 2));
    const pct = Math.round((timeLeft / actualTimeLimit) * 100);
    const timerColor = timeLeft > actualTimeLimit * 0.5 ? "#22c55e" : timeLeft > actualTimeLimit * 0.2 ? "#f59e0b" : "#ef4444";

    return (
      <div className="min-h-screen flex flex-col p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">{avatar}</span>
            <div>
              <div className="text-sm font-bold">{playerName}</div>
              <div className="text-xs font-bold" style={{ color: "#a78bfa" }}>{myScore} pts</div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">
              {state.currentQuestion + 1} / {state.questionOrder.length}
            </div>
            <div className="text-3xl font-bold" style={{ color: timerColor }}>{timeLeft}s</div>
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: "#1f2937", color: "#60a5fa" }}>
            {q.topic}
          </div>
        </div>

        {/* Timer bar */}
        <div className="rounded-full h-2 mb-4 overflow-hidden" style={{ background: "#1a1030" }}>
          <div className="h-full rounded-full transition-all duration-500" style={{
            width: `${pct}%`, background: timerColor,
          }} />
        </div>

        {/* Question */}
        <div className="rounded-2xl p-4 mb-4 flex-shrink-0" style={{ background: "#1a1030", border: "1px solid #2d1f4e" }}>
          <p className="text-lg font-bold leading-snug">{q.question}</p>
          {q.code && <CodeBlock code={q.code} />}
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-3 flex-1">
          {q.options.map((opt, i) => {
            let extra = "";
            if (answerResult) {
              if (i === answerResult.correctAnswer) extra = "correct";
              else if (i === selectedAnswer && !answerResult.correct) extra = "wrong";
            } else if (selectedAnswer === i) extra = "selected";

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={alreadyAnswered || timeLeft === 0}
                className={`btn-option ${extra} flex items-center gap-3`}
              >
                <span className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
                  style={{ background: OPTION_COLORS[i], color: "white" }}>
                  {OPTION_LETTERS[i]}
                </span>
                <span className="font-mono">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Answer result */}
        {answerResult && (
          <div className="mt-4 rounded-xl p-4 pop-in" style={{
            background: answerResult.correct ? "#14532d" : "#7f1d1d",
            border: `2px solid ${answerResult.correct ? "#22c55e" : "#ef4444"}`,
          }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{answerResult.correct ? "🎉" : "😅"}</span>
              <div>
                <div className="font-bold text-lg">
                  {answerResult.correct ? `¡Correcto! +${answerResult.points} pts` : "Incorrecto"}
                </div>
                {answerResult.streak >= 3 && (
                  <div className="text-orange-400 text-sm">🔥 ¡Racha de {answerResult.streak}! Bonus activado</div>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-300">{answerResult.explanation}</p>
          </div>
        )}

        {alreadyAnswered && !answerResult && (
          <div className="mt-4 text-center text-gray-400 animate-pulse">
            ✅ Respuesta enviada · Esperando al profe...
          </div>
        )}

        {timeLeft === 0 && !alreadyAnswered && (
          <div className="mt-4 text-center" style={{ color: "#f59e0b" }}>
            ⏳ ¡Se acabó el tiempo!
          </div>
        )}
      </div>
    );
  }

  // ── ANSWER REVEAL ──
  if (state.status === "answer_reveal") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="text-5xl mb-3">{answerResult?.correct ?? false ? "🎉" : "👀"}</div>
        <h2 className="text-2xl font-bold mb-2">
          {answerResult?.correct ? "¡La clavaste!" : "Siguiendo aprendiendo..."}
        </h2>
        <p className="text-gray-400 mb-6">El profe está pasando a la siguiente pregunta</p>
        <div className="rounded-2xl p-6 w-full max-w-xs" style={{ background: "#1a1030", border: "1px solid #2d1f4e" }}>
          <div className="text-xs text-gray-500 mb-1">Tu puntaje</div>
          <div className="text-5xl font-bold" style={{ color: "#a78bfa" }}>{myScore}</div>
        </div>
        <div className="mt-6 animate-pulse text-gray-500 text-sm">Esperando siguiente pregunta...</div>
      </div>
    );
  }

  // ── LEADERBOARD / FINISHED ──
  if (state.status === "leaderboard" || state.status === "finished") {
    const sorted = Object.values(state.players).sort((a, b) => b.score - a.score);
    const myPos = sorted.findIndex(p => p.name.toLowerCase() === playerName.toLowerCase()) + 1;
    const medals = ["🥇", "🥈", "🥉"];

    return (
      <div className="min-h-screen flex flex-col items-center p-6">
        <div className="text-center mb-6">
          <div className="text-6xl mb-2 pop-in">🏆</div>
          <h1 className="text-4xl font-bold" style={{ color: "#f59e0b" }}>¡Resultados!</h1>
          <p className="text-gray-400">Tu posición: <strong style={{ color: "#a78bfa" }}>#{myPos}</strong></p>
        </div>

        <div className="w-full max-w-md space-y-3">
          {sorted.map((p, i) => {
            const isMe = p.name.toLowerCase() === playerName.toLowerCase();
            return (
              <div key={p.name} className="flex items-center gap-3 rounded-xl p-4 slide-up"
                style={{
                  background: isMe ? "#2d1f4e" : "#1a1030",
                  border: `2px solid ${isMe ? "#7c3aed" : "#2d1f4e"}`,
                  animationDelay: `${i * 0.08}s`,
                }}>
                <span className="text-2xl w-8 text-center">{medals[i] ?? `#${i + 1}`}</span>
                <span className="text-xl">{AVATARS[p.name.charCodeAt(0) % 8]}</span>
                <div className="flex-1">
                  <div className="font-bold">{p.name} {isMe && <span className="text-xs text-purple-400">(vos)</span>}</div>
                  <div className="text-xs text-gray-400">
                    {p.answers.filter(Boolean).length}/{p.answers.length} correctas
                  </div>
                </div>
                <div className="font-bold text-xl" style={{ color: i === 0 ? "#f59e0b" : "#a78bfa" }}>
                  {p.score}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-gray-500 text-sm text-center">
          {myPos === 1 ? "¡Ganaste! 🔥 Sos el crack del curso" :
           myPos <= 3 ? "¡Quedaste en el podio! Excelente 🎯" :
           "¡Buen intento! La próxima la rompés 💪"}
        </p>
      </div>
    );
  }

  return <div className="min-h-screen flex items-center justify-center text-gray-400">Conectando...</div>;
}
