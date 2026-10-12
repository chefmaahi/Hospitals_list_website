import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, ExternalLink, Map as MapIcon } from 'lucide-react';

interface OfficialMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfficialMapModal: React.FC<OfficialMapModalProps> = ({ isOpen, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <MapIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Official Annamayya District Government Map
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  annamayya.ap.gov.in
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Official Revenue Divisions, 30 Mandals & Administrative Boundaries
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://annamayya.ap.gov.in/map-of-district/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
            >
              <span>AP Govt Portal</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
            
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-5 py-2 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>Click buttons to zoom or view original government map image</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.25))}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs px-2 text-slate-300">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition ml-1"
              title="Reset Zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Image Container with Scroll & Zoom */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950/70 custom-scroll">
          <img
            src="https://cdn.s3waas.gov.in/s31be3bc32e6564055d5ca3e5a354acbef/uploads/2026/09/17900612304275-1449x2048.jpg"
            alt="Official Map of Annamayya District"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
            className="max-h-full max-w-full object-contain rounded-lg shadow-2xl transition-transform duration-200 border border-slate-800"
            onError={(e) => {
              // Fallback text if CDN has referrer check
              const target = e.target as HTMLImageElement;
              target.alt = "Official map accessible directly via AP Government Portal link above.";
            }}
          />
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>Source: Government of Andhra Pradesh | District Collectorate, Rayachoti</span>
          <a
            href="https://cdn.s3waas.gov.in/s31be3bc32e6564055d5ca3e5a354acbef/uploads/2026/09/17900612304275-1449x2048.jpg"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
          >
            <span>Open High-Res HD Image in New Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
};
