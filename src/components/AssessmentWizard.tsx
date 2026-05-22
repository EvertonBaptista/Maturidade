import React, { useState } from "react";
import { DIMENSIONS, QUESTIONS } from "../data/questions";
import { Answer, Question, Assessment, User } from "../types";
import {
  FileText,
  CheckCircle,
  MessageSquare,
  Sparkles,
  ChevronRight,
  UserCheck,
  Loader2,
  Upload
} from "lucide-react";

interface AssessmentWizardProps {
  assessment: Assessment;
  currentUser: User;
  onUpdateAnswers: (answers: Record<string, Answer>) => void;
  onTriggerAIRecommendations: () => void;
  isGeneratingAI: boolean;
  onUpdateStatus: (status: "Em Progresso" | "Em Revisão" | "Concluído", reviewer?: string) => void;
}

export default function AssessmentWizard({
  assessment,
  currentUser,
  onUpdateAnswers,
  onTriggerAIRecommendations,
  isGeneratingAI,
  onUpdateStatus,
}: AssessmentWizardProps) {
  const [activeDimId, setActiveDimId] = useState<number>(1);
  const [uploadingForQuestion, setUploadingForQuestion] = useState<string | null>(null);

  // Active dimension details
  const activeDim = DIMENSIONS.find((d) => d.id === activeDimId) || DIMENSIONS[0];
  const activeQuestions = QUESTIONS.filter((q) => q.dimensionId === activeDimId);

  // Completion calculation helper
  const getDimensionProgress = (dimId: number) => {
    const dimqs = QUESTIONS.filter((q) => q.dimensionId === dimId);
    const answered = dimqs.filter((q) => assessment.answers[q.id] !== undefined);
    return {
      answered: answered.length,
      total: dimqs.length,
      done: answered.length === dimqs.length,
    };
  };

  // Answer handler
  const handleAnswerSelect = (qId: string, score: number) => {
    const current = assessment.answers[qId];
    const updatedAnswers = {
      ...assessment.answers,
      [qId]: {
        questionId: qId,
        score,
        comment: current?.comment || "",
        evidenceName: current?.evidenceName || "",
        evidenceSize: current?.evidenceSize || "",
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser.email,
      },
    };
    onUpdateAnswers(updatedAnswers);
  };

  // Comment input blur handler
  const handleCommentBlur = (qId: string, comment: string) => {
    const current = assessment.answers[qId];
    if (!current && !comment) return; // ignore empty edits for unanswered questions

    const updatedAnswers = {
      ...assessment.answers,
      [qId]: {
        questionId: qId,
        score: current ? current.score : 0, // default if commenting before scoring
        comment,
        evidenceName: current?.evidenceName || "",
        evidenceSize: current?.evidenceSize || "",
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser.email,
      },
    };
    onUpdateAnswers(updatedAnswers);
  };

  // Mock File Drag or Select handler
  const simulateFileUpload = (qId: string, fileName: string) => {
    setUploadingForQuestion(qId);
    setTimeout(() => {
      const current = assessment.answers[qId];
      const updatedAnswers = {
        ...assessment.answers,
        [qId]: {
          questionId: qId,
          score: current ? current.score : 0,
          comment: current?.comment || "",
          evidenceName: fileName,
          evidenceSize: "2.4 MB (PDF)",
          updatedAt: new Date().toISOString(),
          updatedBy: currentUser.email,
        },
      };
      onUpdateAnswers(updatedAnswers);
      setUploadingForQuestion(null);
    }, 850);
  };

  // Criticality styling helper (soft, high legibility pastels)
  const getCriticalityBadge = (crit: "Crítica" | "Alta" | "Média" | "Baixa") => {
    switch (crit) {
      case "Crítica":
        return "bg-purple-50 text-purple-700 border border-purple-200/80";
      case "Alta":
        return "bg-red-50 text-red-700 border border-red-200/80";
      case "Média":
        return "bg-amber-50 text-amber-700 border border-amber-200/80";
      default:
        return "bg-slate-50 text-slate-500 border border-slate-200/50";
    }
  };

  // Option description scale definitions
  const scaleOptions = [
    { value: 0, label: "Não Existe", desc: "Controle inexistente ou processos completamente informais/ad-hoc." },
    { value: 1, label: "Parcial", desc: "Processo estruturado de forma parcial ou em fase de planejamento/implementação inicial." },
    { value: 2, label: "Implementado", desc: "Ação totalmente implementada e funcional, com consistência operacional comprovada." },
    { value: 3, label: "Maduro", desc: "Processo maduro, continuamente aprimorado, mensurado e otimizado com automações." },
  ];

  // Global assessment metric progress
  const answeredGlobal = QUESTIONS.filter((q) => assessment.answers[q.id] !== undefined).length;
  const totalGlobal = QUESTIONS.length;
  const isAllAnswered = answeredGlobal === totalGlobal;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch font-sans">
      {/* 1. Sidebar - list of 8 dimensions */}
      <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h4 className="font-display font-bold text-xs text-blue-600 uppercase tracking-widest leading-none">Insper Framework</h4>
              <h3 className="text-base font-display font-bold text-slate-900 mt-1">8 Dimensões do Assessment</h3>
            </div>
            <div className="bg-slate-50 px-2 py-1 rounded border border-slate-200 font-mono text-center">
              <span className="text-[10px] text-slate-400 block uppercase leading-none text-right">Progresso</span>
              <span className="text-xs font-bold text-blue-600">
                {answeredGlobal}/{totalGlobal}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {DIMENSIONS.map((dim) => {
              const prog = getDimensionProgress(dim.id);
              const isActive = activeDimId === dim.id;

              return (
                <button
                  key={dim.id}
                  onClick={() => setActiveDimId(dim.id)}
                  className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all group cursor-pointer ${
                    isActive
                      ? "bg-slate-50 border-blue-500 text-slate-900 shadow-xs"
                      : "bg-white hover:bg-slate-50/50 border-slate-200 text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <div className="flex items-start space-x-3 truncate">
                    <span
                      className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : prog.done
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      D{dim.id}
                    </span>
                    <div className="truncate text-left leading-snug">
                      <p className={`text-xs font-bold truncate ${isActive ? "text-slate-900" : "text-slate-700 group-hover:text-slate-900"}`}>
                        {dim.name}
                      </p>
                      <p className="text-[9px] text-slate-400 truncate mt-0.5">{dim.focus}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 pl-2">
                    {prog.done ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1 py-0.5 rounded">
                        {prog.answered}/{prog.total}
                      </span>
                    )}
                    <ChevronRight className={`w-3.5 h-3.5 text-slate-300 transition-all ${isActive ? "translate-x-0.5 text-blue-600 font-bold" : ""}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Panel for entire Assessment Status */}
        <div className="mt-6 pt-4 border-t border-slate-100 space-y-4">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <h5 className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500 mb-1 flex items-center space-x-1">
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Status & Fluxo GRC</span>
            </h5>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-slate-500">Status Atual:</span>
              <span
                className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                  assessment.status === "Concluído"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : assessment.status === "Em Revisão"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}
              >
                {assessment.status}
              </span>
            </div>

            {/* Workflow approval log */}
            {assessment.approvedBy && (
              <p className="text-[9px] font-mono text-emerald-700 mt-2 leading-tight">
                ✔ Aprovado por: {assessment.approvedBy} em {new Date(assessment.approvedAt || "").toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="space-y-2">
            {assessment.status === "Em Progresso" ? (
              <button
                onClick={() => {
                  if (isAllAnswered) {
                    onUpdateStatus("Em Revisão");
                  } else {
                    alert("Atenção: Recomendamos preencher todas as 46 perguntas antes de submeter para auditoria formal.");
                    onUpdateStatus("Em Revisão");
                  }
                }}
                className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-all flex items-center justify-center space-x-1.5 active:scale-95 cursor-pointer"
              >
                <span>Submeter p/ Revisão Executiva</span>
              </button>
            ) : currentUser.role === "auditor" || currentUser.role === "admin" ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onUpdateStatus("Concluído", currentUser.email)}
                  disabled={assessment.status === "Concluído"}
                  className="py-2 px-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[10px] lg:text-xs font-semibold transition-all flex items-center justify-center space-x-1 cursor-pointer active:scale-95"
                >
                  <span>Aprovar Relatório</span>
                </button>
                <button
                  onClick={() => onUpdateStatus("Em Progresso")}
                  className="py-2 px-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-[10px] lg:text-xs font-semibold border border-slate-200 transition-all flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <span>Reabrir Edição</span>
                </button>
              </div>
            ) : (
              <p className="text-center text-[10px] text-slate-400 py-1 font-mono">
                Aguardando aprovação de Auditor / C-level.
              </p>
            )}

            {/* AI Generator Trigger */}
            <button
              onClick={onTriggerAIRecommendations}
              disabled={isGeneratingAI}
              className="w-full py-2.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
            >
              {isGeneratingAI ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>Gerando Insights IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>Gerar Plano de Ação por IA</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Right Area - Detail questions of the active dimension */}
      <div className="lg:col-span-8 space-y-5">
        {/* Dimension Title Block */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 font-sans">
            <div>
              <span className="font-mono text-blue-600 font-bold tracking-widest text-[10px] uppercase">
                Dimensão Ativa {activeDim.id} de 8
              </span>
              <h2 className="text-lg lg:text-xl font-display font-bold text-slate-900 mt-1">
                {activeDim.name}
              </h2>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-normal">
                {activeDim.description}
              </p>
            </div>
          </div>
        </div>

        {/* Questions list */}
        <div className="space-y-4">
          {activeQuestions.map((q) => {
            const answer = assessment.answers[q.id];
            const currentScore = answer !== undefined ? answer.score : -1;
            const currentComment = answer?.comment || "";
            const currentEvidence = answer?.evidenceName || "";

            return (
              <div
                key={q.id}
                className={`p-5 rounded-xl border transition-all bg-white ${
                  currentScore !== -1
                    ? "border-slate-300 shadow-xs"
                    : "border-slate-200"
                }`}
              >
                {/* Question Info Header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-bold border border-blue-200">
                        {q.id}
                      </span>
                      <span className={`px-2 py-0.5 rounded border font-mono text-[9px] font-bold ${getCriticalityBadge(q.criticality)}`}>
                        {q.criticality}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-mono text-[9px]">
                        Maturidade Alvo: N{q.level}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Peso: {q.weight}
                      </span>
                    </div>

                    <h4 className="text-sm font-sans font-bold text-slate-800 pt-1 leading-snug">
                      {q.text}
                    </h4>

                    {q.description && (
                      <p className="text-[11px] text-slate-500 leading-relaxed font-normal bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/60 mt-2">
                        {q.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Score Scale Action buttons */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 mt-4">
                  <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block mb-2 font-bold">
                    Selecione o Nível de Atendimento de Controle:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-1.5">
                    {scaleOptions.map((opt) => {
                      const isSelected = currentScore === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleAnswerSelect(q.id, opt.value)}
                          className={`p-2.5 rounded-lg border text-left transition-all relative cursor-pointer active:scale-95 group ${
                            isSelected
                              ? opt.value === 0
                                ? "bg-red-50 border-red-300 text-red-800 font-semibold"
                                : opt.value === 1
                                ? "bg-amber-50 border-amber-300 text-amber-800 font-semibold"
                                : opt.value === 2
                                ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold"
                                : "bg-sky-50 border-sky-300 text-sky-800 font-semibold"
                              : "bg-white hover:bg-slate-100/50 border-slate-200 text-slate-400 hover:text-slate-700"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-mono text-[9px] font-bold uppercase">
                              Opção {opt.value}
                            </span>
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isSelected
                                  ? opt.value === 0
                                    ? "bg-red-600 animate-pulse"
                                    : opt.value === 1
                                    ? "bg-amber-600"
                                    : opt.value === 2
                                    ? "bg-emerald-600"
                                    : "bg-sky-600"
                                  : "bg-slate-200"
                              }`}
                            ></span>
                          </div>
                          <p className="text-[11px] font-bold">{opt.label}</p>
                          <p className="text-[9px] text-slate-400 leading-tight mt-1 line-clamp-2 select-none">
                            {opt.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Audit Evidence input, comments, upload (Collapsible on score) */}
                {currentScore !== -1 && (
                  <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left - Justificativa / Comentários */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-1 h-5 select-none">
                        <MessageSquare className="w-3 h-3 text-blue-600" />
                        <span>Justificativa / Comentários Técnicos</span>
                      </label>
                      <textarea
                        defaultValue={currentComment}
                        placeholder="Para fins de auditoria, justifique brevemente a pontuação ou mapeie os artefatos internos correspondentes..."
                        onBlur={(e) => handleCommentBlur(q.id, e.target.value)}
                        className="w-full h-11 text-[11px] px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 focus:border-blue-500 focus:outline-none text-slate-700 placeholder:text-slate-300 resize-none font-sans"
                      />
                    </div>

                    {/* Right - Document Upload / Evidências */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-1 h-5 select-none">
                        <Upload className="w-3 h-3 text-blue-600" />
                        <span>Anexar Evidências de Conformidade</span>
                      </label>

                      {currentEvidence ? (
                        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                          <div className="flex items-center space-x-2 truncate">
                            <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="text-[10px] font-mono truncate text-slate-700">
                              {currentEvidence}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const current = assessment.answers[q.id];
                              const updated = {
                                ...assessment.answers,
                                [q.id]: {
                                  ...current,
                                  evidenceName: "",
                                  evidenceSize: "",
                                },
                              };
                              onUpdateAnswers(updated);
                            }}
                            className="text-[9px] text-red-650 hover:text-red-700 font-mono px-1.5 py-0.5 rounded hover:bg-red-50 cursor-pointer"
                          >
                            Remover
                          </button>
                        </div>
                      ) : (
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Exemplo: RIPD_SistemaIA_2026.pdf"
                            className="w-full text-[10px] px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 placeholder:text-slate-300 pr-16 font-sans focus:outline-none focus:border-blue-500"
                            id={`file-input-${q.id}`}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                const val = (e.target as HTMLInputElement).value;
                                if (val) simulateFileUpload(q.id, val);
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const el = document.getElementById(`file-input-${q.id}`) as HTMLInputElement;
                              if (el && el.value) {
                                simulateFileUpload(q.id, el.value);
                              } else {
                                simulateFileUpload(q.id, `Controle_Evidencia_${q.id}.pdf`);
                              }
                            }}
                            disabled={uploadingForQuestion === q.id}
                            className="absolute right-1 top-1 bottom-1 text-[9px] font-semibold bg-slate-50 text-blue-600 hover:text-blue-700 px-2 py-0.5 rounded border border-slate-200 flex items-center space-x-1 cursor-pointer transition-all"
                          >
                            {uploadingForQuestion === q.id ? (
                                <Loader2 className="w-2.5 h-2.5 animate-spin" />
                            ) : (
                              <span>Vincular</span>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
