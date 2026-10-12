import React from 'react';
import { Map, Download, Menu, Sparkles, Building, Activity, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
  onOpenOfficialMap: () => void;
  onOpenExportHtml: () => void;
  facilityCounts: {
    total: number;
    govt: number;
    pvt: number;
    diag: number;
  };
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  onOpenOfficialMap,
  onOpenExportHtml,
  facilityCounts
}) => {
  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 flex items-center justify-between z-30 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 md:hidden transition"
          aria-label="Toggle Directory Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold text-base">
            🏥
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                Annamayya District Healthcare Map
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                GIS Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Rayachoti HQ • Madanapalle & Rajampet Divisions • 30 Mandals • All Villages & Towns
            </p>
          </div>
        </div>
      </div>

      {/* Center Sector Badges Preview */}
      <div className="hidden lg:flex items-center gap-2 text-xs font-semibold">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Govt: {facilityCounts.govt}</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-950/60 border border-blue-500/30 text-blue-300">
          <Building className="w-3.5 h-3.5 text-blue-400" />
          <span>Private: {facilityCounts.pvt}</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-500/30 text-purple-300">
          <Activity className="w-3.5 h-3.5 text-purple-400" />
          <span>Labs: {facilityCounts.diag}</span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenOfficialMap}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700/80 flex items-center gap-1.5 transition"
        >
          <Map className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Govt District Map</span>
          <span className="sm:hidden">Govt Map</span>
        </button>

        <button
          onClick={onOpenExportHtml}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export HTML</span>
        </button>
      </div>
    </header>
  );
};
