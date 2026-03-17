// pages/host.tsx
import { useEffect, useState, useCallback, useRef } from "react";
import { GameState } from "../lib/gameState";
import { getQuestionsByQuizId, QUIZ_LIST, QuizDefinition } from "../lib/quizzes";
import { Question } from "../lib/questions";

const HOST_CODE = "acpi2026";

function CodeBlock({ code, language }: { code: string; language?: string }) {
  return (
    <div className="code-block font-mono text-sm my-3">
      {code.split("\n").map((line, i) => (
        <div key={i}>
          <span style={{ color: "#4a5568", userSelect: "none" }} className="mr-4">
            {String(i + 1).padStart(2, " ")}
          </span>
          <span style={{ color: "#e2e8f0" }}>{line}</span>
        </div>
      ))}
    </div>
  );
}

function CircularTimer({ timeLeft, total }: { timeLeft: number; total: number }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const progress = timeLeft / total;
  const offset = circ * (1 - progress);
  const color = timeLeft > total * 0.5 ? "#22c55e" : timeLeft > total * 0.2 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative flex items-center justify-center" style={{ width: 100, height: 100 }}>
      <svg width="100" height="100" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="50" cy="50" r={r} fill="none" stroke="#1a1030" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.5s linear, stroke 0.3s" }}
        />
      </svg>
      <span className="absolute text-2xl font-bold" style={{ color }}>{timeLeft}</span>
    </div>
  );
}

/** Genera y descarga un CSV con los resultados de los alumnos */
async function downloadResultsCSV(state: GameState) {
  const quizId = state.selectedQuiz || "programacion";
  
  // Extraer las preguntas del backend de manera dinámica
  const res = await fetch(`/api/admin/quizzes/${quizId}`);
  const data = await res.json();
  const questions = data.questions || [];

  const players = Object.values(state.players).sort((a, b) => b.score - a.score);
  const questionCount = state.questionOrder.length;

  // Encabezados
  const headers = [
    "Posición",
    "Alumno",
    "Puntaje",
    "Correctas",
    "Incorrectas",
    "Sin responder",
    "Total preguntas",
    "Precisión (%)",
    ...state.questionOrder.map((qIdx, i) => {
      const q = questions[qIdx];
      return `P${i + 1} - ${q ? q.topic : "Desconocido"}`;
    }),
  ];

  // Filas
  const rows = players.map((p, rank) => {
    const correctas = p.answers.filter(a => a === true).length;
    const incorrectas = p.answers.filter(a => a === false).length;
    const sinResponder = questionCount - p.answers.length;
    const precision = questionCount > 0 ? Math.round((correctas / questionCount) * 100) : 0;

    const perQuestion = state.questionOrder.map((_, i) => {
      if (i >= p.answers.length) return "—";
      if (p.answers[i] === true) return "✓";
      if (p.answers[i] === false) return "✗";
      return "—";
    });

    return [
      rank + 1,
      p.name,
      p.score,
      correctas,
      incorrectas,
      sinResponder,
      questionCount,
      precision,
      ...perQuestion,
    ];
  });

  // BOM para que Excel reconozca UTF-8
  const BOM = "\uFEFF";
  const csv = BOM + [headers, ...rows].map(row =>
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")
  ).join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const fecha = new Date().toISOString().slice(0, 10);
  const quizName = (state.selectedQuiz || "programacion").replace(/[^a-zA-Z0-9-]/g, "_");
  a.href = url;
  a.download = `Quiz_${quizName}_Resultados_${fecha}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function HostPage() {
  const [state, setState] = useState<GameState | null>(null);
  const [authCode, setAuthCode] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [fetchError, setFetchError] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // Obtener nombre del quiz seleccionado actual
  const selectedQuizId = state?.selectedQuiz || "programacion";
  const [allQuizzes, setAllQuizzes] = useState(QUIZ_LIST);
  const activeQuizDef = allQuizzes.find((q: any) => q.id === selectedQuizId) ?? allQuizzes[0];
  
  useEffect(() => {
    fetch("/api/admin/quizzes").then(res => res.json()).then(data => {
      setAllQuizzes([...data.static, ...data.custom]);
    }).catch(e => console.error(e));
  }, []);

  // Auto-reconectar sesión del profe desde localStorage
  useEffect(() => {
    if (localStorage.getItem("acpi_host_authed") === "true") {
      setAuthed(true);
    }
  }, []);

  const fetchState = useCallback(async () => {
    try {
      const r = await fetch("/api/state");
      if (!r.ok) throw new Error(`Error ${r.status}`);
      const s: GameState = await r.json();
      setState(s);
      setFetchError("");
      return s;
    } catch (err: any) {
      setFetchError(err?.message || "Error de conexión");
      return null;
    }
  }, []);

  const hostAction = useCallback(async (action: string, extra?: Record<string, unknown>) => {
    setLoading(true);
    try {
      const r = await fetch("/api/host", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, code: HOST_CODE, ...extra }),
      });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        throw new Error(d.error || `Error ${r.status}`);
      }
      const s: GameState = await r.json();
      setState(s);
      setFetchError("");
    } catch (err: any) {
      setFetchError(err?.message || "Error");
      setTimeout(() => setFetchError(""), 4000); // limpiar error después de un rato
    } finally {
      setLoading(false);
    }
  }, []);

  // Polling
  useEffect(() => {
    if (!authed) return;
    fetchState();
    pollRef.current = setInterval(fetchState, 2000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [authed, fetchState]);

  // Timer local
  useEffect(() => {
    if (!state || state.status !== "question") { setTimeLeft(0); return; }
    const q = (state as any).questionData;
    if (!q) return;
    const multiplier = state.timeMultiplier ?? 2;
    const totalTime = Math.round(q.timeLimit * multiplier);
    const elapsed = Math.floor((Date.now() - state.questionStartedAt) / 1000);
    setTimeLeft(Math.max(0, totalTime - elapsed));

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [state?.status, state?.currentQuestion, state?.questionStartedAt, state?.timeMultiplier]);

  // ── LOGIN ──
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="rounded-2xl p-10 w-full max-w-sm text-center"
          style={{ background: "#1a1030", border: "2px solid #2d1f4e" }}>
          <div className="text-5xl mb-4">📡</div>
          <h2 className="text-2xl font-bold mb-6">Panel del Profe</h2>
          <input
            type="password"
            placeholder="Código de acceso"
            value={authCode}
            onChange={(e) => setAuthCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && authCode === HOST_CODE && (() => { setAuthed(true); localStorage.setItem("acpi_host_authed", "true"); })()}
            className="w-full p-3 rounded-xl mb-4 text-center font-mono bg-black/40 border border-gray-700 outline-none focus:border-purple-500 text-white"
          />
          <button
            onClick={() => authCode === HOST_CODE ? (() => { setAuthed(true); localStorage.setItem("acpi_host_authed", "true"); })() : alert("Código incorrecto")}
            className="w-full py-3 rounded-xl font-bold text-white"
            style={{ background: "#7c3aed" }}
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  if (!state) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {fetchError ? (
          <>
            <div className="text-5xl mb-4">⚠️</div>
            <div className="text-red-400 text-xl font-bold mb-2">Error de conexión</div>
            <div className="text-gray-400 text-sm mb-4">{fetchError}</div>
            <button onClick={() => fetchState()}
              className="py-2 px-6 rounded-xl font-bold text-white"
              style={{ background: "#7c3aed" }}>
              🔄 Reintentar
            </button>
          </>
        ) : (
          <div className="text-purple-400 text-xl animate-pulse">Cargando...</div>
        )}
      </div>
    </div>
  );

  const players = Object.values(state.players).sort((a, b) => b.score - a.score);
  const answeredCount = state.status === "question"
    ? Object.values(state.players).filter(p => p.answers.length > state.currentQuestion).length
    : 0;

  const currentQ = (state as any).questionData || null;

  const OPTION_LETTERS = ["A", "B", "C", "D"];
  const OPTION_COLORS = ["#3b82f6", "#a855f7", "#f59e0b", "#ec4899"];

  // Helper: determinar estado de presencia visual
  const getPresenceInfo = (p: { presence?: string; lastPresenceUpdate?: number }) => {
    const now = Date.now();
    const lastUpdate = p.lastPresenceUpdate ?? 0;
    const isStale = now - lastUpdate > 15000; // más de 15s sin heartbeat

    if (isStale || !p.presence) {
      return { color: "#6b7280", label: "Desconectado", dot: "gray" };
    }
    if (p.presence === "active") {
      return { color: "#22c55e", label: "En línea", dot: "green" };
    }
    return { color: "#f59e0b", label: "En otra pestaña", dot: "orange" };
  };

  // ── WAITING ──
  if (state.status === "waiting") {
    const activePlayers = players.filter(p => {
      const info = getPresenceInfo(p);
      return info.dot === "green";
    }).length;
    const awayPlayers = players.filter(p => {
      const info = getPresenceInfo(p);
      return info.dot === "orange";
    }).length;

    return (
      <div className="min-h-screen p-8 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold" style={{ color: "#a78bfa" }}>🤖 ACPI Quiz</h1>
            <p className="text-gray-400 mt-1">
              {activeQuizDef.emoji} {activeQuizDef.name} · {players.length} jugadores conectados
            </p>
            {players.length > 0 && (
              <div className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1 text-sm">
                  <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: "#22c55e" }} />
                  <span style={{ color: "#22c55e" }}>{activePlayers} atentos</span>
                </span>
                {awayPlayers > 0 && (
                  <span className="flex items-center gap-1 text-sm">
                    <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: "#f59e0b" }} />
                    <span style={{ color: "#f59e0b" }}>{awayPlayers} distraídos</span>
                  </span>
                )}
              </div>
            )}
          </div>
          {players.length > 0 ? (
            <button onClick={() => {
              if (activeQuizDef?.questions?.length === 0) {
                alert("¡Error! Este cuestionario no tiene preguntas generadas."); return;
              }
              hostAction("start_question");
            }} disabled={loading || activeQuizDef?.questions?.length === 0}
              className="py-3 px-8 rounded-xl font-bold text-xl transition-all hover:scale-105 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}>
              ▶ Iniciar juego
            </button>
          ) : (
            <button onClick={() => hostAction("reset")} disabled={loading}
              className="py-3 px-8 rounded-xl font-bold text-xl transition-all hover:scale-105 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
              ⚙ Preparar juego
            </button>
          )}
        </div>

        {/* Players grid */}
        <div className="flex-1">
          {players.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-600">
              <div className="text-6xl mb-4">👋</div>
              <p className="text-2xl">Esperando jugadores...</p>
              <p className="text-lg mt-2">Los alumnos ingresan a <span className="text-purple-400 font-mono">quizplayacpi.vercel.app/play</span></p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {players.map((p) => {
                const presence = getPresenceInfo(p);
                return (
                  <div key={p.name} className="pop-in rounded-xl p-3 text-center relative"
                    style={{
                      background: "#1a1030",
                      border: `1px solid ${presence.dot === "orange" ? "#f59e0b55" : presence.dot === "green" ? "#22c55e33" : "#2d1f4e"}`,
                    }}>
                    {/* Indicador de presencia */}
                    <div className="absolute top-2 right-2 flex items-center gap-1" title={presence.label}>
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full"
                        style={{
                          background: presence.color,
                          boxShadow: presence.dot === "green" ? `0 0 6px ${presence.color}` : "none",
                          animation: presence.dot === "green" ? "pulse-presence 2s infinite" : "none",
                        }}
                      />
                    </div>
                    <div className="text-2xl mb-1">
                      {["😎", "🦊", "🐉", "🤖", "🦁", "⚡", "🎯", "🔥"][p.name.charCodeAt(0) % 8]}
                    </div>
                    <div className="text-sm font-medium truncate">{p.name}</div>
                    <div className="text-xs mt-1" style={{ color: presence.color }}>
                      {presence.label}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selector de Quiz */}
        <div className="mt-6 rounded-2xl p-5" style={{ background: "#1a1030", border: "1px solid #2d1f4e" }}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-lg">📚 Seleccionar Quiz</h3>
              <p className="text-gray-500 text-sm">Elegí el cuestionario para jugar esta ronda.</p>
            </div>
            <button 
              onClick={() => window.open("/host/crud", "_blank")}
              className="bg-purple-900 border border-purple-600 hover:bg-purple-800 text-purple-200 px-4 py-2 rounded-xl text-sm font-bold transition">
              🛠️ Gestionar (CRUD y AI)
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {allQuizzes.map((quiz: any) => {
              const isActive = selectedQuizId === quiz.id;
              return (
                <button
                  key={quiz.id}
                  onClick={() => hostAction("select_quiz", { quizId: quiz.id })}
                  disabled={loading}
                  className="rounded-xl p-4 text-left transition-all hover:scale-[1.03] disabled:opacity-50"
                  style={{
                    background: isActive
                      ? "linear-gradient(135deg, #2d1f4e, #1a1030)"
                      : "#0d0b1a",
                    border: isActive
                      ? "2px solid #a78bfa"
                      : "2px solid #2d1f4e",
                    boxShadow: isActive
                      ? "0 0 20px rgba(167, 139, 250, 0.2)"
                      : "none",
                  }}
                >
                  <div className="text-2xl mb-2">{quiz.emoji}</div>
                  <div className="font-bold text-sm mb-1" style={{ color: isActive ? "#a78bfa" : "#e2e8f0" }}>
                    {quiz.name}
                  </div>
                  <div className="text-xs text-gray-500 leading-snug">{quiz.description}</div>
                  <div className="text-xs mt-2 font-mono" style={{ color: isActive ? "#22c55e" : "#6b7280" }}>
                    {quiz.questions.length} preguntas
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Configuración de tiempo */}
        <div className="mt-4 rounded-2xl p-5" style={{ background: "#1a1030", border: "1px solid #2d1f4e" }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">⏱ Tiempo por pregunta</h3>
              <p className="text-gray-500 text-sm">Multiplicador sobre el tiempo base de cada pregunta</p>
            </div>
            <div className="flex gap-2">
              {[
                { label: "Normal", value: 1 },
                { label: "Doble", value: 2 },
                { label: "Triple", value: 3 },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => hostAction("set_time", { multiplier: opt.value })}
                  className="py-2 px-4 rounded-lg font-bold text-sm transition-all hover:scale-105"
                  style={{
                    background: (state.timeMultiplier ?? 2) === opt.value
                      ? "linear-gradient(135deg, #7c3aed, #a855f7)"
                      : "#0d0b1a",
                    border: (state.timeMultiplier ?? 2) === opt.value
                      ? "2px solid #a78bfa"
                      : "2px solid #2d1f4e",
                    color: (state.timeMultiplier ?? 2) === opt.value ? "white" : "#9ca3af",
                  }}
                >
                  {opt.label} ({opt.value}x)
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── ERROR RECOVERY (Vacío) ──
  if (state.status === "question" && !currentQ) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col text-center p-8 bg-[#0f0e17]">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-3xl font-bold mb-3 text-red-500">Cuestionario Vacío o Roto</h1>
        <p className="text-gray-400 mb-8 max-w-lg">
          La partida está trabada porque intentó leer una pregunta pero el Cuestionario seleccionado ("{activeQuizDef?.name}") no tiene preguntas válidas o fue borrado.
        </p>
        <button onClick={() => hostAction("reset")} className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all hover:scale-105 shadow-lg shadow-purple-500/50">
          ⚙️ Restablecer a Preparación
        </button>
      </div>
    );
  }

  // ── QUESTION ──
  if (state.status === "question" && currentQ) {
    return (
      <div className="min-h-screen p-8 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="px-4 py-2 rounded-full text-sm font-bold" style={{ background: "#2d1f4e", color: "#a78bfa" }}>
              Pregunta {state.currentQuestion + 1} / {state.questionOrder.length}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: "#1f2937", color: "#60a5fa" }}>
              {currentQ.topic}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-3xl font-bold" style={{ color: "#a78bfa" }}>{answeredCount}</div>
              <div className="text-xs text-gray-500">respondieron</div>
            </div>
            <CircularTimer timeLeft={timeLeft} total={Math.round(currentQ.timeLimit * (state.timeMultiplier ?? 2))} />
            <button onClick={() => hostAction("reveal")} disabled={loading}
              className="py-2 px-6 rounded-xl font-bold transition-all hover:scale-105 disabled:opacity-50"
              style={{ background: "#0ea5e9" }}>
              Ver respuesta
            </button>
          </div>
        </div>

        {/* Question */}
        <div className="rounded-2xl p-6 mb-6 flex-1" style={{ background: "#1a1030", border: "1px solid #2d1f4e" }}>
          <h2 className="text-3xl font-bold mb-2">{currentQ.question}</h2>
          {currentQ.code && <CodeBlock code={currentQ.code} language={currentQ.language} />}

          <div className="grid grid-cols-2 gap-4 mt-6">
            {(() => {
              const optionShuffle = state.optionShuffles?.[state.currentQuestion];
              const displayOrder = optionShuffle ?? currentQ.options.map((_: string, i: number) => i);
              return displayOrder.map((originalIdx: number, displayIdx: number) => (
                <div key={displayIdx} className="rounded-xl p-4 flex items-center gap-3"
                  style={{ background: OPTION_COLORS[displayIdx] + "22", border: `2px solid ${OPTION_COLORS[displayIdx]}55` }}>
                  <span className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0"
                    style={{ background: OPTION_COLORS[displayIdx], color: "white" }}>
                    {OPTION_LETTERS[displayIdx]}
                  </span>
                  <span className="font-mono text-lg">{currentQ.options[originalIdx]}</span>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Monitoreo de Alumnos */}
        <div className="mt-auto">
          <div className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Monitoreo del Aula</div>
          <div className="flex flex-wrap gap-2">
            {players.map((p) => {
              const presence = getPresenceInfo(p);
              const hasAnswered = p.answers.length > state.currentQuestion;
              return (
                <div key={p.name} className="flex items-center gap-2 rounded-lg px-3 py-2 transition-all"
                  style={{
                    background: hasAnswered ? "#14532d" : "#1a1030",
                    border: `1px solid ${hasAnswered ? "#22c55e" : "#2d1f4e"}`,
                    opacity: presence.dot === "gray" ? 0.5 : 1
                  }}>
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      background: presence.color,
                      boxShadow: presence.dot === "green" ? `0 0 6px ${presence.color}` : "none",
                    }}
                    title={presence.label}
                  />
                  <span className="text-sm font-bold truncate max-w-[100px]">{p.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── ANSWER REVEAL ──
  if (state.status === "answer_reveal" && currentQ) {
    const answersForQ = Object.values(state.players).map(p => p.answers[state.currentQuestion]);
    const correctCount = answersForQ.filter(a => a === true).length;
    const wrongCount = answersForQ.filter(a => a === false).length;
    const noAnswer = players.length - correctCount - wrongCount;

    return (
      <div className="min-h-screen p-8 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">{currentQ.question}</h2>
          <div className="flex gap-3">
            {state.currentQuestion < state.questionOrder.length - 1 ? (
              <button onClick={() => hostAction("next_question")} disabled={loading}
                className="py-3 px-8 rounded-xl font-bold text-xl hover:scale-105 disabled:opacity-50"
                style={{ background: "#22c55e" }}>
                Siguiente →
              </button>
            ) : (
              <button onClick={() => hostAction("show_leaderboard")} disabled={loading}
                className="py-3 px-8 rounded-xl font-bold text-xl hover:scale-105 disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
                🏆 Ver ganadores
              </button>
            )}
          </div>
        </div>

        {currentQ.code && <CodeBlock code={currentQ.code} language={currentQ.language} />}

        {/* Options with highlight */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {(() => {
            const optionShuffle = state.optionShuffles?.[state.currentQuestion];
            const displayOrder = optionShuffle ?? currentQ.options.map((_: string, i: number) => i);
            return displayOrder.map((originalIdx: number, displayIdx: number) => {
              const isCorrectOption = originalIdx === currentQ.correct;
              return (
                <div key={displayIdx} className="rounded-xl p-4 flex items-center gap-3 transition-all"
                  style={{
                    background: isCorrectOption ? "#14532d" : "#1a1030",
                    border: `2px solid ${isCorrectOption ? "#22c55e" : "#2d1f4e"}`,
                    transform: isCorrectOption ? "scale(1.02)" : "scale(1)",
                  }}>
                  <span className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0"
                    style={{ background: isCorrectOption ? "#22c55e" : "#374151", color: "white" }}>
                    {isCorrectOption ? "✓" : OPTION_LETTERS[displayIdx]}
                  </span>
                  <span className="font-mono text-lg">{currentQ.options[originalIdx]}</span>
                </div>
              );
            });
          })()}
        </div>

        {/* Explanation */}
        <div className="rounded-xl p-4 mb-6" style={{ background: "#1a2744", border: "1px solid #1e40af" }}>
          <span className="text-blue-400 font-bold mr-2">💡 Explicación:</span>
          <span className="text-gray-200">{currentQ.explanation}</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "✅ Correctas", val: correctCount, color: "#22c55e" },
            { label: "❌ Incorrectas", val: wrongCount, color: "#ef4444" },
            { label: "⏳ Sin responder", val: noAnswer, color: "#6b7280" },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-4 text-center"
              style={{ background: "#1a1030", border: `1px solid ${s.color}55` }}>
              <div className="text-4xl font-bold" style={{ color: s.color }}>{s.val}</div>
              <div className="text-sm text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Monitoreo de Alumnos */}
        <div className="mt-auto pt-2">
          <div className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Monitoreo del Aula</div>
          <div className="flex flex-wrap gap-2">
            {players.map((p) => {
              const presence = getPresenceInfo(p);
              const isCorrect = p.answers[state.currentQuestion] === true;
              const isWrong = p.answers[state.currentQuestion] === false;
              const hasAnswered = isCorrect || isWrong;
              
              let bgColor = "#1a1030";
              let borderColor = "#2d1f4e";
              
              if (isCorrect) {
                bgColor = "#14532d";
                borderColor = "#22c55e";
              } else if (isWrong) {
                bgColor = "#7f1d1d";
                borderColor = "#ef4444";
              }

              return (
                <div key={p.name} className="flex items-center gap-2 rounded-lg px-3 py-2 transition-all"
                  style={{
                    background: bgColor,
                    border: `1px solid ${borderColor}`,
                    opacity: presence.dot === "gray" ? 0.5 : 1
                  }}>
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      background: presence.color,
                      boxShadow: presence.dot === "green" ? `0 0 6px ${presence.color}` : "none",
                    }}
                    title={presence.label}
                  />
                  <span className="text-sm font-bold truncate max-w-[100px]">{p.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── LEADERBOARD / FINISHED ──
  if (state.status === "leaderboard" || state.status === "finished") {
    const medals = ["🥇", "🥈", "🥉"];
    return (
      <div className="min-h-screen p-8 flex flex-col items-center">
        <div className="text-6xl mb-4 pop-in">🏆</div>
        <h1 className="text-5xl font-bold mb-2" style={{ color: "#f59e0b" }}>Tabla Final</h1>
        <p className="text-gray-400 mb-8">¡Excelentes respuestas, equipazo!</p>

        <div className="w-full max-w-2xl space-y-3 mb-8">
          {players.map((p, i) => (
            <div key={p.name} className="flex items-center gap-4 rounded-2xl p-4 slide-up"
              style={{
                background: i === 0 ? "linear-gradient(135deg, #78350f, #451a03)" : "#1a1030",
                border: `2px solid ${i === 0 ? "#f59e0b" : i === 1 ? "#9ca3af" : i === 2 ? "#b45309" : "#2d1f4e"}`,
                animationDelay: `${i * 0.08}s`,
              }}>
              <span className="text-3xl w-10 text-center">{medals[i] ?? `#${i + 1}`}</span>
              <div className="text-2xl">
                {["😎","🦊","🐉","🤖","🦁","⚡","🎯","🔥"][p.name.charCodeAt(0) % 8]}
              </div>
              <div className="flex-1">
                <div className="font-bold text-xl">{p.name}</div>
                <div className="text-xs text-gray-400">
                  {p.answers.filter(Boolean).length}/{p.answers.length} correctas
                  {p.streak > 0 && <span className="ml-2 text-orange-400">🔥 racha {p.streak}</span>}
                </div>
              </div>
              <div className="text-3xl font-bold" style={{ color: i === 0 ? "#f59e0b" : "#a78bfa" }}>
                {p.score}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button onClick={() => downloadResultsCSV(state)}
            className="py-4 px-8 rounded-xl font-bold text-xl hover:scale-105"
            style={{ background: "linear-gradient(135deg, #059669, #10b981)", color: "white" }}>
            📊 Descargar resultados
          </button>
          <button onClick={() => hostAction("reset")} disabled={loading}
            className="py-4 px-8 rounded-xl font-bold text-xl hover:scale-105 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
            🔄 Nueva ronda
          </button>
        </div>
      </div>
    );
  }

  return <div className="min-h-screen flex items-center justify-center text-gray-400">Estado desconocido</div>;
}
