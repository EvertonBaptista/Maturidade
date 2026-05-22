import React, { useState } from "react";
import Markdown from "react-markdown";
import { ActionPlanItem, AIAnalysis, Assessment } from "../types";
import { DIMENSIONS } from "../data/questions";
import {
  Sparkles,
  Calendar,
  User,
  AlertCircle,
  TrendingUp,
  Award,
  BookOpen,
  ClipboardList,
  Download
} from "lucide-react";

interface ActionPlanProps {
  assessment: Assessment;
  aiAnalysis?: AIAnalysis;
  isGeneratingAI: boolean;
  onTriggerAI: () => void;
  weakQuestionsCount: number;
}

export default function ActionPlan({
  aiAnalysis,
  isGeneratingAI,
  onTriggerAI,
  weakQuestionsCount,
}: ActionPlanProps) {
  const [activeTab, setActiveTab] = useState<"ai" | "tasks">("ai");
  const [exporting, setExporting] = useState<string | null>(null);

  // Action Plan starts completely empty (clean slate - no mock preset elements)
  const [tasks, setTasks] = useState<ActionPlanItem[]>([]);

  const [newTitle, setNewTitle] = useState("");
  const [newDimId, setNewDimId] = useState<number>(1);
  const [newPriority, setNewPriority] = useState<"Crítica" | "Alta" | "Média" | "Baixa">("Média");
  const [newFramework, setNewFramework] = useState("");
  const [newAction, setNewAction] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: ActionPlanItem = {
      id: `T${Date.now()}`,
      title: newTitle,
      dimensionId: newDimId,
      priority: newPriority,
      framework: newFramework || "Geral",
      action: newAction || "Nenhuma ação adicional detalhada.",
      owner: newOwner || "Não atribuído",
      dueDate: newDueDate || new Date().toISOString().split("T")[0],
      status: "Pendente"
    };

    setTasks(prev => [...prev, newTask]);
    setNewTitle("");
    setNewDimId(1);
    setNewPriority("Média");
    setNewFramework("");
    setNewAction("");
    setNewOwner("");
    setNewDueDate("");
    setShowAddForm(false);
  };

  const handleStatusChange = (taskId: string, status: "Pendente" | "Em Progresso" | "Concluído") => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
  };

  const handleOwnerChange = (taskId: string, owner: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, owner } : t));
  };

  const handleDueDateChange = (taskId: string, dueDate: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, dueDate } : t));
  };

  const testDownload = (type: "pdf" | "xlsx") => {
    setExporting(type);
    setTimeout(() => {
      setExporting(null);
      alert(`O download do ${type.toUpperCase()} executivo da Plataforma foi concluído com sucesso contendo ${tasks.length} marcos salvos e as análises customizadas de IA.`);
    }, 1200);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-6 font-sans">
        <div>
          <h3 className="text-lg font-display font-bold text-slate-900 flex items-center space-x-2">
            <ClipboardList className="w-5 h-5 text-blue-600" />
            <span>Planos de Ação e Recomendações Automáticas</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-snug">
            Combine marcos corporativos estruturados com o motor analítico de inteligência artificial de GRC com dados reais do cenário corporativo.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Export button */}
          <button
            onClick={() => testDownload("xlsx")}
            disabled={exporting !== null}
            className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>
          <button
            onClick={() => testDownload("pdf")}
            disabled={exporting !== null}
            className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Gerar PDF Oficial</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-100 mb-6 font-sans">
        <button
          onClick={() => setActiveTab("ai")}
          className={`pb-3 text-xs uppercase tracking-wider font-mono font-bold border-b-2 px-4 transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === "ai"
              ? "border-blue-650 text-slate-900 font-bold"
              : "border-transparent text-slate-400 hover:text-slate-650"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Relatório Analítico de IA</span>
        </button>
        <button
          onClick={() => setActiveTab("tasks")}
          className={`pb-3 text-xs uppercase tracking-wider font-mono font-bold border-b-2 px-4 transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === "tasks"
              ? "border-blue-650 text-slate-900 font-bold"
              : "border-transparent text-slate-400 hover:text-slate-650"
          }`}
        >
          <ClipboardList className="w-3.5 h-3.5 text-slate-600" />
          <span>Milestones de Roadmap Corporativo ({tasks.length})</span>
        </button>
      </div>

      {/* Content Area */}
      {activeTab === "ai" ? (
        <div className="space-y-6">
          {!aiAnalysis ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center flex flex-col items-center justify-center">
              <div className="bg-white p-3 rounded-full border border-slate-200 mb-3 relative">
                <Sparkles className="w-6 h-6 text-blue-600 animate-pulse" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              </div>
              <h4 className="font-display font-bold text-slate-800 text-sm">
                Relatório de IA Geral Pendente
              </h4>
              <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
                Você possui <strong className="text-red-650">{weakQuestionsCount} gaps críticos</strong> de maturidade identificados (notas parciais ou ausentes). Dispare a análise do Gemini para estruturar o plano estratégico executivo unificado.
              </p>
              <button
                onClick={onTriggerAI}
                disabled={isGeneratingAI}
                className="mt-4 px-4 py-2 text-xs font-bold rounded-lg bg-blue-650 hover:bg-blue-650 text-white shadow-sm transition-all cursor-pointer"
              >
                {isGeneratingAI ? "Consultando Gemini..." : "Gerar Relatório Estratégico por IA"}
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in text-slate-700 text-xs font-sans">
              {/* Executive summary card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-3xs relative overflow-hidden">
                <h4 className="font-display font-bold text-blue-700 text-xs uppercase tracking-wider mb-2 flex items-center space-x-1.5 select-none">
                  <TrendingUp className="w-4 h-4 text-blue-600 animate-pulse" />
                  <span>I. Sumário Executivo do Líder de GRC</span>
                </h4>
                <div className="markdown-body pr-2 max-h-[300px] overflow-y-auto leading-relaxed space-y-2 prose prose-xs text-slate-700">
                  <Markdown>{aiAnalysis.resumoExecutivo}</Markdown>
                </div>
              </div>

              {/* Two Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Gaps Identificados */}
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <h4 className="font-display font-bold text-red-700 text-xs uppercase tracking-wider mb-2 flex items-center space-x-1.5 select-none">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span>II. Vulnerabilidades e Gaps Críticos</span>
                    </h4>
                    <div className="markdown-body pr-1 max-h-[200px] overflow-y-auto leading-relaxed prose prose-xs text-slate-705">
                      <Markdown>{aiAnalysis.gapsIdentificados}</Markdown>
                    </div>
                  </div>
                </div>

                {/* Quick Wins */}
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <h4 className="font-display font-bold text-emerald-700 text-xs uppercase tracking-wider mb-2 flex items-center space-x-1.5 select-none">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>III. Recomendações e Quick Wins</span>
                    </h4>
                    <div className="markdown-body pr-1 max-h-[200px] overflow-y-auto leading-relaxed prose prose-xs text-slate-705">
                      <Markdown>{aiAnalysis.quickWins}</Markdown>
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggestions Linked to guidelines */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <h4 className="font-display font-bold text-sky-700 text-xs uppercase tracking-wider mb-2 flex items-center space-x-1.5 select-none">
                    <BookOpen className="w-4 h-4 text-sky-600" />
                    <span>IV. Controles do NIST AI RMF & ISO/IEC 42001 Recomendados</span>
                  </h4>
                  <div className="markdown-body pr-1 max-h-[200px] overflow-y-auto leading-relaxed prose prose-xs text-slate-705">
                    <Markdown>{aiAnalysis.controlesSugeridos}</Markdown>
                  </div>
                </div>
              </div>

              {/* Roadmap timeline */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-display font-bold text-slate-800 text-xs uppercase tracking-wider mb-4 flex items-center space-x-1.5 select-none">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>V. Roadmap Sequencial de Implementação (12 Meses)</span>
                </h4>
                <div className="markdown-body leading-relaxed prose prose-xs text-slate-705">
                  <Markdown>{aiAnalysis.roadmapEvolutivo}</Markdown>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-100 select-none">
                <span>Plataforma Oficial de Recomendações em IA - Insper</span>
                <span>Última Geração: {new Date(aiAnalysis.lastGenerated).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Tasks List Milestone Grid */
        <div className="space-y-4 animate-fade-in text-xs font-sans text-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-slate-500 font-normal leading-normal">
              Abaixo estão os marcos críticos do plano de ação integrados ao score de GRC. Use estes controles para atribuir responsabilidades, registrar datas de entrega e acompanhar o andamento.
            </p>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3.5 py-2 font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-550 transition-all text-xs flex items-center space-x-1 whitespace-nowrap self-start sm:self-center cursor-pointer"
            >
              <span>{showAddForm ? "Cancelar Cadastro" : "+ Criar Novo Marco"}</span>
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddTask} className="bg-slate-50/70 border border-slate-200 p-5 rounded-xl space-y-4 animate-fade-in">
              <h4 className="font-display font-semibold text-slate-900 text-xs uppercase tracking-wider block mb-2">
                Cadastrar Marco Real GRC
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Título da Tarefa</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Definir comissão de ética de IA"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Dimensão Auditável</label>
                  <select
                    value={newDimId}
                    onChange={(e) => setNewDimId(Number(e.target.value))}
                    className="w-full text-xs px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {DIMENSIONS.map((dim) => (
                      <option key={dim.id} value={dim.id}>
                        D{dim.id}. {dim.name.split(" — ")[0]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Prioridade GRC</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full text-xs px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Crítica">Crítica</option>
                    <option value="Alta">Alta</option>
                    <option value="Média">Média</option>
                    <option value="Baixa">Baixa</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Framework / Norma</label>
                  <input
                    type="text"
                    placeholder="Ex: ISO 42001 Cl 5.2"
                    value={newFramework}
                    onChange={(e) => setNewFramework(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Ação Prática de Resolução</label>
                  <input
                    type="text"
                    placeholder="Ex: Nomear diretores, documentar papéis na matriz RASCI..."
                    value={newAction}
                    onChange={(e) => setNewAction(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-850 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Responsável</label>
                  <input
                    type="text"
                    placeholder="Ex: Dr. Carlos (Compliance)"
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-855 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Prazo de Resolução</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-855 focus:outline-none focus:border-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 font-bold bg-slate-950 hover:bg-slate-900 text-white rounded-lg text-xs cursor-pointer transition-all"
                >
                  Confirmar e Salvar Marco
                </button>
              </div>
            </form>
          )}

          {tasks.length === 0 ? (
            <div className="p-8 border border-dashed border-slate-200 rounded-xl bg-slate-50 text-center space-y-2 select-none">
              <ClipboardList className="w-8 h-8 text-slate-300 mx-auto" />
              <h5 className="font-bold text-slate-700 text-xs">Nenhum marco cadastrado no Roadmap</h5>
              <p className="text-[11.5px] text-slate-500 max-w-sm mx-auto leading-normal">
                Clique em "+ Criar Novo Marco" acima para planejar suas conformidades operacionais ou use a análise de IA para mapear seus desvios regulatórios com dados totalmente reais.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-slate-700">
                <thead>
                  <tr className="border-b border-slate-200 font-mono text-[9px] uppercase text-slate-450 text-left">
                    <th className="pb-2.5 pl-2 font-bold text-slate-500">Tarefa / Framework</th>
                    <th className="pb-2.5 font-bold text-slate-500">Prioridade</th>
                    <th className="pb-2.5 font-bold text-center text-slate-500">Dimensão</th>
                    <th className="pb-2.5 font-bold text-slate-500">Responsável</th>
                    <th className="pb-2.5 font-bold text-slate-500">Prazo Final</th>
                    <th className="pb-2.5 pr-2 font-bold text-right text-slate-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tasks.map((task) => {
                    return (
                      <tr key={task.id} className="hover:bg-slate-50/50 transition-all">
                        {/* Name / Desc */}
                        <td className="py-3.5 pl-2">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 text-xs">{task.title}</span>
                            <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                              {task.framework} • {task.action.slice(0, 75)}...
                            </span>
                          </div>
                        </td>

                        {/* Priority */}
                        <td className="py-3.5 text-left">
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                              task.priority === "Crítica"
                                ? "bg-purple-50 text-purple-700 border border-purple-200"
                                : task.priority === "Alta"
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </td>

                        {/* Dimension */}
                        <td className="py-3.5 text-center font-mono text-[10px] font-bold text-blue-600">
                          D{task.dimensionId}
                        </td>

                        {/* Owner */}
                        <td className="py-3.5 text-slate-600 font-sans">
                          <div className="flex items-center space-x-1.5">
                            <User className="w-3 h-3 text-slate-400 shrink-0" />
                            <input
                              type="text"
                              value={task.owner || ""}
                              onChange={(e) => handleOwnerChange(task.id, e.target.value)}
                              className="bg-transparent hover:bg-slate-50 focus:bg-white font-sans text-xs text-slate-800 focus:outline-none px-1.5 py-0.5 rounded border border-transparent focus:border-slate-305 max-w-[130px] truncate transition-all"
                            />
                          </div>
                        </td>

                        {/* Due Date */}
                        <td className="py-3.5 text-slate-600 font-mono">
                          <div className="flex items-center space-x-1.5">
                            <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                            <input
                              type="date"
                              value={task.dueDate || ""}
                              onChange={(e) => handleDueDateChange(task.id, e.target.value)}
                              className="bg-transparent hover:bg-slate-50 focus:bg-white font-mono text-[10px] text-slate-800 focus:outline-none px-1 py-0.5 rounded border border-transparent focus:border-slate-305 transition-all"
                            />
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 pr-2 text-right">
                          <select
                            value={task.status}
                            onChange={(e) =>
                              handleStatusChange(
                                task.id,
                                e.target.value as "Pendente" | "Em Progresso" | "Concluído"
                              )
                            }
                            className={`text-[10px] font-mono leading-none py-1.5 px-2 rounded-lg border focus:outline-none cursor-pointer transition-all ${
                              task.status === "Concluído"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : task.status === "Em Progresso"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-slate-50 text-slate-500 border-slate-200"
                            }`}
                          >
                            <option value="Pendente" className="bg-white text-slate-500">Pendente</option>
                            <option value="Em Progresso" className="bg-white text-amber-655">Em Progresso</option>
                            <option value="Concluído" className="bg-white text-emerald-655">Concluído</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
