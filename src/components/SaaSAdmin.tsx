import React, { useState } from "react";
import { User, AuditLog, PublicKeyConfig, Organization } from "../types";
import {
  Shield,
  Plus,
  Trash2,
  Lock,
  Database,
  Copy
} from "lucide-react";

interface SaaSAdminProps {
  currentUser: User;
  onChangeUserRole: (role: "admin" | "auditor" | "analista") => void;
  auditLogs: AuditLog[];
  organization: Organization;
  onChangeOrg: (update: Partial<Organization>) => void;
}

export default function SaaSAdmin({
  currentUser,
  onChangeUserRole,
  auditLogs,
  organization,
  onChangeOrg,
}: SaaSAdminProps) {
  const [activeSubTab, setActiveSubTab] = useState<"rbac" | "keys" | "sso" | "audit">("rbac");

  // Local keys state
  const [apiKeys, setApiKeys] = useState<PublicKeyConfig[]>([]);

  const [newKeyName, setNewKeyName] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const generateNewKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const randomHex = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");

    const newKey: PublicKeyConfig = {
      id: `K${Date.now()}`,
      name: newKeyName,
      key: `insp_live_${randomHex}...${randomHex.slice(-6)}`,
      status: "Ativo",
      createdAt: new Date().toISOString(),
    };

    setApiKeys(prev => [newKey, ...prev]);
    setNewKeyName("");
  };

  const deleteKey = (id: string) => {
    setApiKeys(prev => prev.filter(k => k.id !== id));
  };

  const copyKeyText = (k: PublicKeyConfig) => {
    navigator.clipboard.writeText(`insp_live_complete_token_mock_${k.id}`);
    setCopiedId(k.id);
    setTimeout(() => setCopiedId(null), 1200);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs font-sans text-xs text-slate-700">
      {/* Tab select Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-4 select-none font-sans">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Lock className="w-5 h-5 text-blue-600" />
            <span>Configurações SaaS Enterprise & API Governança</span>
          </h3>
          <p className="text-[11px] text-slate-450 mt-1">
            Garantia de conformidade com dados reais através de controles de escopo, auditorias duráveis de log e segurança de provisionamento.
          </p>
        </div>

        <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200">
          {(["rbac", "keys", "sso", "audit"] as const).map((sub) => {
            const labels = { rbac: "Acessos RBAC", keys: "API Developer", sso: "SSO Config", audit: "Logs Auditoria" };
            return (
              <button
                key={sub}
                onClick={() => setActiveSubTab(sub)}
                className={`px-3 py-1 text-[11px] font-bold font-sans rounded-md transition-all cursor-pointer ${
                  activeSubTab === sub
                    ? "bg-blue-600 text-white shadow-xs font-semibold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {labels[sub]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-tab 1: Role-Based Access Control configuration & Organization tenant info */}
      {activeSubTab === "rbac" && (
        <div className="space-y-6 animate-fade-in font-sans">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Metadata Organization config */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
              <h4 className="font-display font-bold text-slate-900 text-xs flex items-center space-x-1.5 border-b border-slate-200 pb-2">
                <Database className="w-4 h-4 text-blue-600" />
                <span>Dados do Cliente / Parâmetros Multi-Tenant</span>
              </h4>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-450 uppercase font-semibold">Nome da Organização (Associação SaaS)</label>
                  <input
                    type="text"
                    value={organization.name}
                    onChange={(e) => onChangeOrg({ name: e.target.value })}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 transition-all font-sans"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-450 uppercase font-semibold">Setor Vertical</label>
                    <select
                      value={organization.industry}
                      onChange={(e) => onChangeOrg({ industry: e.target.value })}
                      className="w-full text-xs px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="Finanças & Bancário">Finanças & Bancário</option>
                      <option value="Saúde & Farmacêutico">Saúde & Farmacêutico</option>
                      <option value="Tecnologia & SaaS">Tecnologia & SaaS</option>
                      <option value="Varejo & E-commerce">Varejo & E-commerce</option>
                      <option value="Governo & Setor Público">Governo & Setor Público</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-450 uppercase font-semibold">Porte da Empresa</label>
                    <select
                      value={organization.size}
                      onChange={(e) => onChangeOrg({ size: e.target.value as any })}
                      className="w-full text-xs px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="Média">Médio Porte</option>
                      <option value="Grande">Grande Porte</option>
                      <option value="Enterprise">Enterprise Elite</option>
                    </select>
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 italic leading-snug">
                * Qualquer alteração de dados do cliente é gravada imediatamente nos servidores, atualizando dinamicamente o de maturidade e conformidade da empresa com dados reais do negócio.
              </p>
            </div>

            {/* Right: RBAC Roles simulator */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
              <h4 className="font-display font-bold text-slate-900 text-xs flex items-center space-x-1.5 border-b border-slate-200 pb-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Simulador de Perfis de Acesso (RBAC)</span>
              </h4>

              <p className="text-slate-500 font-normal leading-relaxed text-[11px]">
                Modifique o seu cargo atual para testar os níveis de permissões de auditoria. Fazer login como Auditor permite aprovar/concluir relatórios válidos, enquanto o Analista apenas preenche checklists.
              </p>

              <div className="grid grid-cols-3 gap-2">
                {(["analista", "auditor", "admin"] as const).map((role) => {
                  const isCurrent = currentUser.role === role;
                  const label = role === "analista" ? "Analista" : role === "auditor" ? "Auditor" : "Admin";
                  const color = role === "analista" ? "bg-blue-50 text-blue-700" : role === "auditor" ? "bg-emerald-50 text-emerald-700" : "bg-purple-50 text-purple-700";
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => onChangeUserRole(role)}
                      className={`p-3 rounded-lg border cursor-pointer h-16 text-center flex flex-col justify-between items-center transition-all ${
                        isCurrent
                          ? "bg-slate-900 border-slate-900 text-white font-bold"
                          : "bg-white border-slate-200 text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <span className="text-xs">{label}</span>
                      <span className={`text-[9px] px-1 py-0.5 rounded font-mono font-bold ${color}`}>
                        {isCurrent ? "Ativo" : "Alternar"}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="bg-white p-2.5 rounded border border-slate-200 font-mono text-[9px] text-slate-500 leading-normal">
                <span className="font-bold text-slate-800 block mb-1">Permissões de Usuário Concedidas:</span>
                • {currentUser.role === "analista" ? "Leitura geral, preenchimento e upload de evidências do assessment." : currentUser.role === "auditor" ? "Leitura geral, edição complementar, exclusão de chaves e aprovação definitiva de relatórios do Insper." : "Acesso irrestrito (Admin): edição, geração de ações, chaves, novos tenants e exclusão corporativa completa."}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Public developer API keys management panel */}
      {activeSubTab === "keys" && (
        <form onSubmit={generateNewKey} className="space-y-4 animate-fade-in font-sans">
          <div>
            <h4 className="font-display font-medium text-slate-900 text-xs">Console de Credenciais Integradas (Chaves Públicas de API)</h4>
            <p className="text-[11px] text-slate-500 mb-4 font-normal">
              Utilize chaves públicas para alimentar canais de CI/CD, sincronizando avaliações de drift coletadas diretamente em esteiras Jenkins, GitLab, ou notebooks SageMaker de forma autônoma.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Digite o nome da chave (ex: Produção Pipeline AWS)"
              className="flex-1 bg-white px-3 py-1.5 rounded-lg border border-slate-300 text-slate-850 text-xs focus:outline-none focus:border-blue-500 transition-all font-sans"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg font-semibold text-xs flex items-center space-x-1 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Gerar Nova Chave</span>
            </button>
          </div>

          {/* Keys list */}
          <div className="space-y-4 mt-4">
            {apiKeys.map((k) => (
              <div
                key={k.id}
                className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 text-xs">{k.name}</span>
                  <div className="flex items-center space-x-2 mt-1 font-mono text-[10px] text-slate-450">
                    <span>{k.key}</span>
                    <span>•</span>
                    <span>{new Date(k.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 font-mono">
                  <button
                    type="button"
                    onClick={() => copyKeyText(k)}
                    className="p-1 px-1.5 rounded bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 text-[10px] font-mono flex items-center space-x-1 cursor-pointer transition-all"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedId === k.id ? "Copiado!" : "Copiar"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteKey(k.id)}
                    className="p-1 rounded bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 active:scale-95 transition-all text-[10px] cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </form>
      )}

      {/* Sub-tab 3: SSO Identity parameters */}
      {activeSubTab === "sso" && (
        <div className="space-y-4 animate-fade-in font-sans">
          <div>
            <h4 className="font-display font-bold text-slate-900 text-xs">Provisionamento Single Sign-On (OIDC / SAML 2.0)</h4>
            <p className="text-[11px] text-slate-500 font-normal">
              Conecte o diretório de usuários da sua empresa (Okta, Azure Active Directory ou Ping Identity) para habilitar provisionamento instântaneo de auditorias reais.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="px-1.5 py-0.5 rounded text-[8px] bg-white text-slate-500 border border-slate-205 font-mono font-bold uppercase">Parâmetros SAML 2.0</span>
              <div className="space-y-2 mt-2">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Endpoint SAML SSO:</span>
                  <span className="font-mono text-blue-600 font-bold">https://insper.okta.com/app/sso/v1</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Entity ID / URI:</span>
                  <span className="font-mono text-blue-600 font-bold">urn:insper:ai-maturity-platform</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-slate-500">Upload de XML Metadata:</span>
                  <span className="text-slate-400 hover:text-blue-600 transition-colors pointer-events-none">[Carregar XML]</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="px-1.5 py-0.5 rounded text-[8px] bg-white text-slate-500 border border-slate-205 font-mono font-bold uppercase">Mapeamento de Grupos RBAC</span>
              <p className="text-slate-450 text-[10.5px] pb-1 font-normal leading-normal">
                Os novos usuários Okta que logarem com o domínio da empresa serão enquadrados de acordo com os atributos internos configurados.
              </p>
              <div className="space-y-2 font-mono text-[10px]">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-mono">grupo_insper_ai_audit</span>
                  <span className="text-emerald-700 font-bold">➔ Perfil Auditor</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-mono">grupo_insper_ai_engineering</span>
                  <span className="text-blue-700 font-bold">➔ Perfil Analista</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 4: Auditable executionlogs viewer */}
      {activeSubTab === "audit" && (
        <div className="space-y-4 animate-fade-in font-sans">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h4 className="font-display font-semibold text-slate-900 text-xs">Trilha de Auditabilidade Durável (Audit Logs)</h4>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              {auditLogs.length} eventos registrados
            </span>
          </div>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {auditLogs.map((log) => {
              const catColors = {
                assessment: "bg-blue-50 text-blue-750 border-blue-200",
                security: "bg-red-50 text-red-750 border-red-200",
                tenant: "bg-amber-50 text-amber-705 border-amber-200",
                api: "bg-purple-50 text-purple-705 border-purple-200",
                sso: "bg-slate-50 text-slate-500 border-slate-250",
              };

              return (
                <div
                  key={log.id}
                  className="p-2.5 rounded bg-slate-50 border border-slate-100 font-mono text-[10px] leading-relaxed flex flex-col md:flex-row md:items-center justify-between gap-2"
                >
                  <div className="flex items-start md:items-center space-x-2 truncate">
                    <span className="text-slate-400 shrink-0 text-[9px]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] border shrink-0 font-bold uppercase ${catColors[log.category] || "bg-slate-50 border-slate-200"}`}>
                      {log.category}
                    </span>
                    <span className="text-slate-700 truncate font-sans text-xs">
                      {log.action}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-right shrink-0">
                    <span className="text-blue-650 font-bold truncate max-w-[125px]" title={log.userEmail}>
                      [{log.userEmail.split("@")[0]}]
                    </span>
                    <span className="text-[9px] text-slate-400 bg-white px-1.5 py-0.5 border border-slate-200 rounded font-mono">
                      {log.details}
                    </span>
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
