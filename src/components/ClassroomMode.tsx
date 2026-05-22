import React, { useState, useEffect } from "react";
import { DIMENSIONS, QUESTIONS } from "../data/questions";
import { calculateAssessmentScores } from "../utils/scoreEngine";
import { Answer, MaturityScore } from "../types";
import { getMaturityDetailsForScore, MATURITY_LEVELS } from "../utils/maturityHelper";
import { 
  Users, 
  QrCode, 
  Tv2, 
  Smartphone, 
  RefreshCw, 
  CheckCircle, 
  ChevronRight, 
  ChevronLeft,
  XCircle,
  TrendingUp,
  Award,
  Layers,
  Sparkles,
  ExternalLink,
  Copy,
  Plus,
  Trash2,
  Building2,
  Settings,
  HelpCircle
} from "lucide-react";

// Dimension maturity translation from average dimension score (0.00 to 3.00)
export function getMaturityDetailsForDimensionScore(score: number): { level: number; name: string; color: string; bg: string; border: string; desc: string } {
  if (score <= 0.6) {
    return { 
      level: 1, 
      name: "Nível 1 — Inicial", 
      color: "text-red-700", 
      bg: "bg-red-50/70 text-red-700 border-red-200", 
      border: "border-red-200",
      desc: "Processos inexistentes ou ad hoc" 
    };
  }
  if (score <= 1.2) {
    return { 
      level: 2, 
      name: "Nível 2 — Básico", 
      color: "text-orange-700", 
      bg: "bg-orange-50/70 text-orange-700 border-orange-200", 
      border: "border-orange-200",
      desc: "Algumas iniciativas estruturadas" 
    };
  }
  if (score <= 1.8) {
    return { 
      level: 3, 
      name: "Nível 3 — Definido", 
      color: "text-amber-700", 
      bg: "bg-amber-50/70 text-amber-700 border-amber-200", 
      border: "border-amber-200",
      desc: "Processos documentados e robustos" 
    };
  }
  if (score <= 2.4) {
    return { 
      level: 4, 
      name: "Nível 4 — Gerenciado", 
      color: "text-indigo-700", 
      bg: "bg-indigo-50/70 text-indigo-700 border-indigo-200", 
      border: "border-indigo-200",
      desc: "Métricas avançadas e automação" 
    };
  }
  return { 
    level: 5, 
    name: "Nível 5 — Otimizado", 
    color: "text-emerald-700", 
    bg: "bg-emerald-50/70 text-emerald-700 border-emerald-200", 
    border: "border-emerald-200",
    desc: "IA integrada estrategicamente" 
  };
}

interface ClassroomAnswer {
  questionId: string;
  score: number;
  updatedAt: string;
}

interface CompanyState {
  id: string;
  name: string;
  industry: string;
  answers: Record<string, ClassroomAnswer>;
}

interface ClassroomState {
  active: boolean;
  companies: CompanyState[];
  logs: Array<{
    id: string;
    timestamp: string;
    message: string;
    companyId: string;
  }>;
}

interface ClassroomModeProps {
  initialGroupId: string | null;
}

export default function ClassroomMode({ initialGroupId }: ClassroomModeProps) {
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(initialGroupId);
  const [classroomState, setClassroomState] = useState<ClassroomState>({
    active: true,
    companies: [],
    logs: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState<Record<string, boolean>>({});
  const [activeSetupTab, setActiveSetupTab] = useState(false);

  // Check if we are in mobile/student simulator view
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("companyId") || params.get("groupId") || initialGroupId;
  });

  // Choose between 1, 2, or 3 companies
  const [companyCount, setCompanyCount] = useState<number>(3);

  // Quick edit names of the companies
  const [companyInputs, setCompanyInputs] = useState<string[]>([
    "Empresa Alfa",
    "Empresa Beta",
    "Empresa Gama"
  ]);

  const [isFormInitialized, setIsFormInitialized] = useState(false);

  // Mobile Responder Active Dimension
  const [studentDimId, setStudentDimId] = useState<number>(1);

  // Polling for real-time multiplayer updates from student inputs
  useEffect(() => {
    fetchClassroomState();
    const interval = setInterval(() => {
      fetchClassroomState(false);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Set company input values when classroom state loads initially, preventing polling resets
  useEffect(() => {
    if (!isFormInitialized && classroomState.companies && classroomState.companies.length > 0) {
      setCompanyInputs(classroomState.companies.map(c => c.name));
      setCompanyCount(classroomState.companies.length);
      setIsFormInitialized(true);
    }
  }, [classroomState.companies, isFormInitialized]);

  const fetchClassroomState = async (showLoader = true) => {
    try {
      if (showLoader) setIsLoading(true);
      const res = await fetch("/api/classroom/state");
      const data = await res.json();
      if (data && Array.isArray(data.companies)) {
        setClassroomState(data);
      }
    } catch (err) {
      console.error("Erro ao sincronizar dados do servidor:", err);
    } finally {
      if (showLoader) setIsLoading(false);
    }
  };

  const handleStartDynamic = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const slicedInputs = companyInputs.slice(0, companyCount);
      const filteredNames = slicedInputs.filter(n => n.trim() !== "");
      if (filteredNames.length === 0) {
        alert("Por favor, adicione pelo menos uma empresa.");
        setIsLoading(false);
        return;
      }
      const res = await fetch("/api/classroom/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyNames: filteredNames })
      });
      const data = await res.json();
      if (data.success) {
        setClassroomState(data.state);
        setCompanyInputs(data.state.companies.map((c: any) => c.name));
        setCompanyCount(data.state.companies.length);
        setActiveSetupTab(false);
      }
    } catch (err) {
      alert("Erro ao configurar as empresas.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAnswers = async () => {
    if (window.confirm("Deseja apagar permanentemente todas as respostas registradas de todas as empresas? Isso resetará todos os scores para 0%.")) {
      try {
        setIsLoading(true);
        const res = await fetch("/api/classroom/reset", { method: "POST" });
        const data = await res.json();
        if (data.success) {
          setClassroomState(data.state);
        }
      } catch (err) {
        console.error("Erro ao apagar respostas:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleStudentAnswer = async (companyId: string, questionId: string, score: number) => {
    // Optimistic local state update for zero latency
    setClassroomState(prev => {
      const updatedCompanies = prev.companies.map(comp => {
        if (comp.id === companyId) {
          return {
            ...comp,
            answers: {
              ...comp.answers,
              [questionId]: { questionId, score, updatedAt: new Date().toISOString() }
            }
          };
        }
        return comp;
      });
      return { ...prev, companies: updatedCompanies };
    });

    try {
      await fetch("/api/classroom/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, questionId, score })
      });
    } catch (err) {
      console.error("Erro ao registrar resposta:", err);
    }
  };

  const handleEnterMobileMode = (companyId: string) => {
    setActiveCompanyId(companyId);
    window.history.pushState({}, '', `${window.location.pathname}?companyId=${companyId}`);
  };

  const handleToggleSetupTab = () => {
    if (!activeSetupTab) {
      // Sync form with latest saved companies from classroomState when opening
      setCompanyInputs(classroomState.companies.map(c => c.name));
      setCompanyCount(classroomState.companies.length);
    }
    setActiveSetupTab(!activeSetupTab);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setIsCopied(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const getCompanyLink = (companyId: string) => {
    const origin = window.location.origin;

    // Normaliza o path eliminando referências redundantes a arquivos estáticos
    let pathname = window.location.pathname;
    if (pathname.endsWith("index.html")) {
      pathname = pathname.replace("index.html", "");
    }

    return `${origin}${pathname}?companyId=${companyId}`;
  };

  const mapToAnswerFormat = (answers: Record<string, ClassroomAnswer>): Record<string, Answer> => {
    const r: Record<string, Answer> = {};
    Object.entries(answers).forEach(([qId, val]) => {
      r[qId] = {
        questionId: val.questionId,
        score: val.score,
        updatedAt: val.updatedAt,
        updatedBy: "Aluno"
      };
    });
    return r;
  };

  const totalQuestions = QUESTIONS.length; // 46

  // Loading or empty state guard
  if (classroomState.companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] space-y-4 bg-white p-8 rounded-2xl border border-slate-200 shadow-xs max-w-md mx-auto mt-10">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-700">Sincronizando ambiente empresarial...</p>
        <p className="text-xs text-slate-400 text-center">Conectando ao comitê de governança e preparando os painéis.</p>
      </div>
    );
  }

  // Detect which view to render reactively from state
  const isMobileSession = activeCompanyId !== null;
  const currentActiveCompanyId = activeCompanyId;

  // -------------------------------------------------------------
  // STUDENT MOBILE RESPONDER SCREEN
  // -------------------------------------------------------------
  if (isMobileSession && currentActiveCompanyId) {
    const activeCompany = classroomState.companies.find(c => c.id === currentActiveCompanyId) || classroomState.companies[0];
    const answeredCount = Object.keys(activeCompany.answers).length;
    const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

    const activeDim = DIMENSIONS.find(d => d.id === studentDimId) || DIMENSIONS[0];
    const activeQuestions = QUESTIONS.filter(q => q.dimensionId === studentDimId);

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between" id="student-view-container">
        {/* Mobile Header Bar */}
        <header className="bg-white border-b border-slate-200 py-3 px-4 sticky top-0 z-10 shadow-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-blue-600 text-white">
              <Smartphone className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">AVALIAÇÃO COLETIVA</span>
              <span className="text-sm font-bold text-slate-900">{activeCompany.name}</span>
            </div>
          </div>

          <button 
            onClick={() => {
              if (window.confirm("Deseja voltar para a tela principal?")) {
                setActiveCompanyId(null);
                const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                window.history.pushState({ path: cleanUrl }, '', cleanUrl);
              }
            }}
            className="text-xs text-slate-500 hover:text-slate-800 border border-slate-200 px-3 py-1.5 rounded-lg bg-slate-100 font-semibold cursor-pointer"
          >
            Sair
          </button>
        </header>

        {/* Real-time Progress Band */}
        <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between shadow-sm select-none">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-90 block">Progresso em Tempo Real</span>
            <span className="text-xl font-bold">{progressPercent}% Concluído</span>
          </div>
          <span className="text-xs bg-blue-700/80 px-2.5 py-1 rounded-full font-mono font-semibold">
            {answeredCount} / {totalQuestions} Respostas
          </span>
        </div>

        {/* Horizontal Scrollable Dimensions Tabs */}
        <div className="bg-white border-b border-slate-200 overflow-x-auto flex px-2.5 py-2 sticky top-[57px] z-10 scrollbar-none gap-2">
          {DIMENSIONS.map((dim) => {
            const countInDim = QUESTIONS.filter(q => q.dimensionId === dim.id).length;
            const countDone = QUESTIONS.filter(q => q.dimensionId === dim.id)
              .filter(q => !!activeCompany.answers[q.id]).length;
            const hasCompletedDim = countDone === countInDim;

            const isActive = dim.id === studentDimId;
            return (
              <button
                key={dim.id}
                onClick={() => setStudentDimId(dim.id)}
                className={`py-2 px-4 rounded-full text-xs font-semibold flex items-center space-x-1.5 shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md scale-102"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <span>D{dim.id} - {dim.name.split(" ")[0]}</span>
                {hasCompletedDim ? (
                  <CheckCircle className="w-4 h-4 text-white bg-green-500 rounded-full" />
                ) : countDone > 0 ? (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? "bg-blue-700 text-white" : "bg-slate-200 text-slate-700"}`}>
                    {countDone}/{countInDim}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Main Questionnaire Box */}
        <div className="flex-1 max-w-lg mx-auto w-full px-4 py-6 space-y-6">
          {/* Active Dimension Header */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-xl select-none pointer-events-none"></div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest font-mono">Dimensão {activeDim.id} de 8</span>
            <h2 className="text-base font-bold text-slate-900 mt-1 leading-snug">{activeDim.name}</h2>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-normal">{activeDim.description}</p>
          </div>

          {/* List of Questions in Active Dimension */}
          <div className="space-y-4">
            {activeQuestions.map((q) => {
              const currentScore = activeCompany.answers[q.id]?.score;
              const hasAnswered = currentScore !== undefined;

              return (
                <div 
                  key={q.id} 
                  className={`p-4 bg-white rounded-xl border transition-all shadow-xs ${
                    hasAnswered 
                      ? "border-blue-300 bg-blue-50/5 ring-1 ring-blue-100"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded leading-none ${hasAnswered ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500"}`}>
                      {q.id}
                    </span>
                    <span className="text-[9.5px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                      Nível Alvo: N{q.level}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Peso: {q.weight}</span>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-900 mt-2.5 leading-snug">{q.text}</h3>
                  {q.description && (
                    <p className="text-[11px] text-slate-500 leading-normal mt-1.5 font-normal italic">
                      {q.description}
                    </p>
                  )}

                  {/* Options (0 to 3) */}
                  <div className="mt-4 grid grid-cols-2 gap-2" id={`radio-opts-${q.id}`}>
                    {[
                      { value: 0, label: "Não Existe", desc: "Processo inexistente ou experimental" },
                      { value: 1, label: "Parcial", desc: "Alguns controles, mas informal" },
                      { value: 2, label: "Implementado", desc: "Oficializado e praticado" },
                      { value: 3, label: "Otimizado", desc: "Continuamente auditado e melhorado" }
                    ].map((opt) => {
                      const isSelected = currentScore === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => handleStudentAnswer(activeCompany.id, q.id, opt.value)}
                          className={`min-h-[50px] flex flex-col justify-center items-center px-3 py-2 rounded-xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? "bg-blue-600 border-blue-600 text-white shadow-sm font-bold scale-102"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <span className="text-xs font-bold leading-none">{opt.value}</span>
                          <span className={`text-[9.5px] mt-1 font-medium leading-none ${isSelected ? "text-white opacity-95" : "text-slate-500"}`}>
                            {opt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Dimensions Navigator */}
          <div className="flex items-center justify-between pt-4 pb-8 select-none">
            <button
              disabled={studentDimId === 1}
              onClick={() => setStudentDimId(prev => Math.max(1, prev - 1))}
              className="py-2.5 px-4 text-xs text-slate-600 border border-slate-200 bg-white rounded-xl font-semibold flex items-center space-x-1.5 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Dimensão Anterior</span>
            </button>

            <span className="text-xs font-bold text-slate-400 font-mono">
              {studentDimId} / 8
            </span>

            <button
              disabled={studentDimId === 8}
              onClick={() => setStudentDimId(prev => Math.min(8, prev + 1))}
              className="py-2.5 px-4 text-xs text-slate-600 border border-slate-200 bg-white rounded-xl font-semibold flex items-center space-x-1.5 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
            >
              <span>Próxima Dimensão</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer info badge */}
        <footer className="bg-white border-t border-slate-200 py-3.5 text-center text-[10.5px] text-slate-400 sticky bottom-0 z-10 select-none">
          Plataforma de Avaliação de IA • Insper Tech Labs
        </footer>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MASTER PROFESSOR / PROJECTOR DASHBOARD VIEW (MAIN PAGE)
  // -------------------------------------------------------------
  return (
    <div className="space-y-6 font-sans">
      {/* Visual Header Block */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 select-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] pointer-events-none"></div>
        <div className="space-y-1 relative z-10">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 rounded text-[9px] font-mono font-bold text-blue-600 uppercase tracking-widest">
              Ambiente Colaborativo
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] text-emerald-600 font-mono">Sincronização Ativa</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
            Painel Comparativo de Maturidade em IA
          </h1>
          <p className="text-xs lg:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Monitore, crie e confronte a aderência e a segurança de até 3 empresas em tempo real. As equipes podem escanear os QR codes com seus celulares para preencher os questionários do comitê de governança corporativa simultaneamente.
          </p>
        </div>

        {/* Controls block */}
        <div className="shrink-0 flex items-center gap-3 relative z-10 font-sans">
          <button
            onClick={handleToggleSetupTab}
            className="flex items-center space-x-2 border border-slate-200 bg-white hover:bg-slate-50 font-bold px-4 py-2.5 rounded-xl text-xs text-slate-700 transition-all cursor-pointer shadow-xs"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Configurar Empresas ({classroomState.companies.length})</span>
          </button>

          <button
            onClick={handleResetAnswers}
            className="flex items-center space-x-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
            title="Resetar todos os dados"
          >
            <Trash2 className="w-4 h-4" />
            <span>Apagar Todas as Respostas</span>
          </button>
        </div>
      </div>

      {/* Setup Form Drawer Panel */}
      {activeSetupTab && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-150 pb-3">
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-800">Definição do Cenário Empresarial</h2>
            </div>
            <button 
              onClick={() => setActiveSetupTab(false)}
              className="text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer"
            >
              Fechar Painel ✕
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Configure abaixo a quantidade e os nomes das empresas que participarão da dinâmica de maturidade em IA. Você pode definir de 1 a 3 empresas simultaneamente.
          </p>

          <div className="space-y-4">
            {/* Quantity Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                Quantidade de Empresas Ativas:
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCompanyCount(num)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      companyCount === num
                        ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {num} {num === 1 ? "Empresa" : "Empresas"}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleStartDynamic} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: companyCount }).map((_, idx) => (
                  <div key={idx} className="space-y-1 animate-fade-in">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      <span>Nome da Empresa {idx + 1}</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={companyInputs[idx] || ""}
                      onChange={(e) => {
                        const updated = [...companyInputs];
                        updated[idx] = e.target.value;
                        setCompanyInputs(updated);
                      }}
                      placeholder={`Digite o nome da Empresa ${idx + 1}`}
                      className="w-full px-3.5 py-2.5 text-xs text-slate-800 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-semibold"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setCompanyCount(3);
                    setCompanyInputs(["Empresa Alfa", "Empresa Beta", "Empresa Gama"]);
                  }}
                  className="px-4 py-2 hover:bg-slate-100 text-slate-500 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Resetar Padrão
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4.5 py-2 rounded-xl transition-all cursor-pointer shadow-sm flex items-center space-x-1.5"
                >
                  <span>Aplicar Configurações</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dynamic Grid of Enterprise Maturity Cards */}
      <div className={`grid grid-cols-1 ${
        classroomState.companies.length === 1 
          ? "max-w-md mx-auto" 
          : classroomState.companies.length === 2 
          ? "md:grid-cols-2 max-w-5xl mx-auto" 
          : "lg:grid-cols-3"
      } gap-6 font-sans`}>
        {classroomState.companies.map((company, index) => {
          const answers = mapToAnswerFormat(company.answers);
          const scores = calculateAssessmentScores(answers);
          const currentMat = getMaturityDetailsForScore(scores.scoreGeral);

          const totalDimQuestions = QUESTIONS.length;
          const totalAnswered = Object.keys(company.answers).length;
          const pctAnswered = Math.round((totalAnswered / totalDimQuestions) * 100);

          const cardStyles = [
            { accent: "border-t-4 border-t-blue-600", dot: "bg-blue-600", bgLight: "bg-blue-500/5", ring: "ring-blue-100" },
            { accent: "border-t-4 border-t-emerald-600", dot: "bg-emerald-600", bgLight: "bg-emerald-500/5", ring: "ring-emerald-100" },
            { accent: "border-t-4 border-t-purple-600", dot: "bg-purple-600", bgLight: "bg-purple-500/5", ring: "ring-purple-100" }
          ];
          const style = cardStyles[index % cardStyles.length];

          const mobLink = getCompanyLink(company.id);

          return (
            <div 
              key={company.id} 
              className={`bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden flex flex-col justify-between ${style.accent}`}
            >
              {/* Card top branding */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`}></span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Empresa {index + 1}</span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight leading-none">{company.name}</h2>
                    <p className="text-[10px] text-slate-400 font-mono uppercase">{company.industry}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono block">Mergulhar</span>
                    <button 
                      onClick={() => handleEnterMobileMode(company.id)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer underline flex items-center space-x-0.5 mt-0.5"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Responder Celular</span>
                    </button>
                  </div>
                </div>

                {/* Score Circular Visualizer */}
                <div className="py-4 flex justify-between items-center rounded-xl px-4 bg-slate-50 border border-slate-100 relative">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-mono">Maturidade IA</span>
                    <span className="text-3xl font-black text-slate-800">{scores.scoreGeral}</span>
                    <span className="text-xs font-semibold text-slate-400">/100</span>
                  </div>

                  <div className="text-right">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-mono leading-none border font-extrabold uppercase inline-block ${currentMat.color} ${currentMat.bg} ${currentMat.border}`}>
                      {currentMat.name}
                    </span>
                  </div>
                </div>

                {/* Bullets describing corporate status based on actual criteria */}
                <div className="space-y-1 px-1">
                  <span className="text-[10.5px] uppercase font-bold tracking-wider text-slate-400 font-mono">Situação Geral da IA</span>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                    {currentMat.bullets.map((b, i) => (
                      <li key={i} className="leading-tight font-medium">
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sub-grid of GRC metric scores */}
                <div className="grid grid-cols-3 gap-2.5 pt-1 select-none">
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-center">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono leading-none mb-1">Governança</span>
                    <span className="text-sm font-bold text-slate-700">{scores.governanceScore}%</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-center">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono leading-none mb-1">Mitigação</span>
                    <span className="text-sm font-bold text-red-600">{scores.riskScore}%</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-center">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono leading-none mb-1">Compliance</span>
                    <span className="text-sm font-bold text-slate-700">{scores.complianceScore}%</span>
                  </div>
                </div>
              </div>

              {/* QR and share codes for cell phone scans */}
              <div className="border-t border-slate-150 pt-4 mt-4 space-y-3">
                <div className="flex items-center space-x-3.5 bg-slate-50 rounded-xl p-2.5 border border-slate-150 relative">
                  <div className="w-14 h-14 bg-white border border-slate-200 rounded flex items-center justify-center p-1 shrink-0 shadow-2xs">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(mobLink)}`}
                      alt="QR Code"
                      referrerPolicy="no-referrer"
                      className="w-full h-full select-none"
                    />
                  </div>

                  <div className="flex-1 text-left min-w-0">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono leading-none mb-1">Celular ou Scanner</span>
                    <span className="text-[11px] text-slate-600 font-medium block truncate">Escaneie o QR Code para responder</span>
                    
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2">
                      <button 
                        onClick={() => copyToClipboard(mobLink, company.id)}
                        className="text-[10px] text-blue-600 hover:text-blue-800 font-bold flex items-center space-x-0.5 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{isCopied[company.id] ? "Copiado!" : "Copiar Link"}</span>
                      </button>

                      <a 
                        href={mobLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-blue-600 hover:text-blue-800 font-bold flex items-center space-x-0.5"
                        title="Abrir o link público de simulação em uma nova aba para testar pelo navegador"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Abrir Link</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Additional Simulator Option for Desktop testing */}
                <div className="flex items-center justify-between text-[11px] px-1 bg-blue-50/50 border border-blue-100/70 rounded-lg p-2">
                  <span className="text-slate-500 font-medium">Não consegue escanear?</span>
                  <button 
                    onClick={() => handleEnterMobileMode(company.id)}
                    className="text-[10px] bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-md transition-all cursor-pointer flex items-center space-x-1"
                  >
                    <Smartphone className="w-3 h-3" />
                    <span>Testar nesta Tela</span>
                  </button>
                </div>

                {/* Progress bar info */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 font-mono">
                    <span>Respondido</span>
                    <span>{totalAnswered} / {totalQuestions} perguntas ({pctAnswered}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-150">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${style.dot}`} 
                      style={{ width: `${pctAnswered}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Side-by-Side Dimension Maturity Levels Comparisons */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs font-sans">
        <div className="flex items-center justify-between border-b border-slate-150 pb-3 mb-4 select-none">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-800">Maturidade de Cada Dimensão (Mapeamento 1 a 5)</h2>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Visualização Detalhada por Bloco Corporativo</span>
        </div>

        <div className="space-y-5">
          {DIMENSIONS.map((dim) => {
            const dimQuestions = QUESTIONS.filter(q => q.dimensionId === dim.id);
            const countInDim = dimQuestions.length;

            return (
              <div 
                key={dim.id} 
                className="grid grid-cols-1 md:grid-cols-12 gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0 relative hover:bg-slate-50/40 p-2 rounded-xl transition-all"
              >
                {/* ID and Name descriptor */}
                <div className="md:col-span-3 flex flex-col justify-center">
                  <span className="text-[9.5px] font-bold text-blue-600 uppercase tracking-widest font-mono">Dimensão {dim.id}</span>
                  <h3 className="text-xs font-extrabold text-slate-800 leading-snug">{dim.name}</h3>
                  <span className="text-[10px] text-slate-400 leading-tight block mt-0.5 italic">{dim.focus}</span>
                </div>

                {/* Side-by-Side comparative grades of the companies */}
                <div className={`md:col-span-9 grid grid-cols-1 ${
                  classroomState.companies.length === 1 
                    ? "md:grid-cols-1" 
                    : classroomState.companies.length === 2 
                    ? "md:grid-cols-2" 
                    : "md:grid-cols-3"
                } gap-3.5`}>
                  {classroomState.companies.map((company) => {
                    // Extract answers for this dimension
                    const compDimAnswers = dimQuestions.map(q => company.answers[q.id]?.score ?? 0);
                    const avgScore = compDimAnswers.length > 0
                      ? Number((compDimAnswers.reduce((a, b) => a + b, 0) / compDimAnswers.length).toFixed(2))
                      : 0;

                    const match = getMaturityDetailsForDimensionScore(avgScore);
                    const completedCount = dimQuestions.filter(q => !!company.answers[q.id]).length;

                    return (
                      <div 
                        key={company.id} 
                        className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-600 truncate max-w-[120px]">{company.name}</span>
                          <span className="text-[8.5px] font-mono text-slate-400 font-semibold">{completedCount}/{countInDim} resp</span>
                        </div>

                        <div className="mt-2 text-left">
                          <span className="text-sm font-bold text-slate-800">{avgScore.toFixed(2)}</span>
                          <span className="text-[10px] text-slate-400"> / 3.00</span>
                        </div>

                        {/* Translated Level Badge */}
                        <div className="mt-1.5 flex items-center justify-between text-[10px]">
                          <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-mono font-bold uppercase ${match.bg}`}>
                            {match.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Activity Logs Feed */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs font-sans">
        <div className="flex items-center justify-between border-b border-slate-150 pb-3 mb-4 select-none">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-800">Atividades e Respostas Recentes (Celulares)</h2>
          </div>
          <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-mono">Monitor de Sessão</span>
        </div>

        {classroomState.logs.length === 0 ? (
          <div className="text-center py-6">
            <span className="text-xs text-slate-400 block font-medium">Nenhum evento registrado ainda. Aguardando novos formulários de celulares.</span>
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {classroomState.logs.map((log) => {
              const company = classroomState.companies.find(c => c.id === log.companyId);
              return (
                <div 
                  key={log.id} 
                  className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-150 text-xs gap-3"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                    <span className="font-mono text-[9px] text-slate-400 uppercase leading-none">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                    <span className="text-slate-700 font-medium truncate">{log.message}</span>
                  </div>

                  {company && (
                    <span className="shrink-0 px-2 py-0.5 bg-slate-200 text-slate-600 rounded text-[9px] font-mono font-bold uppercase select-none">
                      {company.name}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
