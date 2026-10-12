import { HealthcareFacility, MandalInfo } from '../types/healthcare';

export function generateStandaloneHtml(
  facilities: HealthcareFacility[],
  mandals: MandalInfo[],
  apiKey: string
): string {
  const facilitiesJson = JSON.stringify(facilities);
  const mandalsJson = JSON.stringify(mandals);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Annamayya District - Complete Healthcare & Diagnostic GIS Map</title>
  <meta name="description" content="Official GIS Map of Annamayya District showing all Government Hospitals, Private Hospitals, Clinics, and Diagnostic Labs across every Mandal and Town.">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    #map { width: 100%; height: 100%; }
    .custom-scroll::-webkit-scrollbar { width: 6px; }
    .custom-scroll::-webkit-scrollbar-track { background: #0f172a; }
    .custom-scroll::-webkit-scrollbar-thumb { background: #334155; border-radius: 9999px; }
    .custom-scroll::-webkit-scrollbar-thumb:hover { background: #475569; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 h-screen flex flex-col overflow-hidden">
  
  <!-- Header Bar -->
  <header class="bg-slate-900/95 border-b border-slate-800 px-4 py-3 flex items-center justify-between z-30 shrink-0">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold text-lg">
        🏥
      </div>
      <div>
        <h1 class="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          Annamayya District Healthcare Map
          <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Official Directory</span>
        </h1>
        <p class="text-xs text-slate-400 hidden sm:block">Rayachoti HQ | Madanapalle & Rajampet Divisions | 30+ Mandals | 157 Healthcare Centers</p>
      </div>
    </div>
    
    <div class="flex items-center gap-2">
      <a href="https://annamayya.ap.gov.in/map-of-district/" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition">
        <span>Govt Portal</span>
        <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
      </a>
      <button onclick="resetDistrictView()" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-sm transition">
        Reset District View
      </button>
    </div>
  </header>

  <!-- Main Body Layout -->
  <div class="flex-1 flex overflow-hidden relative">
    
    <!-- Sidebar Filters & Directory -->
    <aside class="w-80 md:w-96 bg-slate-900 border-r border-slate-800 flex flex-col z-20 shrink-0">
      
      <!-- Search & Filters Container -->
      <div class="p-3 border-b border-slate-800 space-y-3">
        <!-- Search Box -->
        <div class="relative">
          <input type="text" id="searchInput" placeholder="Search hospital, doctor, mandal..." oninput="filterFacilities()" class="w-full bg-slate-800/90 text-sm text-slate-100 pl-9 pr-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500 placeholder-slate-500">
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </div>

        <!-- Sector Filter Badges -->
        <div class="grid grid-cols-3 gap-1.5 text-xs">
          <button id="btn-govt" onclick="toggleSector('government')" class="p-2 rounded-lg border font-semibold flex flex-col items-center gap-1 transition bg-emerald-950/60 border-emerald-500 text-emerald-300">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Government</span>
            <span id="count-govt" class="text-[10px] text-emerald-400/80 font-mono">42</span>
          </button>
          
          <button id="btn-pvt" onclick="toggleSector('private')" class="p-2 rounded-lg border font-semibold flex flex-col items-center gap-1 transition bg-blue-950/60 border-blue-500 text-blue-300">
            <span class="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>Private</span>
            <span id="count-pvt" class="text-[10px] text-blue-400/80 font-mono">84</span>
          </button>

          <button id="btn-diag" onclick="toggleSector('diagnostic')" class="p-2 rounded-lg border font-semibold flex flex-col items-center gap-1 transition bg-purple-950/60 border-purple-500 text-purple-300">
            <span class="w-2 h-2 rounded-full bg-purple-400"></span>
            <span>Labs / Scans</span>
            <span id="count-diag" class="text-[10px] text-purple-400/80 font-mono">31</span>
          </button>
        </div>

        <!-- Mandal Selector -->
        <div class="flex gap-2">
          <select id="mandalSelect" onchange="onMandalChange()" class="flex-1 bg-slate-800 text-xs text-slate-200 py-1.5 px-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500">
            <option value="">All Mandals / Towns (30 Mandals)</option>
          </select>
        </div>
      </div>

      <!-- Facility List Header -->
      <div class="px-3 py-2 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-medium">
        <span>Showing <strong id="visibleCount" class="text-white">157</strong> Facilities</span>
        <span class="text-[11px] text-emerald-400 font-mono">Click card to locate</span>
      </div>

      <!-- Facilities Scrollable List -->
      <div id="facilitiesList" class="flex-1 overflow-y-auto p-2 space-y-2 custom-scroll">
        <!-- Rendered via JS -->
      </div>
    </aside>

    <!-- Google Map Viewport -->
    <main class="flex-1 h-full relative">
      <div id="map"></div>

      <!-- Floating Legend Overlay -->
      <div class="absolute bottom-5 left-5 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 rounded-xl shadow-2xl text-xs space-y-1.5 z-10 hidden sm:block">
        <div class="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
          <span>Map Markers Legend</span>
        </div>
        <div class="flex items-center gap-2 text-emerald-400">
          <span class="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
          <span>Government Hospital / PHC / CHC</span>
        </div>
        <div class="flex items-center gap-2 text-blue-400">
          <span class="w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></span>
          <span>Private Hospital / Specialist Clinic</span>
        </div>
        <div class="flex items-center gap-2 text-purple-400">
          <span class="w-3 h-3 rounded-full bg-purple-500 shadow-sm shadow-purple-500/50"></span>
          <span>Diagnostic Centre / Pathology Lab</span>
        </div>
        <div class="flex items-center gap-2 text-amber-400">
          <span class="w-3 h-3 rounded bg-amber-500 shadow-sm shadow-amber-500/50"></span>
          <span>Mandal Headquarters / Towns</span>
        </div>
      </div>
    </main>

  </div>

  <script>
    const apiKey = "${apiKey}";
    const facilities = ${facilitiesJson};
    const mandals = ${mandalsJson};

    let map;
    let markers = [];
    let mandalMarkers = [];
    let activeInfoWindow = null;
    let activeSectors = ['government', 'private', 'diagnostic'];

    function initMap() {
      const districtCenter = { lat: 13.95, lng: 78.85 };
      map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: districtCenter,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: true,
        mapTypeControl: true,
        fullscreenControl: true,
        styles: [
          { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "visibility": "on" }] },
          { "featureType": "poi.medical", "elementType": "all", "stylers": [{ "visibility": "on" }] }
        ]
      });

      populateMandalSelect();
      renderMandalHeadquarters();
      renderMarkers();
      renderList();
    }

    function populateMandalSelect() {
      const select = document.getElementById('mandalSelect');
      mandals.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.name;
        opt.textContent = m.name + ' (' + m.division + ' Div)';
        select.appendChild(opt);
      });
    }

    function renderMandalHeadquarters() {
      mandals.forEach(m => {
        const pin = new google.maps.Marker({
          position: { lat: m.lat, lng: m.lng },
          map: map,
          title: m.name + ' Mandal Headquarters',
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 4,
            fillColor: '#f59e0b',
            fillOpacity: 0.9,
            strokeColor: '#78350f',
            strokeWeight: 1.5
          }
        });

        const info = new google.maps.InfoWindow({
          content: '<div class="p-2 text-slate-900"><strong>' + m.name + ' Mandal HQ</strong><br><span style="font-size:12px;color:#475569;">Revenue Division: ' + m.division + '<br>Panchayats: ' + m.panchayatCount + '<br>' + (m.highlightNote || '') + '</span></div>'
        });

        pin.addListener('click', () => {
          if (activeInfoWindow) activeInfoWindow.close();
          info.open(map, pin);
          activeInfoWindow = info;
        });

        mandalMarkers.push(pin);
      });
    }

    function getSectorColor(sector) {
      if (sector === 'government') return '#10b981';
      if (sector === 'private') return '#3b82f6';
      return '#a855f7';
    }

    function renderMarkers() {
      // Clear existing
      markers.forEach(m => m.setMap(null));
      markers = [];

      const query = document.getElementById('searchInput').value.toLowerCase();
      const selectedMandal = document.getElementById('mandalSelect').value;

      facilities.forEach(f => {
        if (!activeSectors.includes(f.sector)) return;
        if (selectedMandal && f.mandal.toLowerCase() !== selectedMandal.toLowerCase()) return;
        if (query) {
          const match = f.name.toLowerCase().includes(query) ||
                        f.mandal.toLowerCase().includes(query) ||
                        f.doctorInCharge.toLowerCase().includes(query) ||
                        f.servicesOrAffiliation.toLowerCase().includes(query) ||
                        f.category.toLowerCase().includes(query);
          if (!match) return;
        }

        const color = getSectorColor(f.sector);
        const marker = new google.maps.Marker({
          position: { lat: f.lat, lng: f.lng },
          map: map,
          title: f.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 7,
            fillColor: color,
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2
          }
        });

        const contentString = \`
          <div style="font-family:'Plus Jakarta Sans',sans-serif; min-width: 250px; max-width: 320px; padding: 4px;" class="text-slate-900">
            <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom: 4px;">
              <span style="font-size: 10px; font-weight:700; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; background: \${color}20; color: \${color};">
                \${f.sector.toUpperCase()} SECTOR
              </span>
              <span style="font-size: 11px; font-weight: 600; color: #64748b;">\${f.mandal}</span>
            </div>
            <h3 style="font-size: 14px; font-weight: 800; color: #0f172a; margin: 2px 0 4px 0; line-height: 1.3;">\${f.name}</h3>
            <p style="font-size: 11px; font-weight: 600; color: #334155; margin-bottom: 6px;">\${f.category}</p>
            <p style="font-size: 11px; color: #475569; margin-bottom: 4px;">📍 \${f.address}</p>
            \${f.contact ? \`<p style="font-size: 11px; color: #0369a1; font-weight:600; margin-bottom: 4px;">📞 <a href="tel:\${f.contact.split('/')[0].trim()}">\${f.contact}</a></p>\` : ''}
            \${f.doctorInCharge ? \`<p style="font-size: 11px; color: #475569; margin-bottom: 6px;">👨‍⚕️ \${f.doctorInCharge}</p>\` : ''}
            \${f.servicesOrAffiliation ? \`<div style="font-size: 10px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 4px; border-radius: 4px; margin-bottom: 8px;">\${f.servicesOrAffiliation}</div>\` : ''}
            <a href="https://www.google.com/maps/search/?api=1&query=\${encodeURIComponent(f.name + ' ' + f.address)}" target="_blank" style="display:inline-block; font-size: 11px; font-weight:700; background: #0f172a; color: #ffffff; padding: 5px 10px; border-radius: 6px; text-decoration:none;">
              Open in Google Maps →
            </a>
          </div>
        \`;

        const infoWindow = new google.maps.InfoWindow({ content: contentString });

        marker.addListener('click', () => {
          if (activeInfoWindow) activeInfoWindow.close();
          infoWindow.open(map, marker);
          activeInfoWindow = infoWindow;
        });

        markers.push(marker);
        marker.facilityData = f;
        marker.infoWindow = infoWindow;
      });
    }

    function renderList() {
      const container = document.getElementById('facilitiesList');
      container.innerHTML = '';

      const query = document.getElementById('searchInput').value.toLowerCase();
      const selectedMandal = document.getElementById('mandalSelect').value;

      let count = 0;
      facilities.forEach(f => {
        if (!activeSectors.includes(f.sector)) return;
        if (selectedMandal && f.mandal.toLowerCase() !== selectedMandal.toLowerCase()) return;
        if (query) {
          const match = f.name.toLowerCase().includes(query) ||
                        f.mandal.toLowerCase().includes(query) ||
                        f.doctorInCharge.toLowerCase().includes(query) ||
                        f.servicesOrAffiliation.toLowerCase().includes(query) ||
                        f.category.toLowerCase().includes(query);
          if (!match) return;
        }

        count++;
        const card = document.createElement('div');
        const color = getSectorColor(f.sector);
        card.className = "p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 cursor-pointer transition flex flex-col gap-1.5";
        card.onclick = () => locateFacility(f);

        card.innerHTML = \`
          <div class="flex items-center justify-between gap-2">
            <span class="text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase" style="background: \${color}25; color: \${color};">
              \${f.sector}
            </span>
            <span class="text-xs text-slate-400 font-medium">📍 \${f.mandal}</span>
          </div>
          <h4 class="text-sm font-bold text-white group-hover:text-emerald-400 leading-snug">\${f.name}</h4>
          <p class="text-xs text-slate-300 font-medium line-clamp-1">\${f.category}</p>
          <p class="text-[11px] text-slate-400 line-clamp-1">📍 \${f.address}</p>
          \${f.contact ? \`<p class="text-[11px] text-cyan-400 font-mono">📞 \${f.contact}</p>\` : ''}
        \`;
        container.appendChild(card);
      });

      document.getElementById('visibleCount').textContent = count;
    }

    function locateFacility(f) {
      map.setCenter({ lat: f.lat, lng: f.lng });
      map.setZoom(16);
      const m = markers.find(item => item.facilityData && item.facilityData.id === f.id);
      if (m) {
        google.maps.event.trigger(m, 'click');
      }
    }

    function toggleSector(sector) {
      if (activeSectors.includes(sector)) {
        if (activeSectors.length > 1) {
          activeSectors = activeSectors.filter(s => s !== sector);
        }
      } else {
        activeSectors.push(sector);
      }
      updateSectorButtonStyles();
      renderMarkers();
      renderList();
    }

    function updateSectorButtonStyles() {
      const btnGovt = document.getElementById('btn-govt');
      const btnPvt = document.getElementById('btn-pvt');
      const btnDiag = document.getElementById('btn-diag');

      btnGovt.style.opacity = activeSectors.includes('government') ? '1' : '0.4';
      btnPvt.style.opacity = activeSectors.includes('private') ? '1' : '0.4';
      btnDiag.style.opacity = activeSectors.includes('diagnostic') ? '1' : '0.4';
    }

    function filterFacilities() {
      renderMarkers();
      renderList();
    }

    function onMandalChange() {
      const val = document.getElementById('mandalSelect').value;
      if (val) {
        const m = mandals.find(item => item.name.toLowerCase() === val.toLowerCase());
        if (m) {
          map.setCenter({ lat: m.lat, lng: m.lng });
          map.setZoom(13);
        }
      } else {
        resetDistrictView();
      }
      renderMarkers();
      renderList();
    }

    function resetDistrictView() {
      map.setCenter({ lat: 13.95, lng: 78.85 });
      map.setZoom(10);
      document.getElementById('mandalSelect').value = '';
      document.getElementById('searchInput').value = '';
      renderMarkers();
      renderList();
    }
  </script>

  <!-- Google Maps API Loader with Demo Key -->
  <script src="https://maps.googleapis.com/maps/api/js?key=\${apiKey}&callback=initMap" async defer></script>
</body>
</html>`;
}
