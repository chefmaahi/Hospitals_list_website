import React, { useState } from 'react';
import { HealthcareFacility, MandalInfo } from '../types/healthcare';
import { generateStandaloneHtml } from '../utils/generateStandaloneHtml';
import { X, Download, Code, Check, FileCheck, Eye } from 'lucide-react';

interface ExportHtmlModalProps {
  isOpen: boolean;
  onClose: () => void;
  facilities: HealthcareFacility[];
  mandals: MandalInfo[];
  apiKey: string;
}

export const ExportHtmlModal: React.FC<ExportHtmlModalProps> = ({
  isOpen,
  onClose,
  facilities,
  mandals,
  apiKey
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const htmlContent = generateStandaloneHtml(facilities, mandals, apiKey);

  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'annamayya-district-healthcare-map.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePreviewNewTab = () => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Export Standalone HTML File
              </h3>
              <p className="text-xs text-slate-400">
                Single self-contained HTML file containing all 157 medical centers & interactive map
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs text-slate-300">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <span>What is included in this standalone HTML file?</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Complete Annamayya District Google Map with custom markers and styling</li>
              <li>All 42 Government Hospitals, Area Hospitals, CHCs, and PHCs</li>
              <li>All 84 Private Hospitals, Nursing Homes, and Clinics</li>
              <li>All 31 Radiology, Scan Centres, and Pathology Labs</li>
              <li>Interactive filters: Government, Private, Diagnostic sectors</li>
              <li>All 30 Mandals dropdown with instant focus & pan</li>
              <li>No external server required — works directly in Chrome, Firefox, Safari, or Edge!</li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={handleDownload}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition"
            >
              <Download className="w-4 h-4" />
              <span>{downloadSuccess ? 'Downloaded!' : 'Download .html File'}</span>
            </button>

            <button
              onClick={handlePreviewNewTab}
              className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 flex items-center justify-center gap-2 transition"
            >
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>Preview in Tab</span>
            </button>

            <button
              onClick={handleCopy}
              className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 flex items-center justify-center gap-2 transition"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Code className="w-4 h-4 text-slate-400" />
                  <span>Copy HTML</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>File name: <strong>annamayya-district-healthcare-map.html</strong></span>
          <span>Size: ~75 KB self-contained</span>
        </div>

      </div>
    </div>
  );
};
