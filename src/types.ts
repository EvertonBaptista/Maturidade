export interface Organization {
  id: string;
  name: string;
  industry: string;
  size: "Média" | "Grande" | "Enterprise";
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "auditor" | "analista";
  organizationId: string;
}

export interface Dimension {
  id: number;
  name: string;
  description: string;
  focus: string;
}

export interface Question {
  id: string;
  dimensionId: number;
  text: string;
  weight: number;
  category: string;
  framework: string;         // e.g. "ISO 42001", "NIST AI RMF", "EU AI Act"
  criticality: "Crítica" | "Alta" | "Média" | "Baixa";
  level: number;             // Nível de maturidade alvo do controle (1-5)
  description?: string;      // Explicação detalhada do controle
}

export interface Answer {
  questionId: string;
  score: number;             // 0 | 1 | 2 | 3
  comment?: string;
  evidenceName?: string;
  evidenceSize?: string;
  updatedAt: string;
  updatedBy: string;
}

export interface MaturityScore {
  scoreGeral: number;        // 0-100
  scorePonderado: number;    // 0-100
  riskScore: number;         // 0-100 (higher means more risk or better risk control depending on convention, let's treat it as: Risk Mitigation Level 0-100 where higher is safer, or Risk Severity 0-100 where higher is dangerous. Let's calculate Risk Mitigation level, or Risk Exposure: 0-100, where 0 is minimum risk / maximum mitigation and 100 is max risk / zero mitigation)
  complianceScore: number;   // 0-100
  governanceScore: number;   // 0-100
  scoresPorDimensao: Record<number, number>; // dimension_id -> 0-100 or 0-3 average
}

export interface ActionPlanItem {
  id: string;
  title: string;
  dimensionId: number;
  priority: "Crítica" | "Alta" | "Média" | "Baixa";
  framework: string;
  action: string;
  owner?: string;
  dueDate?: string;
  status: "Pendente" | "Em Progresso" | "Concluído";
}

export interface AIAnalysis {
  resumoExecutivo: string;
  gapsIdentificados: string;
  quickWins: string;
  roadmapEvolutivo: string;
  controlesSugeridos: string;
  lastGenerated: string;
}

export interface Assessment {
  id: string;
  organizationId: string;
  title: string;
  status: "Em Progresso" | "Em Revisão" | "Concluído";
  answers: Record<string, Answer>;
  scores?: MaturityScore;
  aiAnalysis?: AIAnalysis;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  checklistComplete: boolean;
}

export interface AuditLog {
  id: string;
  organizationId: string;
  timestamp: string;
  userEmail: string;
  action: string;
  details: string;
  category: "assessment" | "security" | "tenant" | "api" | "sso";
}

export interface PublicKeyConfig {
  id: string;
  name: string;
  key: string;
  status: "Ativo" | "Inativo";
  createdAt: string;
}

export interface BenchmarkData {
  dimensionName: string;
  yourScore: number;
  marketAverage: number;
  topPerformers: number;
}
