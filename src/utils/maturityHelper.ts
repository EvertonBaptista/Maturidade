export interface MaturityDetails {
  level: number;
  name: string;
  color: string;
  bg: string;
  border: string;
  bullets: string[];
}

export const MATURITY_LEVELS: MaturityDetails[] = [
  {
    level: 1,
    name: "Nível 1 — Inicial",
    color: "text-red-700",
    bg: "bg-red-50/70",
    border: "border-red-200",
    bullets: [
      "Processos inexistentes ou ad hoc",
      "Uso experimental de IA",
      "Ausência de governança formal"
    ]
  },
  {
    level: 2,
    name: "Nível 2 — Básico",
    color: "text-orange-700",
    bg: "bg-orange-50/70",
    border: "border-orange-200",
    bullets: [
      "Algumas iniciativas estruturadas",
      "Controles limitados",
      "Governança parcial"
    ]
  },
  {
    level: 3,
    name: "Nível 3 — Definido",
    color: "text-amber-700",
    bg: "bg-amber-50/70",
    border: "border-amber-200",
    bullets: [
      "Processos documentados",
      "Monitoramento consistente",
      "Governança estabelecida"
    ]
  },
  {
    level: 4,
    name: "Nível 4 — Gerenciado",
    color: "text-indigo-700",
    bg: "bg-indigo-50/70",
    border: "border-indigo-200",
    bullets: [
      "Métricas avançadas",
      "Automação e monitoramento contínuo",
      "Gestão integrada de riscos"
    ]
  },
  {
    level: 5,
    name: "Nível 5 — Otimizado",
    color: "text-emerald-700",
    bg: "bg-emerald-50/70",
    border: "border-emerald-200",
    bullets: [
      "IA integrada estrategicamente",
      "Processos continuamente melhorados",
      "Responsible AI madura",
      "Governança preditiva e automatizada"
    ]
  }
];

export function getMaturityDetailsForScore(percentage: number): MaturityDetails {
  if (percentage <= 20) return MATURITY_LEVELS[0];
  if (percentage <= 40) return MATURITY_LEVELS[1];
  if (percentage <= 60) return MATURITY_LEVELS[2];
  if (percentage <= 80) return MATURITY_LEVELS[3];
  return MATURITY_LEVELS[4];
}
