import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to get GoogleGenAI client (lazy initialization to prevent crash on startup if key is missing)
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("A chave GEMINI_API_KEY não foi encontrada configurada no servidor. Por favor, verifique as configurações em Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API endpoint to generate recommendations based on assessment results using Gemini
app.post("/api/generate-recommendations", async (req: Request, res: Response): Promise<void> => {
  try {
    const { organization, dimensionGrades, weakQuestions, scores } = req.body;

    if (!dimensionGrades || !scores) {
       res.status(400).json({ error: "Resultados da avaliação ausentes." });
       return;
    }

    // Lazy load the AI client
    const ai = getGeminiClient();

    const formattedWeaks = weakQuestions && Array.isArray(weakQuestions)
      ? weakQuestions.map((q: any) => `- [${q.id}] ${q.text} (Criticidade: ${q.criticality}, Framework: ${q.framework}, Resposta: ${q.score === 0 ? "Não existe" : "Parcial/Iniciado"})`).join("\n")
      : "Nenhum gap crítico imediato com nota baixa.";

    const formattedGrades = Object.entries(dimensionGrades)
      .map(([name, score]: [any, any]) => `- **${name}**: Nota ${(Number(score)).toFixed(1)}/3.0 (${Math.round((Number(score)/3.0)*100)}% de maturidade)`)
      .join("\n");

    const systemPrompt = `Você é o Conselheiro Chefe de IA e GRC (Governança, Risco e Compliance) do Insper para a Plataforma de Maturidade em IA.
Sua missão é emitir um Relatório de Recomendações Estratégicas para uma empresa avaliada com base no framework de maturidade em IA da instituição, em conjunto com práticas internacionais como ISO/IEC 42001 (Sistema de Gestão de IA) e NIST AI RMF (Risk Management Framework).

Sua resposta DEVE ser um objeto contendo os campos textuais estruturados listados na especificação do esquema de resposta.
Use linguagem altamente profissional, técnica, executiva e contextualizada para o mercado enterprise, no idioma Português (Brasil). Não use termos infantis. Trate o usuário como um C-level (CIO, CDO, Chefe de IA).`;

    const prompt = `Analise os dados de maturidade da empresa e elabore as recomendações corporativas oficiais:

EMPRESA AVALIADA:
- Organização: ${organization?.name || "Empresa Avaliada"}
- Setor: ${organization?.industry || "Geral/Tecnologia"}
- Porte: ${organization?.size || "Enterprise"}

MÉTRICAS GERAIS CALCULADAS:
- Score Geral de Maturidade: ${scores.scoreGeral}/100 (Classificação Geral: ${scores.scoreGeral <= 20 ? "Inicial" : scores.scoreGeral <= 40 ? "Básico" : scores.scoreGeral <= 60 ? "Definido" : scores.scoreGeral <= 80 ? "Gerenciado" : "Otimizado"})
- Score Ponderado: ${scores.scorePonderado}/100
- Score de Governança de IA: ${scores.governanceScore}/100
- Score de Riscos de IA (Gestão/Mitigação): ${scores.riskScore}/100 (Nota mais alta = riscos mais mitigados e mais controlados)
- Score de Conformidade/Compliance com Normativos: ${scores.complianceScore}/100

RESULTADOS POR DIMENSÃO (0.0 a 3.0):
${formattedGrades}

CONTROLES AUSENTES OU CRÍTICOS IDENTIFICADOS (Controles com Notas 0 ou 1):
${formattedWeaks}

Por favor, gere uma análise executiva personalizada profunda para os seguintes campos de saída:
1. "resumoExecutivo": Um sumário executivo em Markdown detalhando a situação de maturidade da organização, pontos fortes, status atual e incentivo às lideranças.
2. "gapsIdentificados": Análise técnica em Markdown dos maiores gargalos de governança, riscos e MLOps fundamentados nas notas insuficientes encontradas.
3. "quickWins": Pelo menos 3 a 4 'Ganhos Rápidos' em Markdown detalhando ações imediatas, com baixo esforço e alto impacto corporativo, alinhadas aos gaps detectados.
4. "roadmapEvolutivo": Cronograma faseado em Markdown (Exemplo: Fase 1: Fundação 0-3 meses, Fase 2: Estruturação 3-6 meses, Fase 3: Maturidade Contínua 6-12 meses) com ações táticas concretas.
5. "controlesSugeridos": Especificações detalhadas de controles essenciais ausentes em formato Markdown, citando explicitamente a conformidade com as diretrizes do NIST AI RMF e da norma técnica ISO/IEC 42001.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            resumoExecutivo: {
              type: Type.STRING,
              description: "Sumário executivo em formato Markdown.",
            },
            gapsIdentificados: {
              type: Type.STRING,
              description: "Principais gaps e carências identificados estruturados em Markdown.",
            },
            quickWins: {
              type: Type.STRING,
              description: "Ações de ganho rápido bem detalhadas em Markdown.",
            },
            roadmapEvolutivo: {
              type: Type.STRING,
              description: "Plano de evolução de 12 meses dividido em fases em Markdown.",
            },
            controlesSugeridos: {
              type: Type.STRING,
              description: "Controles específicos ausentes vinculados a frameworks como ISO 42001 / NIST AI RMF em Markdown.",
            },
          },
          required: ["resumoExecutivo", "gapsIdentificados", "quickWins", "roadmapEvolutivo", "controlesSugeridos"],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Nenhum conteúdo retornado pelo modelo Gemini.");
    }

    const payload = JSON.parse(responseText.trim());
    res.json(payload);
  } catch (error: any) {
    console.error("Erro na rota do Gemini:", error);
    // Return a structured error response that the front-end can capture gracefully
    res.status(500).json({
      error: true,
      message: error.message || "Erro interno ao consultar o motor de recomendações de Inteligência Artificial.",
    });
  }
});

// --- IN-MEMORY CLASSROOM DYNAMIC STATE ---
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

let classroomState: ClassroomState = {
  active: true,
  companies: [
    {
      id: "C1",
      name: "Empresa Alfa",
      industry: "Tecnologia",
      answers: {},
    },
    {
      id: "C2",
      name: "Empresa Beta",
      industry: "Finanças",
      answers: {},
    },
    {
      id: "C3",
      name: "Empresa Gama",
      industry: "Varejo",
      answers: {},
    }
  ],
  logs: [
    {
      id: "initial-log",
      timestamp: new Date().toISOString(),
      message: "Plataforma de Maturidade iniciada. Pronta para receber respostas das empresas!",
      companyId: "C1"
    }
  ]
};

// GET /api/classroom/state
app.get("/api/classroom/state", (req: Request, res: Response) => {
  res.json(classroomState);
});

// POST /api/classroom/setup
app.post("/api/classroom/setup", (req: Request, res: Response) => {
  const { companyNames, groupAName, groupBName } = req.body;
  
  let names: string[] = [];
  if (Array.isArray(companyNames)) {
    names = companyNames.filter((n: any) => typeof n === "string" && n.trim() !== "");
  } else if (groupAName || groupBName) {
    // Backward compatibility mapping
    names = [groupAName || "Empresa Alfa", groupBName || "Empresa Beta"];
  }

  if (names.length === 0) {
    names = ["Empresa Alfa", "Empresa Beta", "Empresa Gama"];
  }

  // Create active list of 2 or 3 companies
  const newCompanies: CompanyState[] = names.map((name, index) => {
    const ids = ["C1", "C2", "C3", "C4", "C5"];
    const id = ids[index] || `C${index + 1}`;
    const industries = ["Tecnologia", "Finanças", "Serviços", "Indústria", "Varejo"];
    return {
      id,
      name: name.trim(),
      industry: industries[index % industries.length],
      answers: {}
    };
  });

  classroomState = {
    active: true,
    companies: newCompanies,
    logs: [
      {
        id: `setup-${Date.now()}`,
        timestamp: new Date().toISOString(),
        message: `Novo cenário criado com as seguintes empresas: ${names.join(", ")}.`,
        companyId: newCompanies[0]?.id || "C1",
      }
    ],
  };

  res.json({ success: true, state: classroomState });
});

// POST /api/classroom/answer
app.post("/api/classroom/answer", (req: Request, res: Response) => {
  const { companyId, groupId, questionId, score } = req.body;
  
  // Backwards compatibility with front-end passing groupId instead of companyId
  const targetCompanyId = companyId || (groupId === "A" ? "C1" : groupId === "B" ? "C2" : "C3");

  const company = classroomState.companies.find(c => c.id === targetCompanyId);
  if (!company) {
    res.status(404).json({ error: `Empresa com o ID '${targetCompanyId}' não foi encontrada.` });
    return;
  }

  const isUpdate = !!company.answers[questionId];
  
  company.answers[questionId] = {
    questionId,
    score: Number(score),
    updatedAt: new Date().toISOString(),
  };

  const actionText = isUpdate ? "atualizou" : "respondeu";
  const scoreLabels = ["Não Existe", "Parcial", "Implementado", "Maduro"];
  const progressPercent = Math.round((Object.keys(company.answers).length / 46) * 100);

  const logMessage = `📋 [${company.name}] ${actionText} o controle ${questionId} com nota ${score} (${scoreLabels[score]}) — Progresso: ${progressPercent}%`;

  // Push log to start
  classroomState.logs.unshift({
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    timestamp: new Date().toISOString(),
    message: logMessage,
    companyId: company.id,
  });

  // Limit logs to 50
  if (classroomState.logs.length > 50) {
    classroomState.logs = classroomState.logs.slice(0, 50);
  }

  res.json({ success: true, groupProgress: progressPercent, state: classroomState });
});

// POST /api/classroom/reset
app.post("/api/classroom/reset", (req: Request, res: Response) => {
  classroomState.companies.forEach(company => {
    company.answers = {};
  });
  classroomState.logs = [
    {
      id: `reset-${Date.now()}`,
      timestamp: new Date().toISOString(),
      message: "Todas as respostas enviadas de todas as empresas foram apagadas de forma bem-sucedida!",
      companyId: "C1"
    }
  ];
  res.json({ success: true, state: classroomState });
});

// Configure Vite middleware or serve static built files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Insper AI Maturity Server] Servidor executando em http://localhost:${PORT}`);
  });
}

startServer();
