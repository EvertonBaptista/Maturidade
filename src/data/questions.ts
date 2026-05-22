import { Dimension, Question } from "../types";

export const DIMENSIONS: Dimension[] = [
  {
    id: 1,
    name: "Governança e Estratégia",
    description: "Direção estratégica, responsabilidade corporativa, políticas de IA e alinhamento do alto escalão executivo.",
    focus: "Accountability, Políticas, Estratégia de Negócios"
  },
  {
    id: 2,
    name: "MAP — Contexto, Riscos e Impactos",
    description: "Análise do contexto organizacional, identificação sistemática de impactos e classificação de modelos de acordo com potenciais riscos.",
    focus: "Análise de Riscos, Legislação, Mapeamento de Impacto"
  },
  {
    id: 3,
    name: "MEASURE — Métricas e Monitoramento",
    description: "Performance técnica, avaliação de desvios (drift), monitoramento de viés distributivo, fairness e observabilidade ativa.",
    focus: "Métricas Ativas, Observabilidade, Auditoria de Modelos"
  },
  {
    id: 4,
    name: "MANAGE — Gestão Operacional e Riscos",
    description: "Planos de contingência, resposta estruturada a incidentes de IA, supervisão humana efetiva e revisões de eficácia dos controles.",
    focus: "Mitigação, Incidentes, Controles Operacionais"
  },
  {
    id: 5,
    name: "Capacidades Técnicas e MLOps",
    description: "Metodologias de desenvolvimento integrado, versionamento de datasets/modelos, testes de caixa cinza e homologação segura.",
    focus: "MLOps, Versionamento, Pipeline de Entrega"
  },
  {
    id: 6,
    name: "Dados e Infraestrutura",
    description: "Qualidade de dados de treino, rastreabilidade (data lineage), privacidade desde a concepção (by design), escalabilidade e ciclo de vida de dados.",
    focus: "Qualidade de Dados, Linhagem, LGPD/GDPR"
  },
  {
    id: 7,
    name: "Talentos e Cultura",
    description: "Capacitação técnica e de governança para times de ponta a ponta, democratização responsável da IA e cooperação interdisciplinar.",
    focus: "Skillsets, Colaboração, Treinamento"
  },
  {
    id: 8,
    name: "Ética, Transparência e Compliance",
    description: "Conformidade legal com leis nacionais e globais, explicabilidade algorítmica para stakeholders e mecanismos formais de transparência.",
    focus: "Conformidade Regulatória, Explicabilidade, Auditoria Ética"
  }
];

export const QUESTIONS: Question[] = [
  // Dimensão 1: Governança e Estratégia (6 perguntas)
  {
    id: "Q1.1",
    dimensionId: 1,
    text: "Existe uma estratégia formal de IA alinhada aos objetivos do negócio?",
    weight: 3,
    category: "estratégia",
    framework: "Corporativo / ISO 42001",
    criticality: "Alta",
    level: 2,
    description: "A organização documentou e divulgou seus propósitos com IA, determinando as prioridades de adoção técnica alinhadas ao plano estratégico anual."
  },
  {
    id: "Q1.2",
    dimensionId: 1,
    text: "A organização possui governança definida para iniciativas de IA?",
    weight: 3,
    category: "governança",
    framework: "ISO 42001 Cláusula 5",
    criticality: "Crítica",
    level: 3,
    description: "Estabelecimento de comitês, fóruns de decisão ou papéis centrais dedicados a ditar e rever políticas, processos e o inventário de IA."
  },
  {
    id: "Q1.3",
    dimensionId: 1,
    text: "Existem políticas e princípios éticos para uso de IA?",
    weight: 2,
    category: "ética",
    framework: "NIST AI RMF / OCDE",
    criticality: "Alta",
    level: 2,
    description: "Diretrizes organizacionais que orientam o que é aceitável, visando equidade, privacidade, segurança cibernética e desvio de vieses."
  },
  {
    id: "Q1.4",
    dimensionId: 1,
    text: "Há definição clara de responsabilidades sobre decisões automatizadas?",
    weight: 3,
    category: "compliance",
    framework: "EU AI Act Artigos 16-29",
    criticality: "Crítica",
    level: 3,
    description: "Distribuição formal de responsabilidades (RACI) por impactos, alertas e erros causados por execuções ou decisões geradas por IA."
  },
  {
    id: "Q1.5",
    dimensionId: 1,
    text: "Existe processo para priorização e aprovação de iniciativas de IA?",
    weight: 2,
    category: "operacional",
    framework: "Corporativo / ISO 42001",
    criticality: "Média",
    level: 3,
    description: "Utilização de matrizes de custo vs. impacto e preenchimento de ficha de projeto com validação multidisciplinar pré-desenvolvimento."
  },
  {
    id: "Q1.6",
    dimensionId: 1,
    text: "A organização mede valor e risco das iniciativas de IA?",
    weight: 2,
    category: "finanças",
    framework: "NIST AI RMF",
    criticality: "Alta",
    level: 4,
    description: "Acompanhamento do ROI técnico, melhorias de produtividade ativa em paralelo a análises de passivos regulatórios e operacionais gerados."
  },

  // Dimensão 2: MAP — Contexto, Riscos e Impactos (6 perguntas)
  {
    id: "Q2.1",
    dimensionId: 2,
    text: "Os sistemas de IA possuem classificação baseada em risco?",
    weight: 3,
    category: "riscos",
    framework: "EU AI Act / NIST AI RMF",
    criticality: "Crítica",
    level: 2,
    description: "Divisão do portfólio de IA nos quadrantes de risco (mínimo, limitado, alto, inaceitável) para moldar os níveis de controle exigidos."
  },
  {
    id: "Q2.2",
    dimensionId: 2,
    text: "A organização identifica impactos em clientes, colaboradores e sociedade?",
    weight: 2,
    category: "impacto",
    framework: "NIST AI RMF MAP 3",
    criticality: "Alta",
    level: 3,
    description: "Elaboração periódica do Relatório de Impacto à Proteção de Dados (RIPD/DPIA) ou Avaliação de Impacto Ético em IA."
  },
  {
    id: "Q2.3",
    dimensionId: 2,
    text: "Existe mapeamento de requisitos regulatórios aplicáveis à IA?",
    weight: 3,
    category: "compliance",
    framework: "Legislação Brasileira / EU AI Act",
    criticality: "Crítica",
    level: 2,
    description: "Acompanhamento legislativo sistemático e adequação específica a normas do setor (ex.: Bacen, ANS, Anvisa) relevantes ao uso de IA."
  },
  {
    id: "Q2.4",
    dimensionId: 2,
    text: "São avaliados riscos de terceiros e fornecedores de IA?",
    weight: 2,
    category: "suprimentos",
    framework: "ISO 42001 Cláusula 8.2",
    criticality: "Alta",
    level: 3,
    description: "Políticas de homologação de fornecedores SaaS de IA e análise técnica de robustez dos termos de uso da empresa parceira."
  },
  {
    id: "Q2.5",
    dimensionId: 2,
    text: "Existe avaliação de possíveis vieses e impactos discriminatórios?",
    weight: 3,
    category: "ética",
    framework: "NIST AI RMF MAP 4",
    criticality: "Crítica",
    level: 4,
    description: "Testes preventivos nos conjuntos de dados de treino e na inferência para garantir não-discriminação a grupos minorizados."
  },
  {
    id: "Q2.6",
    dimensionId: 2,
    text: "Os contextos de uso e limitações dos modelos são documentados?",
    weight: 2,
    category: "documentação",
    framework: "Model Cards / ISO 42001",
    criticality: "Média",
    level: 3,
    description: "Criação de fichas técnicas dos modelos (Model Cards) detalhando acurácia teórica, vieses conhecidos e o contexto operacional vetado."
  },

  // Dimensão 3: MEASURE — Métricas e Monitoramento (7 perguntas)
  {
    id: "Q3.1",
    dimensionId: 3,
    text: "Existem métricas definidas para avaliar desempenho de IA?",
    weight: 2,
    category: "técnico",
    framework: "NIST AI RMF MEASURE 1",
    criticality: "Alta",
    level: 3,
    description: "Adoção de KPIs consolidados (F1-score, revocabilidade, MSE, erro absoluto) estabelecidos de acordo com o padrão do problema matemático."
  },
  {
    id: "Q3.2",
    dimensionId: 3,
    text: "Os modelos são monitorados continuamente em produção?",
    weight: 3,
    category: "MLOps",
    framework: "ISO 42001 Anexo A.8",
    criticality: "Crítica",
    level: 4,
    description: "Painéis automatizados que capturam anomalias operacionais, tempos de inferência e quebras de integridade da entrada do payload."
  },
  {
    id: "Q3.3",
    dimensionId: 3,
    text: "Existe monitoramento de drift e degradação de modelos?",
    weight: 3,
    category: "MLOps",
    framework: "NIST AI RMF MEASURE 2",
    criticality: "Crítica",
    level: 4,
    description: "Detecção de concept drift (mudança estrutural de comportamento) ou data drift (mudança estatística dos dados de entrada) ao longo do tempo."
  },
  {
    id: "Q3.4",
    dimensionId: 3,
    text: "São monitorados viés, fairness e impactos em grupos demográficos?",
    weight: 2,
    category: "ética",
    framework: "Responsible AI / NIST AI RMF",
    criticality: "Alta",
    level: 4,
    description: "Medição em nível de inferência de métricas de justiça estatística (ex: paridade demográfica, igualdade de oportunidades)."
  },
  {
    id: "Q3.5",
    dimensionId: 3,
    text: "Existe rastreabilidade e observabilidade dos sistemas de IA?",
    weight: 3,
    category: "governança",
    framework: "ISO 42001 / Linhagem",
    criticality: "Alta",
    level: 3,
    description: "Lógica capaz de mapear o fluxo completo de uma inferência específica (payload de entrada, versão do modelo utilizado e saída de dados)."
  },
  {
    id: "Q3.6",
    dimensionId: 3,
    text: "A organização mede explainability e transparência dos modelos?",
    weight: 2,
    category: "ética",
    framework: "Explicabilidade / SHAP / LIME",
    criticality: "Alta",
    level: 4,
    description: "Uso de ferramentas para quantificar e exibir as variáveis de maior relevância na determinação de score do algoritmo."
  },
  {
    id: "Q3.7",
    dimensionId: 3,
    text: "Existem dashboards executivos para métricas e riscos de IA?",
    weight: 2,
    category: "executivo",
    framework: "Corporativo",
    criticality: "Baixa",
    level: 4,
    description: "Ponto unificado de consulta onde diretores e o conselho acompanham o inventário ativo e a exposição de criticidade regulatória."
  },

  // Dimensão 4: MANAGE — Gestão Operacional e Riscos (6 perguntas)
  {
    id: "Q4.1",
    dimensionId: 4,
    text: "Existe processo formal para gestão de riscos de IA?",
    weight: 3,
    category: "riscos",
    framework: "ISO 31000 / ISO 42001 Cl 6",
    criticality: "Crítica",
    level: 3,
    description: "Tratamento unificado de riscos no Enterprise Risk Management (ERM), abrangendo falhas técnicas, alucinações de LLM e fake news."
  },
  {
    id: "Q4.2",
    dimensionId: 4,
    text: "Há plano de resposta a incidentes relacionados à IA?",
    weight: 3,
    category: "segurança",
    framework: "NIST AI RMF MANAGE 2",
    criticality: "Crítica",
    level: 3,
    description: "Protocolos acionáveis para interrupção de inferências desastrosas, vazamento massivo, re-deploy de backup e contenção de relações públicas."
  },
  {
    id: "Q4.3",
    dimensionId: 4,
    text: "Existe supervisão humana para decisões críticas automatizadas?",
    weight: 3,
    category: "ética",
    framework: "Human-in-the-loop / EU AI Act",
    criticality: "Crítica",
    level: 2,
    description: "Mecanismo (ex: Human-in-the-loop) onde uma tomada de decisão sobre dados sensíveis ou decisões judiciais passa pelo crivo obrigatório de revisor humano."
  },
  {
    id: "Q4.4",
    dimensionId: 4,
    text: "A organização possui processos de atualização e retreinamento de modelos?",
    weight: 2,
    category: "MLOps",
    framework: "ISO 42001 Anexo A.8",
    criticality: "Média",
    level: 4,
    description: "Estratégia integrada de agendamento automático de treino ou trigger por decaimento de performance previamente documentado."
  },
  {
    id: "Q4.5",
    dimensionId: 4,
    text: "Existem controles para continuidade e recuperação de falhas?",
    weight: 2,
    category: "infraestrutura",
    framework: "ISO 22301 / Plano de B",
    criticality: "Alta",
    level: 3,
    description: "Existência de sistemas redundantes ou lógicas de fallback silenciosas (ex: uso de regras determinísticas se o modelo estiver inoperante)."
  },
  {
    id: "Q4.6",
    dimensionId: 4,
    text: "A organização realiza revisão contínua da eficácia dos controles de IA?",
    weight: 2,
    category: "auditoria",
    framework: "ISO 42001 Cláusula 9",
    criticality: "Alta",
    level: 5,
    description: "Auditorias anuais independentes ou de comitê interno para certificar que os procedimentos e travas desenhadas estão operantes."
  },

  // Dimensão 5: Capacidades Técnicas e MLOps (6 perguntas)
  {
    id: "Q5.1",
    dimensionId: 5,
    text: "Existe metodologia estruturada para desenvolvimento de IA?",
    weight: 2,
    category: "técnico",
    framework: "CRISP-DM / Agile",
    criticality: "Média",
    level: 3,
    description: "Processo estruturado e padronizado que engloba entendimento de negócio, preparação, modelagem, validação e deploy em sprints organizados."
  },
  {
    id: "Q5.2",
    dimensionId: 5,
    text: "A organização possui práticas de MLOps e automação de deploy?",
    weight: 3,
    category: "MLOps",
    framework: "MLOps Frameworks",
    criticality: "Crítica",
    level: 4,
    description: "Uso de ferramentas industriais para pipelines de CI/CD aplicados ao ML, orquestração de pods e containers de forma automática."
  },
  {
    id: "Q5.3",
    dimensionId: 5,
    text: "Existem processos de validação e testes de modelos?",
    weight: 3,
    category: "técnico",
    framework: "ISO 42001 Anexo A.10",
    criticality: "Alta",
    level: 3,
    description: "Execução regular de testes robustos como validação cruzada, testes shadow e testes A/B antes do direcionamento corporativo."
  },
  {
    id: "Q5.4",
    dimensionId: 5,
    text: "A organização possui versionamento de modelos e datasets?",
    weight: 2,
    category: "MLOps",
    framework: "DVC / Git",
    criticality: "Alta",
    level: 3,
    description: "Rastreabilidade de experimentos de modo a garantir que um modelo compilado possa ser perfeitamente reproduzido em treino."
  },
  {
    id: "Q5.5",
    dimensionId: 5,
    text: "Existe monitoramento técnico em tempo real dos modelos?",
    weight: 3,
    category: "MLOps",
    framework: "SRE / DevOps",
    criticality: "Alta",
    level: 4,
    description: "Gráficos de vazão, uso de CPU/GPU, vazamento de memória e taxa de erro HTTP associados à chamada dos microsserviços."
  },
  {
    id: "Q5.6",
    dimensionId: 5,
    text: "Os ambientes de desenvolvimento, teste e produção são segregados e controlados?",
    weight: 2,
    category: "segurança",
    framework: "ISO 27001",
    criticality: "Alta",
    level: 3,
    description: "Garantia de que os analistas não usem credenciais de produção e que o ambiente de testes seja estéril de dados reais sensíveis."
  },

  // Dimensão 6: Dados e Infraestrutura (6 perguntas)
  {
    id: "Q6.1",
    dimensionId: 6,
    text: "Existe governança formal de dados para iniciativas de IA?",
    weight: 3,
    category: "dados",
    framework: "DAMA-DMBOK / ISO 42001",
    criticality: "Crítica",
    level: 3,
    description: "Políticas organizacionais de posse e catalogação de dados estruturados e desestruturados aplicados a algoritmos preditivos."
  },
  {
    id: "Q6.2",
    dimensionId: 6,
    text: "Os dados utilizados possuem controles de qualidade e rastreabilidade?",
    weight: 3,
    category: "dados",
    framework: "Data Lineage / DAMA",
    criticality: "Alta",
    level: 3,
    description: "Acompanhamento da origem dos dados, transformações efetuadas (ETL) e tratamento para exclusão de outliers e dados nulos."
  },
  {
    id: "Q6.3",
    dimensionId: 6,
    text: "Existem controles adequados de segurança e privacidade de dados?",
    weight: 3,
    category: "segurança",
    framework: "LGPD / GDPR / ISO 27701",
    criticality: "Crítica",
    level: 2,
    description: "Implementação de criptografia em repouso e trânsito, controle de acessos fino baseado em perfis (RBAC) e mascaramento de PII."
  },
  {
    id: "Q6.4",
    dimensionId: 6,
    text: "A organização possui infraestrutura escalável para IA?",
    weight: 2,
    category: "infraestrutura",
    framework: "Cloud / Kubernetes",
    criticality: "Média",
    level: 4,
    description: "Contratação dinâmica de computação dimensionada para picos de treinamento de inferências ou processamento distribuído."
  },
  {
    id: "Q6.5",
    dimensionId: 6,
    text: "Existe monitoramento de qualidade e drift dos dados?",
    weight: 2,
    category: "dados",
    framework: "Observabilidade de Dados",
    criticality: "Alta",
    level: 4,
    description: "Monitoramento automatizado (ex. Great Expectations, Monte Carlo) de quebra de premissas estáticas de bancos e pipelines de ingestão."
  },
  {
    id: "Q6.6",
    dimensionId: 6,
    text: "Há políticas de retenção, anonimização e descarte de dados?",
    weight: 2,
    category: "compliance",
    framework: "LGPD Artigos 15 e 16",
    criticality: "Alta",
    level: 3,
    description: "Ciclo de vida do dado bem definido, com rotinas de deleção definitiva após expiração do consentimento de coleta inicial."
  },

  // Dimensão 7: Talentos e Cultura (4 perguntas)
  {
    id: "Q7.1",
    dimensionId: 7,
    text: "Existe programa de capacitação em IA para equipes?",
    weight: 2,
    category: "cultura",
    framework: "Corporativo",
    criticality: "Média",
    level: 2,
    description: "Treinamentos formais para letramento em dados e IA (Data Literacy) para líderes de negócios, advogados, analistas e engenheiros."
  },
  {
    id: "Q7.2",
    dimensionId: 7,
    text: "A organização possui profissionais qualificados para desenvolvimento e governança de IA?",
    weight: 3,
    category: "recursos humanos",
    framework: "RH / Competências",
    criticality: "Alta",
    level: 3,
    description: "Presença estruturada de Cientistas de Dados seniores, Engenheiros de ML, e Analistas de GRC de IA no organograma interno."
  },
  {
    id: "Q7.3",
    dimensionId: 7,
    text: "Existe cultura organizacional favorável à inovação com IA?",
    weight: 2,
    category: "cultura",
    framework: "Inovação",
    criticality: "Baixa",
    level: 2,
    description: "Incentivo a hackathons corporativos, sandboxes de experimentação protegida de riscos de exposição e canais de compartilhamento."
  },
  {
    id: "Q7.4",
    dimensionId: 7,
    text: "Há colaboração entre áreas técnicas, jurídicas, compliance e negócio?",
    weight: 3,
    category: "governança",
    framework: "ISO 42001 / Cross-collaboration",
    criticality: "Alta",
    level: 3,
    description: "Participação em conjunto durante o planejamento das soluções para que o jurídico avalie termos de uso antes da codificação."
  },

  // Dimensão 8: Ética, Transparência e Compliance (5 perguntas)
  {
    id: "Q8.1",
    dimensionId: 8,
    text: "Existe framework ético formal para desenvolvimento e uso de IA?",
    weight: 3,
    category: "ética",
    framework: "Princípios Éticos UNESCO / OCDE",
    criticality: "Alta",
    level: 3,
    description: "Documento oficializado pela diretoria executiva balizando as restrições éticas fundamentais nas quais a IA não deve operar na empresa."
  },
  {
    id: "Q8.2",
    dimensionId: 8,
    text: "A organização garante transparência sobre uso de IA para usuários afetados?",
    weight: 2,
    category: "compliance",
    framework: "LGPD Artigo 20 / EU AI Act",
    criticality: "Crítica",
    level: 3,
    description: "Avisos em tela do tipo 'Você está interagindo com um robô' e disponibilização de canais acessíveis para solicitação de explicação manual."
  },
  {
    id: "Q8.3",
    dimensionId: 8,
    text: "Existem mecanismos de auditoria e rastreabilidade das decisões automatizadas?",
    weight: 3,
    category: "auditoria",
    framework: "ISO 42001 Cl 9",
    criticality: "Alta",
    level: 4,
    description: "Logs sistêmicos gravados de modo durável contendo todos os dados que balizaram uma inferência de concessão de crédito, por exemplo."
  },
  {
    id: "Q8.4",
    dimensionId: 8,
    text: "A organização possui processos para mitigação de vieses algorítmicos?",
    weight: 2,
    category: "ética",
    framework: "Mitigação / Fairness Toolkit",
    criticality: "Alta",
    level: 4,
    description: "Checklists pós-validação de acurácia com re-balanceamento de amostras sintéticas e testes comparativos em sub-populações."
  },
  {
    id: "Q8.5",
    dimensionId: 8,
    text: "Existe monitoramento contínuo de conformidade regulatória relacionada à IA?",
    weight: 3,
    category: "compliance",
    framework: "Compliance / GRC",
    criticality: "Crítica",
    level: 3,
    description: "Auditoria ativa se todos os modelos no inventário aderem à legislação em trâmite no país e resoluções setoriais de órgãos superiores."
  }
];
