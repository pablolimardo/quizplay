import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Question } from "../../lib/questions";

export default function CrudAdmin() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<{ static: any[], custom: any[] } | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<any | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  // States for new custom quiz
  const [newId, setNewId] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("📚");
  const [newDesc, setNewDesc] = useState("");

  const [aiTopic, setAiTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    const res = await fetch("/api/admin/quizzes");
    if (res.ok) {
      setQuizzes(await res.json());
    }
  };

  const loadQuizDetail = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/quizzes/${encodeURIComponent(id)}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedQuiz(data);
        setQuestions(data.questions || []);
      } else {
        alert("Error al cargar este cuestionario.");
      }
    } catch(e) { console.error(e); }
  };

  const handleCreateCustom = async () => {
    if (!newId || !newName) return alert("Faltan campos = ID y Nombre son obligatorios");
    const res = await fetch("/api/admin/quizzes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: newId, name: newName, emoji: newEmoji, description: newDesc }),
    });
    if (res.ok) {
      setNewId(""); setNewName(""); setNewDesc(""); 
      fetchQuizzes();
    } else {
      alert("Error al crear quiz");
    }
  };

  const handleDeleteQuiz = async (id: string) => {
    if (!confirm("¿Seguro que querés borrar este cuestionario completo?")) return;
    await fetch(`/api/admin/quizzes/${encodeURIComponent(id)}`, { method: "DELETE" });
    fetchQuizzes();
    if (selectedQuiz?.meta?.id === id) setSelectedQuiz(null);
  };

  const handleGenerateAI = async () => {
    if (!aiTopic) return alert("Por favor ingresá un tema para generar.");
    setIsGenerating(true);
    try {
      const raw = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: aiTopic }),
      });
      const res = await raw.json();
      if (!raw.ok) throw new Error(res.error || "Error de la API");
      
      const generated = res.questions;
      if (generated && generated.length > 0) {
        // En lugar de pushearlos uno a uno, los asignamos y fijamos sus IDs correlativos
        const updated = [...questions, ...generated].map((q, i) => ({ ...q, id: i + 1 }));
        setQuestions(updated);
        
        // Guardar automáticamente
        await fetch(`/api/admin/quizzes/${encodeURIComponent(selectedQuiz?.meta?.id || "")}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questions: updated }),
        });
        alert("¡10 preguntas generadas y guardadas con éxito!");
        setAiTopic("");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteQuestion = async (index: number) => {
    if (!confirm("¿Eliminar pregunta?")) return;
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
    
    await fetch(`/api/admin/quizzes/${encodeURIComponent(selectedQuiz?.meta?.id || "")}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questions: updated }),
    });
  };

  if (!quizzes) return <div className="min-h-screen grid place-items-center text-white">Cargando Gestor...</div>;

  return (
    <div className="min-h-screen bg-[#0f0e17] text-white p-8">
      <div className="max-w-6xl mx-auto">
        
        <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              🛠️ Gestor de Cuestionarios (CRUD)
            </h1>
            <p className="text-gray-400 mt-1">Crea nuevos quizzes y auto-generá preguntas con Inteligencia Artificial.</p>
          </div>
          <Link href="/host">
            <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl text-sm font-bold transition">
              Volver al Panel Host
            </button>
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* SIDEBAR: Listado de Quizzes */}
          <div className="col-span-1 border-r border-gray-800 pr-6">
            
            <div className="mb-6 p-4 rounded-xl" style={{background: "#1a1030", border: "1px solid #2d1f4e"}}>
              <h3 className="font-bold text-lg mb-3" style={{color: "#a855f7"}}>🟢 Crear Cuestionario Nuevo</h3>
              <label className="text-xs text-gray-400 block mb-1">ID Único (sin espacios):</label>
              <input type="text" placeholder="ej: tp-evaluativo-1" className="w-full bg-black/50 border border-gray-700 rounded p-2 mb-2 text-sm focus:border-purple-500 focus:outline-none" value={newId} onChange={e => setNewId(e.target.value)} />
              
              <label className="text-xs text-gray-400 block mb-1">Título visible:</label>
              <input type="text" placeholder="Ej: Evaluación de Sistemas" className="w-full bg-black/50 border border-gray-700 rounded p-2 mb-2 text-sm focus:border-purple-500 focus:outline-none" value={newName} onChange={e => setNewName(e.target.value)} />
              
              <div className="flex gap-2 mb-2">
                <div className="w-1/3">
                  <label className="text-xs text-gray-400 block mb-1">Icono/Emoji:</label>
                  <input type="text" placeholder="Ej: 🚀" className="w-full bg-black/50 border border-gray-700 rounded p-2 text-sm focus:border-purple-500 focus:outline-none text-center" value={newEmoji} onChange={e => setNewEmoji(e.target.value)} />
                </div>
                <div className="w-2/3">
                  <label className="text-xs text-gray-400 block mb-1">Descripción corta:</label>
                  <input type="text" placeholder="Breve resumen..." className="w-full bg-black/50 border border-gray-700 rounded p-2 text-sm focus:border-purple-500 focus:outline-none" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
                </div>
              </div>
              <button 
                onClick={handleCreateCustom}
                className="w-full py-2 mt-2 bg-green-600 hover:bg-green-500 rounded font-bold transition">
                + Iniciar Cuestionario
              </button>
            </div>

            <h3 className="font-bold text-gray-400 uppercase text-xs mb-3 tracking-wider">TUS CUESTIONARIOS PERSONALIZADOS</h3>
            <div className="flex flex-col gap-2 mb-6">
               {quizzes.custom.length === 0 && <span className="text-sm text-gray-500">Todavía no creaste ninguno.</span>}
               {quizzes.custom.map(q => (
                 <div key={q.id} className="cursor-pointer group flex justify-between items-center p-3 rounded bg-gray-900 border border-gray-800 hover:border-purple-500 transition"
                      onClick={() => loadQuizDetail(q.id)}>
                   <div><span className="mr-2">{q.emoji}</span><span className="font-bold">{q.name}</span></div>
                   <button onClick={(e) => { e.stopPropagation(); handleDeleteQuiz(q.id) }} className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 text-xs">Borrar</button>
                 </div>
               ))}
            </div>

            <h3 className="font-bold text-gray-400 uppercase text-xs mb-3 tracking-wider">CUESTIONARIOS ESTÁTICOS (RO)</h3>
            <div className="flex flex-col gap-2">
               {quizzes.static.map(q => (
                 <div key={q.id} className="p-3 rounded bg-gray-900/50 border border-gray-800 opacity-60 flex justify-between"
                      onClick={() => loadQuizDetail(q.id)} style={{cursor: "pointer"}}>
                   <div><span className="mr-2">{q.emoji}</span><span className="text-sm">{q.name}</span></div>
                   <span className="text-xs text-gray-600">Fijo</span>
                 </div>
               ))}
            </div>
          </div>

          {/* MAIN COLUMN: Editor del Quiz Seleccionado */}
          <div className="col-span-2">
            {!selectedQuiz ? (
              <div className="h-full flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-800 rounded-2xl">
                Seleccioná un cuestionario del panel izquierdo para gestionarlo.
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{selectedQuiz?.meta?.emoji || "❓"} {selectedQuiz?.meta?.name || "Sin Nombre"}</h2>
                    <p className="text-gray-400">{selectedQuiz?.meta?.description || "Sin descripción"}</p>
                    {selectedQuiz.isCustom ? (
                      <span className="inline-block mt-2 text-xs bg-green-900 text-green-300 px-3 py-1 rounded border border-green-700">✅ Personalizado (Habilitado para agregar y borrar preguntas)</span>
                    ) : (
                      <div className="mt-3 text-sm bg-gray-800/80 border border-gray-700 p-3 rounded-lg text-gray-300 flex gap-2 items-start">
                        <span className="text-xl">🔒</span>
                        <div>
                          <strong>Cuestionario Fijo de Sistema (Solo Lectura)</strong>
                          <p className="text-xs text-gray-400 mt-1">Este cuestionario viene incluido en el sistema y no se puede modificar directamente para no romper el juego por defecto. <br/>Para crear y modificar tus propias preguntas, <strong>creá un Cuestionario Nuevo en el panel izquierdo</strong>.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI GENERATOR WIDGET */}
                {selectedQuiz.isCustom && (
                  <div className="mb-8 p-6 rounded-2xl" style={{background: "linear-gradient(145deg, #2d1b54 0%, #1a1030 100%)", border: "1px solid #4c1d95"}}>
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                      ✨ Autogenerar Preguntas con Gemini
                    </h3>
                    <p className="text-sm text-gray-300 mb-4">Ingresá un tema específico y la IA construirá un bloque de 10 preguntas técnicas especializadas al instante.</p>
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        placeholder="Ejemplo: Conceptos básicos de HTML y CSS" 
                        value={aiTopic}
                        onChange={e => setAiTopic(e.target.value)}
                        className="flex-1 bg-black/60 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                        disabled={isGenerating}
                      />
                      <button 
                        onClick={handleGenerateAI}
                        disabled={isGenerating || !aiTopic}
                        className="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-2 px-6 rounded-lg transition"
                      >
                        {isGenerating ? "Generando... ⏳" : "¡Generar Ahora! 🚀"}
                      </button>
                    </div>
                  </div>
                )}

                {/* QUESTIONS LIST */}
                <h3 className="text-lg font-bold mb-4">Banco de Preguntas ({questions.length})</h3>
                <div className="flex flex-col gap-4">
                  {questions.length === 0 && <div className="text-gray-500 italic">No hay preguntas cargadas en este cuestionario.</div>}
                  {questions.map((q, idx) => (
                    <div key={idx} className="bg-[#1a1c23] border border-gray-700 rounded-xl p-5 relative group">
                      {selectedQuiz.isCustom && (
                        <button onClick={() => handleDeleteQuestion(idx)} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition hover:bg-red-500/20 p-2 rounded-full">
                          🗑️
                        </button>
                      )}
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded font-mono">Q{idx+1}</span>
                        <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded">{q.topic}</span>
                        <span className="bg-pink-900/30 text-pink-300 text-xs px-2 py-1 rounded">⏱️ {q.timeLimit}s</span>
                        <span className="bg-green-900/30 text-green-300 text-xs px-2 py-1 rounded">🏆 {q.points}pts</span>
                      </div>
                      
                      <h4 className="font-bold text-lg mb-4 pr-10">{q.question}</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                        {q.options.map((opt, optIdx) => (
                          <div key={optIdx} className={`p-2 rounded text-sm border ${optIdx === q.correct ? 'bg-green-900/20 border-green-500/50 text-green-300' : 'bg-gray-800/50 border-gray-700 text-gray-400'}`}>
                            <span className="font-bold mr-2">{["A", "B", "C", "D"][optIdx]}.</span> {opt}
                          </div>
                        ))}
                      </div>
                      
                      <div className="text-sm bg-blue-900/20 border border-blue-900/50 p-3 rounded-lg text-blue-200">
                        <span className="font-bold mr-2">💡 Explicación:</span> {q.explanation}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
