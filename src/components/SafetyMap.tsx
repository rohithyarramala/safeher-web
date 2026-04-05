'use client';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import "leaflet-defaulticon-compatibility";
import { useEffect, useState } from 'react';
import L from "leaflet";

// --- Custom Icon Logic ---
const createCustomIcon = (isPolice: boolean) => {
  const color = isPolice ? 'text-red-600' : 'text-blue-600';
  const bgColor = isPolice ? 'bg-red-100' : 'bg-blue-100';
  const borderColor = isPolice ? 'border-red-400' : 'border-blue-400';

  return L.divIcon({
    html: `
      <div class="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 ${bgColor} ${color} rounded-full border-2 ${borderColor} shadow-lg hover:scale-110 transition-transform">
        <span class="text-sm md:text-lg">${isPolice ? '🚨' : '🏥'}</span>
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
};

// --- Helper: Auto-recenter map when GPS loads ---
function RecenterMap({ coord, zoom }: { coord: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coord, zoom);
  }, [coord, zoom, map]);
  return null;
}

interface SafePlacesProps {
    lat: number;
    lng: number;
    visible: boolean;
}

function SafePlaces({ lat, lng, visible }: SafePlacesProps) {
  const [places, setPlaces] = useState<any[]>([]);
  const API_KEY = "c1a8c4fe799e463f9c48323b89e8ad25";

  useEffect(() => {
    if (!visible || lat == null || lng == null) return;
    const controller = new AbortController();

    const fetchPlaces = async () => {
      try {
        const url = `https://api.geoapify.com/v2/places?categories=service.police,healthcare.hospital,service.fire_station&filter=circle:${lng},${lat},5000&limit=20&apiKey=${API_KEY}`;
        const res = await fetch(url, { signal: controller.signal });
        const data = await res.json();

        if (data.features) {
          const formatted = data.features.map((f: any) => ({
            id: f.properties.place_id,
            lat: f.geometry.coordinates[1],
            lon: f.geometry.coordinates[0],
            name: f.properties.name || "Safe Point",
            category: f.properties.categories || [],
          }));
          setPlaces(formatted);
        }
      } catch (err) {
        const isAbortError =
          err instanceof DOMException
            ? err.name === "AbortError"
            : typeof err === "object" &&
              err !== null &&
              "name" in err &&
              (err as { name?: string }).name === "AbortError";

        if (!isAbortError) setPlaces([]);
      }
    };

    fetchPlaces();
    return () => controller.abort();
  }, [lat, lng, visible]);

  if (!visible || places.length === 0) return null;

  return (
    <>
      {places.map((p) => {
        const isPolice = p.category?.some((c: string) => c.includes("police"));
        const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}`;

        return (
          <Marker key={p.id} position={[p.lat, p.lon]} icon={createCustomIcon(isPolice)}>
            <Popup className="custom-popup">
              <div className="p-1 font-sans">
                <p className="font-bold text-gray-900">{isPolice ? "🚨 Police" : "🏥 Hospital"}</p>
                <p className="text-[11px] text-gray-600 mb-2 leading-tight">{p.name}</p>
                <a href={directionsUrl} target="_blank" rel="noopener noreferrer" 
                   className="block w-full text-center bg-blue-600 text-white text-[10px] py-1.5 rounded font-bold uppercase tracking-tight">
                   Directions
                </a>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

export default function SafetyMap() {
    const [coord, setCoord] = useState<[number, number] | null>(null);
    const [threat, setThreat] = useState<string>("Low");
    const [showDangerZone, setShowDangerZone] = useState(true);
    const [showSafePlaces, setShowSafePlaces] = useState(true);
    const [isFullMapView, setIsFullMapView] = useState(false);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
            setCoord([pos.coords.latitude, pos.coords.longitude]);
            // Prediction API logic...
        });
    }, []);

    if (!coord) return (
        <div className="h-[400px] md:h-[600px] flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <div className="text-center animate-pulse">
                <p className="text-blue-500 font-bold">📍 Locating You...</p>
                <p className="text-xs text-gray-400">Please allow location access</p>
            </div>
        </div>
    );

    const zoneColor = threat === "Critical" ? "#ef4444" : threat === "High" ? "#f97316" : "#22c55e";

    return (
        <div className="relative w-full rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-white">
            
            {/* --- RESPONSIVE CONTROL PANEL --- */}
            <div className="absolute top-3 left-3 right-3 md:left-auto md:top-4 md:right-4 z-[1000] 
                            bg-white/90 backdrop-blur-md p-3 md:p-4 rounded-xl shadow-lg 
                            md:w-64 border border-white/20">
                <div className="flex md:flex-col gap-4 md:gap-3 items-center md:items-stretch overflow-x-auto no-scrollbar">
                    <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                        <input type="checkbox" checked={showDangerZone} onChange={() => setShowDangerZone(!showDangerZone)} className="w-4 h-4 accent-red-500" />
                        <span className="text-[10px] md:text-xs font-bold text-gray-700">Danger Zone</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                        <input type="checkbox" checked={showSafePlaces} onChange={() => setShowSafePlaces(!showSafePlaces)} className="w-4 h-4 accent-blue-600" />
                        <span className="text-[10px] md:text-xs font-bold text-gray-700">Safe Places</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                        <input type="checkbox" checked={isFullMapView} onChange={() => setIsFullMapView(!isFullMapView)} className="w-4 h-4 accent-indigo-600" />
                        <span className="text-[10px] md:text-xs font-bold text-gray-700">District View</span>
                    </label>
                </div>
                <div className="hidden md:block mt-3 pt-2 border-t border-gray-100">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Threat Level: </span>
                    <span className="text-[10px] font-black uppercase" style={{ color: zoneColor }}>{threat}</span>
                </div>
            </div>

            {/* --- MAP CONTAINER --- */}
            <MapContainer 
                center={coord} 
                zoom={isFullMapView ? 12 : 15} 
                scrollWheelZoom={false} // 💡 CRITICAL: Prevents map from hijacking scroll on mobile
                dragging={!L.Browser.mobile} // 💡 Optional: Disable drag on mobile to allow page scroll (or use 2 fingers)
                style={{ height: '70vh', minHeight: '400px', width: '100%' }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <RecenterMap coord={coord} zoom={isFullMapView ? 12 : 15} />
                
                <Marker position={coord}>
                    <Popup>Your current location. Status: {threat}</Popup>
                </Marker>

                {showDangerZone && (
                    <Circle 
                        center={coord} 
                        pathOptions={{ fillColor: zoneColor, color: zoneColor, weight: 1, fillOpacity: 0.3 }} 
                        radius={isFullMapView ? 5000 : 1000} 
                    />
                )}
                
                <SafePlaces lat={coord[0]} lng={coord[1]} visible={showSafePlaces} />
            </MapContainer>

            {/* --- MOBILE FOOTER --- */}
            <div className="md:hidden bg-white p-3 border-t flex justify-between items-center px-6">
                <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-bold text-gray-400">Current Threat</span>
                    <span className="text-xs font-black uppercase" style={{ color: zoneColor }}>{threat}</span>
                </div>
                <p className="text-[9px] text-gray-400 italic">Two fingers to move map</p>
            </div>
        </div>
    );
}