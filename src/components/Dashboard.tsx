import React from "react";
import { MaturityScore, Organization } from "../types";
import RadarChart from "./RadarChart";
import Heatmap from "./Heatmap";
import { Answer } from "../types";
import { DIMENSIONS } from "../data/questions";
import { getMaturityDetailsForScore, MATURITY_LEVELS } from "../utils/maturityHelper";
import {
  TrendingUp,
  ShieldCheck,
  Percent,
  CheckCircle,
  Building,
  Activity,
  Award,
  BookOpen,
  Info,
  CalendarCheck,
  Compass,
  ArrowUpRight,
  AlertTriangle,
  Flame,
  Plus
} from "lucide-react";

interface DashboardProps {
  scores: MaturityScore;
  organization: Organization;
  answers: Record<string, Answer>;
}

export default function Dashboard({ scores, organization, answers }: DashboardProps) {
  // Calculador de estatísticas 100% REAIS com base nas respostas dadas de verdade
  const totalAnswersCount = Object.keys(answers).length;
  const count0 = Object.values(answers).filter(a => a.score === 0).length;
  const count1 = Object.values(answers).filter(a => a.score === 1).length;
  const count2 = Object.values(answers).filter(a => a.score === 2).length;
  const count3 = Object.values(answers).filter(a => a.score === 3).length;

  const pct0 = totalAnswersCount > 0 ? Math.round((count0 / totalAnswersCount) * 100) : 0;
  const pct1 = totalAnswersCount > 0 ? Math.round((count1 / totalAnswersCount) * 100) : 0;
  const pct2 = totalAnswersCount > 0 ? Math.round((count2 / totalAnswersCount) * 100) : 0;
  const pct3 = totalAnswersCount > 0 ? Math.round((count3 / totalAnswersCount) * 100) : 0;

  // Mapeamento automático de Fortalezas e Prioridades Reais por Dimensão (Zero Fake)
  const dimDetails = DIMENSIONS.map(dim => {
    const rawScore = scores.scoresPorDimensao[dim.id] || 0;
    return {
      ...dim,
      score: rawScore,
      percentage: Math.round((rawScore / 3) * 100)
    };
  });

  const sortedFortalezas = [...dimDetails].sort((a, b) => b.score - a.score);
  const sortedLacunas = [...dimDetails].sort((a, b) => a.score - b.score);

  const currentMat = getMaturityDetailsForScore(scores.scoreGeral);

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Header Metrics Grid - 5 key Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 select-none">
        {/* KPI 1: SCORE GERAL */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col justify-between relative overflow-hidden group shadow-xs">
          <div className="absolute top-1.5 right-1.5 rounded bg-slate-100 px-1.5 py-0.5 text-[8.5px] font-mono text-blue-600 border border-slate-200">
            Nível Geral
          </div>
          <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold mb-1">Maturidade Geral</p>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-3xl font-display font-bold text-slate-800">{scores.scoreGeral}</span>
            <span className="text-xs text-slate-400">/100</span>
          </div>
          <div className="mt-2 text-[10px] flex items-center space-x-1.5">
            <span className={`px-1.5 py-0.5 rounded border text-[9px] font-mono font-bold uppercase ${currentMat.color} ${currentMat.bg} ${currentMat.border}`}>
              {currentMat.name}
            </span>
          </div>
        </div>

        {/* KPI 2: SCORE PONDERADO */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col justify-between relative overflow-hidden shadow-xs">
          <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold mb-1">Maturidade Ponderada</p>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-3xl font-display font-bold text-slate-800">{scores.scorePonderado}</span>
            <span className="text-xs text-slate-400">/100</span>
          </div>
          <div className="mt-3.5">
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
              <div className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${scores.scorePonderado}%` }}></div>
            </div>
          </div>
        </div>

        {/* KPI 3: RISK SCORE */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col justify-between shadow-xs">
          <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold mb-1">Mitigação de Risco</p>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-3xl font-display font-bold text-red-600">{scores.riskScore}</span>
            <span className="text-xs text-slate-400">/100</span>
          </div>
          <div className="mt-3.5">
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
              <div className="bg-red-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${scores.riskScore}%` }}></div>
            </div>
          </div>
        </div>

        {/* KPI 4: COMPLIANCE SCORE */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col justify-between shadow-xs">
          <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold mb-1">Compliance Legal</p>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-3xl font-display font-bold text-emerald-600">{scores.complianceScore}</span>
            <span className="text-xs text-slate-400">/100</span>
          </div>
          <div className="mt-3.5">
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${scores.complianceScore}%` }}></div>
            </div>
          </div>
        </div>

        {/* KPI 5: GOVERNANCE INDEX */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col justify-between shadow-xs">
          <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold mb-1">Índice Governança</p>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-3xl font-display font-bold text-blue-600">{scores.governanceScore}</span>
            <span className="text-xs text-slate-400">/100</span>
          </div>
          <div className="mt-3.5">
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
              <div className="bg-blue-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${scores.governanceScore}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Overview descriptive text & Real-time Maturity Levels Report */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-105 pb-4">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-2">
            <Award className="w-4 h-4 text-blue-600" />
            <span>Relatório de Maturidade Real (Empresa & Dimensões)</span>
          </h3>
          <p className="text-slate-500 text-[11px] leading-relaxed mt-1">
            Mapeamento dinâmico fundamentado exclusivamente nas respostas reais do seu diagnóstico, seguindo os requisitos e critérios oficiais para os níveis de maturidade de governança de IA.
          </p>
        </div>

        {/* Grid: Lado Esquerdo (Status União / Empresa), Lado Direito (8 Dimensões com seus níveis) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LADO ESQUERDO: Empresa Master Plan (Nível Geral) - ocupando 5/12 */}
          <div className="lg:col-span-5 p-5 rounded-xl border flex flex-col justify-between transition-all bg-slate-50/70 border-slate-205 relative overflow-hidden group shadow-2xs">
            <div className="space-y-4">
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold block leading-none">MATURIDADE DA EMPRESA</span>
              
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-sans tracking-tight">{organization.name}</h4>
                <div className="flex items-baseline space-x-1.5 mt-1.5">
                  <span className="text-2xl font-display font-black text-blue-600">{scores.scoreGeral}%</span>
                  <span className="text-slate-400 text-[10px] font-medium">pontuação geral de auditoria</span>
                </div>
              </div>

              {/* Status do nível atual com os bullets corretos do usuário */}
              <div className={`p-4 rounded-xl border ${currentMat.bg} ${currentMat.border} space-y-3`}>
                <div className="flex items-center justify-between">
                  <span className={`font-display font-extrabold text-sm ${currentMat.color}`}>
                    {currentMat.name}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] bg-slate-900 text-white font-mono font-bold leading-none">
                    ATUAL
                  </span>
                </div>
                
                <p className="text-[10.5px] text-slate-600 leading-normal font-medium">
                  Atributos de governança vigentes neste patamar estratégico:
                </p>

                <ul className="space-y-1.5 pt-1">
                  {currentMat.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start text-[11px] text-slate-700 leading-normal">
                      <span className="mr-2 text-blue-500 shrink-0 select-none">✔</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Linha cronológica intuitiva */}
            <div className="mt-5 border-t border-slate-200 pt-4 space-y-2 select-none">
              <span className="text-[9px] font-mono text-slate-400 uppercase font-bold tracking-wider block">Trilha de Evolução de IA Responsável</span>
              <div className="grid grid-cols-5 gap-1.5">
                {MATURITY_LEVELS.map((lvl) => {
                  const isActive = currentMat.level === lvl.level;
                  const isPassed = currentMat.level >= lvl.level;
                  return (
                    <div key={lvl.level} className="flex flex-col items-center">
                      <div className={`w-full h-1.5 rounded-full ${isActive ? 'bg-blue-600' : isPassed ? 'bg-blue-400' : 'bg-slate-200'}`}></div>
                      <span className={`text-[8.5px] font-mono mt-1 font-bold ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                        N{lvl.level}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* LADO DIREITO: 8 Dimensões em Grid (Duas colunas no MD) - ocupando 7/12 */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold block mb-2 leading-none">MATURIDADE DAS DIMENSÕES (D1 A D8)</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {dimDetails.map((dim) => {
                const dimMat = getMaturityDetailsForScore(dim.percentage);
                return (
                  <div key={dim.id} className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between space-y-2 relative shadow-3xs">
                    <div>
                      {/* Dim name */}
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-bold text-slate-800 font-sans line-clamp-1 truncate block max-w-[190px]" title={dim.name}>
                          D{dim.id}. {dim.name.split(" — ")[0]}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-500 leading-none shrink-0 ml-1.5">
                          {dim.score.toFixed(1)}/3
                        </span>
                      </div>

                      {/* Score line bar */}
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200 mt-2">
                        <div 
                          className="h-full rounded-full transition-all duration-300" 
                          style={{ 
                            width: `${dim.percentage}%`,
                            backgroundColor: dim.percentage <= 20 ? '#ef4444' : dim.percentage <= 40 ? '#f97316' : dim.percentage <= 60 ? '#f59e0b' : dim.percentage <= 80 ? '#6366f1' : '#10b981'
                          }}
                        ></div>
                      </div>

                      {/* Dimension level badge */}
                      <div className="flex items-center justify-between mt-3">
                        <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-mono font-bold border uppercase leading-none ${dimMat.color} ${dimMat.bg} ${dimMat.border}`}>
                          {dimMat.name} ({dim.percentage}%)
                        </span>
                      </div>
                    </div>

                    {/* Criteria bullet points list for this level in dimension (Compact) */}
                    <div className="bg-slate-50/70 p-2.5 rounded-lg border border-slate-100 mt-2 space-y-1 text-[9.5px]">
                      {dimMat.bullets.map((bullet, idx) => (
                        <div key={idx} className="flex items-center text-slate-600 gap-1.5 leading-tight">
                          <span className="text-blue-500 font-bold">•</span>
                          <span className="font-sans truncate max-w-[200px]" title={bullet}>{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* 2. Charts Layout (Radar + Heatmap risk) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left: Custom SVG Radar Chart */}
        <RadarChart scoresPorDimensao={scores.scoresPorDimensao} />

        {/* Right: Interactive Audit Heatmap */}
        <Heatmap answers={answers} />
      </div>

      {/* 3. Bottom Row Graph elements (Benchmarks and Temporal Evolution) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Real Response Distribution Tracker */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h4 className="font-display font-medium text-xs lg:text-sm text-slate-900 uppercase tracking-tight">Distribuição Pragmática de Respostas</h4>
            </div>
            <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
              {totalAnswersCount} de 46 Controles respondidos
            </span>
          </div>

          <div className="space-y-4 py-2">
            <div>
              <p className="text-slate-500 text-[11px] leading-relaxed mb-3">
                Proporção das respostas atribuídas aos controles avaliados na auditoria atual. Isso mapeia a maturidade geral em tempo real:
              </p>
              
              {/* Stacked segmented horizontal bar component */}
              <div className="w-full h-4 rounded-full overflow-hidden border border-slate-200 flex mb-4">
                <div className="bg-red-500 h-full transition-all duration-300" style={{ width: `${pct0}%` }} title={`Não Existe: ${pct0}%`}></div>
                <div className="bg-orange-500 h-full transition-all duration-300" style={{ width: `${pct1}%` }} title={`Parcial: ${pct1}%`}></div>
                <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${pct2}%` }} title={`Implementado: ${pct2}%`}></div>
                <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${pct3}%` }} title={`Otimizado: ${pct3}%`}></div>
              </div>
            </div>

            {/* Individual score metrics grid list */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                    <span className="w-2.5 h-2.5 rounded-sm bg-red-500 inline-block"></span>
                    Não Existe (0)
                  </span>
                  <span className="text-slate-950 font-mono font-bold">{count0}</span>
                </div>
                <div className="text-[10px] text-slate-400 text-right font-mono mt-0.5">{pct0}% das respostas</div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                    <span className="w-2.5 h-2.5 rounded-sm bg-orange-500 inline-block"></span>
                    Parcial (1)
                  </span>
                  <span className="text-slate-950 font-mono font-bold">{count1}</span>
                </div>
                <div className="text-[10px] text-slate-400 text-right font-mono mt-0.5">{pct1}% das respostas</div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                    <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block"></span>
                    Implementado (2)
                  </span>
                  <span className="text-slate-950 font-mono font-bold">{count2}</span>
                </div>
                <div className="text-[10px] text-slate-400 text-right font-mono mt-0.5">{pct2}% das respostas</div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span>
                    Otimizado (3)
                  </span>
                  <span className="text-slate-950 font-mono font-bold">{count3}</span>
                </div>
                <div className="text-[10px] text-slate-400 text-right font-mono mt-0.5">{pct3}% das respostas</div>
              </div>
            </div>
          </div>

          <div className="text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-100 select-none leading-none flex justify-between items-center">
            <span>Acurácia dos dados: 100% Real</span>
            <span>Mapeamento contínuo</span>
          </div>
        </div>

        {/* Real Strategic Priorities Planner based on Dim Scores */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-emerald-600" />
              <h4 className="font-display font-medium text-xs lg:text-sm text-slate-900 uppercase tracking-tight">Prioridades Estratégicas por Dimensão</h4>
            </div>
            <span className="text-[9px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-bold">Análise Algorítmica</span>
          </div>

          <div className="space-y-4">
            {/* Top Strengths block */}
            <div>
              <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase tracking-widest block mb-1.5">Fortalezas Corporativas (Maiores Notas)</span>
              <div className="space-y-2">
                {sortedFortalezas.slice(0, 2).map(dim => (
                  <div key={dim.id} className="flex items-center justify-between p-2 rounded bg-emerald-50/50 border border-emerald-100 text-xs">
                    <span className="text-slate-700 font-medium font-sans max-w-[210px] truncate">D{dim.id} - {dim.name}</span>
                    <span className="font-mono text-emerald-700 font-bold leading-none bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded text-[11px]">
                      {dim.score.toFixed(1)}/3 ({dim.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Critical Improvement opportunities block */}
            <div>
              <span className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest block mb-1.5">Lacunas de Governança (Foco no Plano de Ação)</span>
              <div className="space-y-2">
                {sortedLacunas.slice(0, 2).map(dim => (
                  <div key={dim.id} className="flex items-center justify-between p-2 rounded bg-red-50/50 border border-red-100 text-xs">
                    <span className="text-slate-700 font-medium font-sans max-w-[210px] truncate">D{dim.id} - {dim.name}</span>
                    <span className="font-mono text-red-700 font-bold leading-none bg-red-50 border border-red-200 px-1.5 py-0.5 rounded text-[11px]">
                      {dim.score.toFixed(1)}/3 ({dim.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-[10px] font-mono text-slate-400 pt-3 border-t border-slate-100 select-none leading-none flex justify-between items-center">
            <span>Diagnóstico baseado nas suas respostas reais</span>
            <span className="text-slate-500 font-semibold flex items-center gap-0.5">
              Reforçar controles ativos
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
