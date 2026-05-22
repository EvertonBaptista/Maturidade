import React, { useState } from "react";
import ClassroomMode from "./components/ClassroomMode";

export default function App() {
  // Check if we have groupId or companyId in query params on mount (for real-time student cell responses)
  const [classroomGroupId] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("companyId") || params.get("groupId");
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col justify-between">
      {/* Insper Branding Header Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="w-full px-4 md:px-8 xl:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600 rounded-xl shadow-xs">
              <span className="text-white font-black text-sm tracking-tighter">insper</span>
            </div>
            <div>
              <span className="text-xs font-black text-slate-900 block leading-none tracking-wider">AI MATURITY LABS</span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wide mt-1 block">Multiplayer Assessment Board</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-mono text-slate-400 font-bold select-none">Insper Executive Education • 2026</span>
          </div>
        </div>
      </header>

      {/* Main viewport Container */}
      <main className="w-full px-4 md:px-8 xl:px-12 py-6 flex-1 pb-16">
        <ClassroomMode initialGroupId={classroomGroupId} />
      </main>

      {/* Elegant Corporate Minimalist Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-[11px] text-slate-400 select-none font-mono">
        <div className="w-full px-4 md:px-8 xl:px-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold font-sans text-slate-700">Insper AI Maturity Platform</span>
            <span>|</span>
            <span>Ambiente Simplificado</span>
          </div>

          <div className="flex gap-4">
            <span className="text-slate-400">NIST AI RMF &amp; ISO/IEC 42001</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
