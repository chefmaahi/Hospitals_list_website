import React, { useState, useEffect } from 'react';
import { HEALTHCARE_FACILITIES } from './data/healthcareData';
import { ANNAMAYYA_MANDALS } from './data/mandalsData';
import { HealthcareFacility, FilterState, SectorType } from './types/healthcare';
import { MapViewer } from './components/MapViewer';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { OfficialMapModal } from './components/OfficialMapModal';
import { ExportHtmlModal } from './components/ExportHtmlModal';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyD6LoRL-IZYQSNH7cWbc2v9DefTUE7n0Cg';

export default function App() {
  const [quotaExceeded, setQuotaExceeded] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [showOfficialMapModal, setShowOfficialMapModal] = useState<boolean>(false);
  const [showExportHtmlModal, setShowExportHtmlModal] = useState<boolean>(false);
  const [showMandalHeadquarters, setShowMandalHeadquarters] = useState<boolean>(true);
  const [selectedFacility, setSelectedFacility] = useState<HealthcareFacility | null>(null);

  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: '',
    selectedSectors: ['government', 'private', 'diagnostic'],
    selectedMandal: '',
    selectedDivision: '',
    selectedCategory: '',
    only24x7: false,
    onlyEmergency: false
  });

  useEffect(() => {
    const handleQuota = () => {
      setQuotaExceeded(true);
    };
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuota);
    };
  }, []);

  const handleUpdateFilters = (updates: Partial<FilterState>) => {
    setFilterState((prev) => ({ ...prev, ...updates }));
  };

  const handleResetView = () => {
    setFilterState({
      searchQuery: '',
      selectedSectors: ['government', 'private', 'diagnostic'],
      selectedMandal: '',
      selectedDivision: '',
      selectedCategory: '',
      only24x7: false,
      onlyEmergency: false
    });
    setSelectedFacility(null);
  };

  const facilityCounts = {
    total: HEALTHCARE_FACILITIES.length,
    govt: HEALTHCARE_FACILITIES.filter((f) => f.sector === 'government').length,
    pvt: HEALTHCARE_FACILITIES.filter((f) => f.sector === 'private').length,
    diag: HEALTHCARE_FACILITIES.filter((f) => f.sector === 'diagnostic').length
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Required Demo Key In-App Quota Exhaustion Banner */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        onOpenOfficialMap={() => setShowOfficialMapModal(true)}
        onOpenExportHtml={() => setShowExportHtmlModal(true)}
        facilityCounts={facilityCounts}
      />

      {/* Main Workspace: Sidebar & Google Map */}
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar
          facilities={HEALTHCARE_FACILITIES}
          mandals={ANNAMAYYA_MANDALS}
          filterState={filterState}
          onUpdateFilters={handleUpdateFilters}
          selectedFacility={selectedFacility}
          onSelectFacility={setSelectedFacility}
          isOpen={isSidebarOpen}
          onToggleOpen={() => setIsSidebarOpen((prev) => !prev)}
          showMandalHeadquarters={showMandalHeadquarters}
          onToggleMandalHeadquarters={() => setShowMandalHeadquarters((prev) => !prev)}
          onResetView={handleResetView}
        />

        <main className="flex-1 h-full relative">
          <MapViewer
            apiKey={API_KEY}
            facilities={HEALTHCARE_FACILITIES}
            mandals={ANNAMAYYA_MANDALS}
            selectedFacility={selectedFacility}
            onSelectFacility={setSelectedFacility}
            selectedMandal={filterState.selectedMandal}
            showMandalHeadquarters={showMandalHeadquarters}
            selectedSectors={filterState.selectedSectors}
          />
        </main>
      </div>

      {/* Official AP Government Map Reference Modal */}
      <OfficialMapModal
        isOpen={showOfficialMapModal}
        onClose={() => setShowOfficialMapModal(false)}
      />

      {/* Standalone HTML File Exporter Modal */}
      <ExportHtmlModal
        isOpen={showExportHtmlModal}
        onClose={() => setShowExportHtmlModal(false)}
        facilities={HEALTHCARE_FACILITIES}
        mandals={ANNAMAYYA_MANDALS}
        apiKey={API_KEY}
      />
    </div>
  );
}
