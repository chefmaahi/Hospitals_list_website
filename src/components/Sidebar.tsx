import React from 'react';
import { HealthcareFacility, MandalInfo, SectorType, FilterState } from '../types/healthcare';
import {
  Search,
  ShieldCheck,
  Building2,
  Activity,
  MapPin,
  Phone,
  Clock,
  Compass,
  X,
  Navigation,
  SlidersHorizontal
} from 'lucide-react';

interface SidebarProps {
  facilities: HealthcareFacility[];
  mandals: MandalInfo[];
  filterState: FilterState;
  onUpdateFilters: (updates: Partial<FilterState>) => void;
  selectedFacility: HealthcareFacility | null;
  onSelectFacility: (facility: HealthcareFacility | null) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  showMandalHeadquarters: boolean;
  onToggleMandalHeadquarters: () => void;
  onResetView: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  facilities,
  mandals,
  filterState,
  onUpdateFilters,
  selectedFacility,
  onSelectFacility,
  isOpen,
  onToggleOpen,
  showMandalHeadquarters,
  onToggleMandalHeadquarters,
  onResetView
}) => {
  // Counts by sector
  const govtCount = facilities.filter((f) => f.sector === 'government').length;
  const pvtCount = facilities.filter((f) => f.sector === 'private').length;
  const diagCount = facilities.filter((f) => f.sector === 'diagnostic').length;

  // Filter facilities
  const filteredFacilities = facilities.filter((f) => {
    // Sector filter
    if (!filterState.selectedSectors.includes(f.sector)) return false;

    // Mandal filter
    if (filterState.selectedMandal && f.mandal.toLowerCase() !== filterState.selectedMandal.toLowerCase()) {
      return false;
    }

    // Division filter
    if (filterState.selectedDivision) {
      const mandalObj = mandals.find((m) => m.name.toLowerCase() === f.mandal.toLowerCase());
      if (mandalObj && mandalObj.division !== filterState.selectedDivision) {
        return false;
      }
    }

    // 24x7 filter
    if (filterState.only24x7 && !f.is24x7) return false;

    // Emergency filter
    if (filterState.onlyEmergency && !f.hasEmergency) return false;

    // Search query
    if (filterState.searchQuery.trim()) {
      const q = filterState.searchQuery.toLowerCase();
      const match =
        f.name.toLowerCase().includes(q) ||
        f.mandal.toLowerCase().includes(q) ||
        f.address.toLowerCase().includes(q) ||
        f.doctorInCharge.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        f.servicesOrAffiliation.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const toggleSector = (sector: SectorType) => {
    const exists = filterState.selectedSectors.includes(sector);
    let updated: SectorType[];
    if (exists) {
      if (filterState.selectedSectors.length === 1) return; // Keep at least one
      updated = filterState.selectedSectors.filter((s) => s !== sector);
    } else {
      updated = [...filterState.selectedSectors, sector];
    }
    onUpdateFilters({ selectedSectors: updated });
  };

  return (
    <aside
      className={`fixed md:relative inset-y-0 left-0 z-30 w-84 sm:w-96 bg-slate-900/98 backdrop-blur-xl border-r border-slate-800 flex flex-col transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Top Filter Header */}
      <div className="p-3 sm:p-4 border-b border-slate-800 space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white tracking-wide">Filters & Directory</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onResetView}
              className="text-[11px] text-slate-400 hover:text-emerald-400 underline font-medium transition"
            >
              Reset Filters
            </button>
            <button
              onClick={onToggleOpen}
              className="md:hidden p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            value={filterState.searchQuery}
            onChange={(e) => onUpdateFilters({ searchQuery: e.target.value })}
            placeholder="Search hospital, doctor, mandal, or test..."
            className="w-full bg-slate-800/90 text-sm text-slate-100 pl-9 pr-8 py-2 rounded-xl border border-slate-700/80 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder-slate-500 transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          {filterState.searchQuery && (
            <button
              onClick={() => onUpdateFilters({ searchQuery: '' })}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sector Filter Chips */}
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => toggleSector('government')}
            className={`p-2 rounded-xl border font-semibold flex flex-col items-center gap-1 transition ${
              filterState.selectedSectors.includes('government')
                ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 shadow-sm shadow-emerald-900/30'
                : 'bg-slate-800/40 border-slate-800 text-slate-500 opacity-60'
            }`}
          >
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs">Govt</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">
              {govtCount}
            </span>
          </button>

          <button
            onClick={() => toggleSector('private')}
            className={`p-2 rounded-xl border font-semibold flex flex-col items-center gap-1 transition ${
              filterState.selectedSectors.includes('private')
                ? 'bg-blue-950/70 border-blue-500 text-blue-300 shadow-sm shadow-blue-900/30'
                : 'bg-slate-800/40 border-slate-800 text-slate-500 opacity-60'
            }`}
          >
            <div className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs">Private</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400">
              {pvtCount}
            </span>
          </button>

          <button
            onClick={() => toggleSector('diagnostic')}
            className={`p-2 rounded-xl border font-semibold flex flex-col items-center gap-1 transition ${
              filterState.selectedSectors.includes('diagnostic')
                ? 'bg-purple-950/70 border-purple-500 text-purple-300 shadow-sm shadow-purple-900/30'
                : 'bg-slate-800/40 border-slate-800 text-slate-500 opacity-60'
            }`}
          >
            <div className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-xs">Labs</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-400">
              {diagCount}
            </span>
          </button>
        </div>

        {/* Division & Mandal Selectors */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Division
            </label>
            <select
              value={filterState.selectedDivision}
              onChange={(e) =>
                onUpdateFilters({
                  selectedDivision: e.target.value,
                  selectedMandal: ''
                })
              }
              className="w-full bg-slate-800 text-xs text-slate-200 py-1.5 px-2 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500"
            >
              <option value="">All (3 Divisions)</option>
              <option value="Rayachoti">Rayachoti (HQ)</option>
              <option value="Madanapalle">Madanapalle</option>
              <option value="Rajampet">Rajampet</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Mandal / Town
            </label>
            <select
              value={filterState.selectedMandal}
              onChange={(e) => onUpdateFilters({ selectedMandal: e.target.value })}
              className="w-full bg-slate-800 text-xs text-slate-200 py-1.5 px-2 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500"
            >
              <option value="">All Mandals ({mandals.length})</option>
              {mandals
                .filter((m) => !filterState.selectedDivision || m.division === filterState.selectedDivision)
                .map((m) => (
                  <option key={m.name} value={m.name}>
                    {m.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Quick Toggles */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filterState.onlyEmergency}
              onChange={(e) => onUpdateFilters({ onlyEmergency: e.target.checked })}
              className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/20 bg-slate-800"
            />
            <span className="text-[11px]">Emergency Care</span>
          </label>

          <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showMandalHeadquarters}
              onChange={onToggleMandalHeadquarters}
              className="rounded border-slate-700 text-amber-500 focus:ring-amber-500/20 bg-slate-800"
            />
            <span className="text-[11px] text-amber-300">Show Mandal HQs</span>
          </label>
        </div>
      </div>

      {/* Facilities Count Strip */}
      <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span>
          Showing <strong className="text-white">{filteredFacilities.length}</strong> of{' '}
          {facilities.length} Centers
        </span>
        {filterState.selectedMandal && (
          <span className="text-[11px] text-emerald-400 font-semibold">
            {filterState.selectedMandal}
          </span>
        )}
      </div>

      {/* Facility Cards List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scroll">
        {filteredFacilities.length === 0 ? (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <p className="text-sm font-semibold text-slate-300">No medical facilities found</p>
            <p className="text-xs text-slate-500">
              Try adjusting your search terms or resetting the sector and mandal filters.
            </p>
            <button
              onClick={onResetView}
              className="mt-3 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredFacilities.map((f) => {
            const isSelected = selectedFacility?.id === f.id;
            const sectorBorderColor =
              f.sector === 'government'
                ? 'border-emerald-500/40 hover:border-emerald-400'
                : f.sector === 'private'
                ? 'border-blue-500/40 hover:border-blue-400'
                : 'border-purple-500/40 hover:border-purple-400';

            const sectorBadgeColor =
              f.sector === 'government'
                ? 'bg-emerald-500/15 text-emerald-300'
                : f.sector === 'private'
                ? 'bg-blue-500/15 text-blue-300'
                : 'bg-purple-500/15 text-purple-300';

            return (
              <div
                key={f.id}
                onClick={() => onSelectFacility(f)}
                className={`p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border transition cursor-pointer flex flex-col gap-1.5 relative ${sectorBorderColor} ${
                  isSelected ? 'ring-2 ring-emerald-400 bg-slate-800 shadow-lg' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider ${sectorBadgeColor}`}
                  >
                    {f.sector}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{f.mandal}</span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white leading-snug hover:text-emerald-300 transition">
                  {f.name}
                </h4>

                <p className="text-xs text-slate-300 font-medium line-clamp-1">{f.category}</p>

                <p className="text-[11px] text-slate-400 line-clamp-1">📍 {f.address}</p>

                {f.contact && (
                  <div className="flex items-center gap-1.5 text-[11px] text-cyan-400 font-mono">
                    <Phone className="w-3 h-3 text-cyan-500 shrink-0" />
                    <span>{f.contact}</span>
                  </div>
                )}

                {f.is24x7 && (
                  <div className="flex items-center gap-1 text-[10px] text-amber-400 font-semibold mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>24x7 Services Available</span>
                  </div>
                )}

                <div className="pt-2 mt-1 border-t border-slate-700/50 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400">Click to locate on map</span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${f.name} ${f.address}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    <span>Maps</span>
                    <Navigation className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};
