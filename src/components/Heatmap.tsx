import React, { useState } from "react";
import { DIMENSIONS, QUESTIONS } from "../data/questions";
import { Answer } from "../types";
import { ShieldAlert } from "lucide-react";

interface HeatmapProps {
  answers: Record<string, Answer>;
}

export default function Heatmap({ answers }: HeatmapProps) {
  const [selectedCell, setSelectedCell] = useState<{
    dimensionId: number;
    criticality: "Crítica" | "Alta" | "Média" | "Baixa";
    questions: typeof QUESTIONS;
  } | null>(null);

  const criticalities: Array<"Crítica" | "Alta" | "Média" | "Baixa"> = ["Crítica", "Alta", "Média", "Baixa"];

  const getCellStats = (dimId: number, crit: "Crítica" | "Alta" | "Média" | "Baixa") => {
    // Fill questions matching dimension and criticality
    const cellQuestions = QUESTIONS.filter((q) => q.dimensionId === dimId && q.criticality === crit);

    if (cellQuestions.length === 0) {
      return { count: 0, avgScore: -1, colorClass: "bg-slate-50 text-slate-300 border-slate-100" };
    }

    let totalScore = 0;
    let answeredCount = 0;

    cellQuestions.forEach((q) => {
      const ans = answers[q.id];
      const score = ans ? ans.score : 0; // Default to 0 if unanswered
      totalScore += score;
      answeredCount++;
    });

    const avgScore = answeredCount > 0 ? totalScore / answeredCount : 0;

    // Soft thematic colors for high visibility in classrooms & projectors
    let colorClass = "";
    if (avgScore < 1.0) {
      // Light Red/Crimson
      colorClass = "bg-red-50 text-red-700 hover:bg-red-100 border-red-200/80 shadow-xs";
    } else if (avgScore < 2.0) {
      // Light Amber/Gold
      colorClass = "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200/80 shadow-xs";
    } else {
      // Light Emerald
      colorClass = "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200/80 shadow-xs";
    }

    return {
      count: cellQuestions.length,
      avgScore,
      colorClass,
      questions: cellQuestions,
    };
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs transition-all h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <h3 className="font-display font-medium text-sm lg:text-base text-slate-900 uppercase tracking-tight">
              Matriz Heatmap de Riscos Corporativos
            </h3>
          </div>
          <div className="flex items-center space-x-3 text-[10px] font-mono">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded bg-red-50 border border-red-200 inline-block"></span>
              <span className="text-slate-500">Alto Risco (&lt;1.0)</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded bg-amber-50 border border-amber-200 inline-block"></span>
              <span className="text-slate-500">Médio (1.0 - 2.0)</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded bg-emerald-50 border border-emerald-200 inline-block"></span>
              <span className="text-slate-500">Mitigado (&ge;2.0)</span>
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          Esta matriz cruza as 8 dimensões transversais com os graus de importância e criticidade regulatória. Clique em uma célula ativa para abrir a lista detalhada de controles correspondentes.
        </p>

        {/* Matrix Grid Board */}
        <div className="overflow-x-auto">
          <div className="min-w-[600px] grid grid-cols-5 gap-1.5 font-sans">
            {/* Header row */}
            <div className="text-left text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 py-1 pl-1">
              Dimensões Framework
            </div>
            {criticalities.map((crit) => (
              <div
                key={crit}
                className="text-center text-[10px] uppercase font-mono font-bold tracking-wider text-slate-600 py-1 bg-slate-100 rounded border border-slate-200"
              >
                {crit}
              </div>
            ))}

            {/* Matrix Data Rows */}
            {DIMENSIONS.map((dim) => (
              <React.Fragment key={`row-${dim.id}`}>
                {/* Row Header */}
                <div className="flex flex-col justify-center text-left py-1.5 pl-2 rounded bg-slate-50 border border-slate-200 text-slate-700">
                  <span className="text-[10px] font-mono font-bold text-blue-600 leading-none">DIM {dim.id}</span>
                  <span className="text-xs font-medium truncate mt-1 max-w-[130px] lg:max-w-[170px]" title={dim.name}>
                    {dim.name.split(" — ").pop() || dim.name}
                  </span>
                </div>

                {/* Grid Cells */}
                {criticalities.map((crit) => {
                  const stats = getCellStats(dim.id, crit);
                  const isInteractive = stats.count > 0;
                  return (
                    <button
                      key={`${dim.id}-${crit}`}
                      disabled={!isInteractive}
                      onClick={() =>
                        setSelectedCell({
                          dimensionId: dim.id,
                          criticality: crit,
                          questions: stats.questions || [],
                        })
                      }
                      className={`h-11 rounded border text-center flex flex-col items-center justify-center transition-all ${
                        stats.colorClass
                      } ${
                        isInteractive
                          ? "cursor-pointer active:scale-95 group relative"
                          : "cursor-not-allowed opacity-55"
                      }`}
                    >
                      {isInteractive ? (
                        <>
                          <span className="text-sm font-mono font-bold">{stats.count}</span>
                          <span className="text-[8px] font-mono opacity-80 mt-0.5">
                            Nota: {stats.avgScore.toFixed(1)}
                          </span>
                        </>
                      ) : (
                        <span className="text-[9px] font-mono text-slate-300">-</span>
                      )}
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Cell Inspect Modal / Panel */}
      {selectedCell && (
        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm relative animate-fade-in">
          <button
            onClick={() => setSelectedCell(null)}
            className="absolute top-2 right-2 text-slate-500 hover:text-slate-900 text-xs font-mono bg-white px-2 py-0.5 rounded border border-slate-200 cursor-pointer"
          >
            Fechar
          </button>

          <div className="flex items-center space-x-2 mb-2">
            <span className="px-2 py-0.5 text-[9px] font-mono font-semibold uppercase rounded bg-[#EBF5FF] text-blue-700 border border-blue-200">
              Dimensão {selectedCell.dimensionId}
            </span>
            <span className="px-2 py-0.5 text-[9px] font-mono font-semibold uppercase rounded bg-red-50 text-red-700 border border-red-200">
              {selectedCell.criticality}
            </span>
          </div>

          <h4 className="text-xs font-display font-bold text-slate-800 mb-3">
            Inspecionando {selectedCell.questions.length} Controles Ativos nesta interseção
          </h4>

          <div className="space-y-2.5 max-h-[170px] overflow-y-auto pr-1">
            {selectedCell.questions.map((q) => {
              const ans = answers[q.id];
              const score = ans ? ans.score : 0;
              const names = ["Não Existe", "Parcial/Iniciado", "Implementado", "Maduro/Otimizado"];
              const scoreColors = [
                "text-red-700 bg-red-50 border-red-200",
                "text-amber-700 bg-amber-50 border-amber-200",
                "text-emerald-700 bg-emerald-50 border-emerald-200",
                "text-sky-700 bg-sky-50 border-sky-200",
              ];

              return (
                <div
                  key={q.id}
                  className="p-2.5 rounded-xl bg-white border border-slate-200 flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <span className="text-xs font-sans font-medium text-slate-700">
                      <span className="font-mono text-blue-600 mr-1.5 font-bold">{q.id}</span>
                      {q.text}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded border whitespace-nowrap ${
                        scoreColors[score] || "text-slate-400"
                      }`}
                    >
                      {names[score]} ({score}/3)
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-mono text-slate-400">
                    <span>Framework: {q.framework}</span>
                    <span>Peso de Scoring: {q.weight}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
