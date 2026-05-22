import { QUESTIONS } from "../data/questions";
import { Answer, MaturityScore } from "../types";

export function calculateAssessmentScores(answers: Record<string, Answer>): MaturityScore {
  // Simple check
  if (QUESTIONS.length === 0) {
    return {
      scoreGeral: 0,
      scorePonderado: 0,
      riskScore: 0,
      complianceScore: 0,
      governanceScore: 0,
      scoresPorDimensao: {}
    };
  }

  // 1. Score por Dimensão (0.0 to 3.0 scale, average of questions in that dimension)
  const scoresPorDimensao: Record<number, number> = {};
  const dimQuestionCounts: Record<number, { sum: number; count: number }> = {};

  // Initialize
  for (let d = 1; d <= 8; d++) {
    dimQuestionCounts[d] = { sum: 0, count: 0 };
  }

  let totalRawScore = 0;
  let totalMaxRawScore = QUESTIONS.length * 3;

  let weightedSum = 0;
  let totalWeightSum = 0;

  // Track subscores
  // Risk index calculations: Criticality === "Crítica" | "Alta" or Category === "riscos" | "segurança"
  let riskSum = 0;
  let riskMax = 0;

  // Compliance index calculations: Category === "compliance"
  let complianceSum = 0;
  let complianceMax = 0;

  // Governance index calculations: Category === "governança" | "estratégia" or dimensionId === 1
  let governanceSum = 0;
  let governanceMax = 0;

  QUESTIONS.forEach((q) => {
    const ans = answers[q.id];
    const score = ans ? ans.score : 0; // Default to 0 if not answered

    // Dimensão average
    dimQuestionCounts[q.dimensionId].sum += score;
    dimQuestionCounts[q.dimensionId].count += 1;

    // General Raw Score sums
    totalRawScore += score;

    // Weighted Score sums
    weightedSum += score * q.weight;
    totalWeightSum += 3 * q.weight;

    // Risk Indicators
    const isRiskCheck = q.criticality === "Crítica" || q.criticality === "Alta" || q.category === "riscos" || q.category === "segurança";
    if (isRiskCheck) {
      riskSum += score * q.weight;
      riskMax += 3 * q.weight;
    }

    // Compliance Indicators
    const isComplianceCheck = q.category === "compliance" || q.framework.toLowerCase().includes("act") || q.framework.toUpperCase().includes("LGPD") || q.framework.toUpperCase().includes("GDPR");
    if (isComplianceCheck) {
      complianceSum += score * q.weight;
      complianceMax += 3 * q.weight;
    }

    // Governance Indicators
    const isGovernanceCheck = q.category === "governança" || q.category === "estratégia" || q.dimensionId === 1;
    if (isGovernanceCheck) {
      governanceSum += score * q.weight;
      governanceMax += 3 * q.weight;
    }
  });

  // Compile dimension scores (average out of 3.0 scale)
  for (let d = 1; d <= 8; d++) {
    const data = dimQuestionCounts[d];
    scoresPorDimensao[d] = data.count > 0 ? Number((data.sum / data.count).toFixed(2)) : 0;
  }

  // Calculate percentages (0 to 100)
  const scoreGeral = Math.round((totalRawScore / totalMaxRawScore) * 100);
  const scorePonderado = Math.round((weightedSum / totalWeightSum) * 100);
  const riskScore = riskMax > 0 ? Math.round((riskSum / riskMax) * 100) : 0;
  const complianceScore = complianceMax > 0 ? Math.round((complianceSum / complianceMax) * 100) : 0;
  const governanceScore = governanceMax > 0 ? Math.round((governanceSum / governanceMax) * 100) : 0;

  return {
    scoreGeral,
    scorePonderado,
    riskScore, // Safe risk mitigation score: 100 = full risk control, 0 = complete lack of security risk control
    complianceScore,
    governanceScore,
    scoresPorDimensao
  };
}
