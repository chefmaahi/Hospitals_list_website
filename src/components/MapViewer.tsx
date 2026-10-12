import React, { useState, useEffect, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap
} from '@vis.gl/react-google-maps';
import { HealthcareFacility, MandalInfo, SectorType } from '../types/healthcare';
import { Building2, ShieldCheck, Activity, MapPin, Phone, User, ExternalLink, Navigation, Compass, Layers } from 'lucide-react';

interface MapViewerProps {
  apiKey: string;
  facilities: HealthcareFacility[];
  mandals: MandalInfo[];
  selectedFacility: HealthcareFacility | null;
  onSelectFacility: (facility: HealthcareFacility | null) => void;
  selectedMandal: string;
  showMandalHeadquarters: boolean;
  selectedSectors: SectorType[];
}

function MapCameraController({
  selectedFacility,
  selectedMandal,
  mandals
}: {
  selectedFacility: HealthcareFacility | null;
  selectedMandal: string;
  mandals: MandalInfo[];
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (selectedFacility) {
      map.panTo({ lat: selectedFacility.lat, lng: selectedFacility.lng });
      map.setZoom(16);
    } else if (selectedMandal) {
      const mandal = mandals.find((m) => m.name.toLowerCase() === selectedMandal.toLowerCase());
      if (mandal) {
        map.panTo({ lat: mandal.lat, lng: mandal.lng });
        map.setZoom(13);
      }
    }
  }, [map, selectedFacility, selectedMandal, mandals]);

  return null;
}

export const MapViewer: React.FC<MapViewerProps> = ({
  apiKey,
  facilities,
  mandals,
  selectedFacility,
  onSelectFacility,
  selectedMandal,
  showMandalHeadquarters,
  selectedSectors
}) => {
  const [selectedMandalInfo, setSelectedMandalInfo] = useState<MandalInfo | null>(null);
  const [mapType, setMapType] = useState<string>('roadmap');

  const getMarkerBadge = useCallback((sector: SectorType) => {
    switch (sector) {
      case 'government':
        return {
          bg: 'bg-emerald-500',
          border: 'border-emerald-300',
          glow: 'shadow-emerald-500/40',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-white" />
        };
      case 'private':
        return {
          bg: 'bg-blue-500',
          border: 'border-blue-300',
          glow: 'shadow-blue-500/40',
          icon: <Building2 className="w-3.5 h-3.5 text-white" />
        };
      case 'diagnostic':
        return {
          bg: 'bg-purple-500',
          border: 'border-purple-300',
          glow: 'shadow-purple-500/40',
          icon: <Activity className="w-3.5 h-3.5 text-white" />
        };
    }
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-950">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={{ lat: 13.95, lng: 78.85 }}
          defaultZoom={9.6}
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          mapTypeId={mapType}
          style={{ width: '100%', height: '100%' }}
          gestureHandling="greedy"
          disableDefaultUI={false}
          options={{
            mapTypeControl: false,
            streetViewControl: true,
            fullscreenControl: false,
            zoomControl: true,
            styles: [
              {
                featureType: 'poi.medical',
                elementType: 'geometry',
                stylers: [{ color: '#059669' }, { visibility: 'on' }]
              }
            ]
          }}
        >
          <MapCameraController
            selectedFacility={selectedFacility}
            selectedMandal={selectedMandal}
            mandals={mandals}
          />

          {/* Render Healthcare Facilities */}
          {facilities.map((facility) => {
            if (!selectedSectors.includes(facility.sector)) return null;

            const badge = getMarkerBadge(facility.sector);
            const isSelected = selectedFacility?.id === facility.id;

            return (
              <AdvancedMarker
                key={facility.id}
                position={{ lat: facility.lat, lng: facility.lng }}
                title={`${facility.name} (${facility.category})`}
                onClick={() => {
                  onSelectFacility(facility);
                  setSelectedMandalInfo(null);
                }}
                zIndex={isSelected ? 50 : facility.sector === 'government' ? 30 : 20}
              >
                <div
                  className={`group relative flex items-center justify-center cursor-pointer transition-all duration-300 ${
                    isSelected ? 'scale-125 z-40' : 'hover:scale-115'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full ${badge.bg} border-2 ${badge.border} shadow-lg ${badge.glow} flex items-center justify-center transition-transform`}
                  >
                    {badge.icon}
                  </div>
                  {/* Pin tail */}
                  <div
                    className={`w-1.5 h-2 -mt-0.5 ${badge.bg} mx-auto rounded-b-sm`}
                  />
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping" />
                  )}
                </div>
              </AdvancedMarker>
            );
          })}

          {/* Render Mandal Headquarters Markers (if toggled) */}
          {showMandalHeadquarters &&
            mandals.map((mandal) => (
              <AdvancedMarker
                key={`mandal-${mandal.name}`}
                position={{ lat: mandal.lat, lng: mandal.lng }}
                title={`${mandal.name} Mandal Headquarters`}
                onClick={() => {
                  setSelectedMandalInfo(mandal);
                  onSelectFacility(null);
                }}
                zIndex={10}
              >
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-950/90 border border-amber-500/70 shadow-md backdrop-blur-sm cursor-pointer hover:bg-amber-900 transition">
                  <Compass className="w-3 h-3 text-amber-400" />
                  <span className="text-[11px] font-bold text-amber-200 tracking-wide whitespace-nowrap">
                    {mandal.name}
                  </span>
                </div>
              </AdvancedMarker>
            ))}

          {/* InfoWindow for Selected Facility */}
          {selectedFacility && (
            <InfoWindow
              position={{ lat: selectedFacility.lat, lng: selectedFacility.lng }}
              onCloseClick={() => onSelectFacility(null)}
              headerContent={
                <div className="flex items-center justify-between gap-2 pr-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase ${
                      selectedFacility.sector === 'government'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedFacility.sector === 'private'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {selectedFacility.sector} sector
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Mandal: {selectedFacility.mandal}
                  </span>
                </div>
              }
            >
              <div className="p-1 max-w-sm text-slate-900 font-sans">
                <h3 className="text-base font-extrabold text-slate-900 leading-snug mb-1">
                  {selectedFacility.name}
                </h3>
                <p className="text-xs font-semibold text-slate-600 mb-2">
                  {selectedFacility.category}
                </p>

                <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 mb-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-relaxed">{selectedFacility.address}</span>
                  </div>

                  {selectedFacility.contact && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <a
                        href={`tel:${selectedFacility.contact.split('/')[0].trim()}`}
                        className="font-mono font-medium text-emerald-700 hover:underline"
                      >
                        {selectedFacility.contact}
                      </a>
                    </div>
                  )}

                  {selectedFacility.doctorInCharge && (
                    <div className="flex items-start gap-2">
                      <User className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                      <span className="text-[11px]">
                        <strong>In-charge / Doctor:</strong> {selectedFacility.doctorInCharge}
                      </span>
                    </div>
                  )}
                </div>

                {selectedFacility.servicesOrAffiliation && (
                  <div className="text-[11px] text-slate-600 bg-emerald-50/60 border border-emerald-100 p-2 rounded-md mb-3 leading-relaxed">
                    <span className="font-semibold text-emerald-900">Key Services / Info:</span>{' '}
                    {selectedFacility.servicesOrAffiliation}
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${selectedFacility.name} ${selectedFacility.address}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition"
                  >
                    <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Get Directions</span>
                    <ExternalLink className="w-3 h-3 text-slate-400 ml-0.5" />
                  </a>
                </div>
              </div>
            </InfoWindow>
          )}

          {/* InfoWindow for Selected Mandal Headquarters */}
          {selectedMandalInfo && (
            <InfoWindow
              position={{ lat: selectedMandalInfo.lat, lng: selectedMandalInfo.lng }}
              onCloseClick={() => setSelectedMandalInfo(null)}
            >
              <div className="p-1 max-w-xs text-slate-900 font-sans">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">
                  Mandal Headquarters
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedMandalInfo.name} Mandal
                </h3>
                <p className="text-xs text-slate-600 mb-2">
                  Revenue Division: <strong>{selectedMandalInfo.division}</strong> | Panchayats:{' '}
                  <strong>{selectedMandalInfo.panchayatCount}</strong>
                </p>
                {selectedMandalInfo.highlightNote && (
                  <p className="text-xs text-slate-700 bg-amber-50 p-2 rounded border border-amber-200 mb-2">
                    {selectedMandalInfo.highlightNote}
                  </p>
                )}
                <div className="text-[11px] text-slate-500">
                  <strong>Key Villages / Towns:</strong>{' '}
                  {selectedMandalInfo.majorTownsOrVillages.slice(0, 6).join(', ')}...
                </div>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>

      {/* Map Style & View Controls Overlay */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-1.5 rounded-xl shadow-xl flex items-center gap-1">
          <button
            onClick={() => setMapType('roadmap')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
              mapType === 'roadmap'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Roadmap
          </button>
          <button
            onClick={() => setMapType('hybrid')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
              mapType === 'hybrid'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setMapType('terrain')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
              mapType === 'terrain'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Terrain
          </button>
        </div>
      </div>
    </div>
  );
};
