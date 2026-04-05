"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, ShieldCheck, Activity, AlertTriangle, Clock } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import { useMap } from "react-leaflet";

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
// Fix for Leaflet
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Circle = dynamic(() => import("react-leaflet").then((mod) => mod.Circle), { ssr: false });

function RecenterMap({ coords }: { coords: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(coords);
  }, [coords, map]);

  return null;
}

export default function PublicTrackPage({ params }: { params: Promise<{ id: string }> }) {
  // --- NEXT.JS 15 FIX: Unwrap the params promise ---
  const { id } = React.use(params); 

  const [location, setLocation] = useState<{ lat: number; lng: number; updated_at: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLocation = async () => {
    if (!id || id === "undefined") return;
    
    try {
      const res = await fetch(`/api/track/${id}`);
      const data = await res.json();

      if (res.ok) {
        setLocation(data);
        setError(null);
      } else {
        setError(data.error || "Signal Lost");
      }
    } catch (err) {
      setError("Connection Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
    const interval = setInterval(fetchLocation, 5000);
    return () => clearInterval(interval);
  }, [id]); // Depend on the unwrapped 'id'

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#faf8ff]">
      <Activity className="animate-spin text-[#b64f8f] mb-4" size={40} />
      <p className="font-black text-[#4f336f] animate-pulse uppercase tracking-widest text-xs">Connecting to Secure Orbit...</p>
    </div>
  );

  return (
    <div className="h-screen w-full flex flex-col bg-[#faf8ff] overflow-hidden">
      <header className="p-4 md:p-6 bg-white border-b flex items-center justify-between z-[1000] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-[#4f336f] p-2 rounded-xl text-white shadow-lg">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="font-black text-[#4f336f] text-lg leading-tight">SafeHer Live Preview</h1>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
              {location ? "● Signal Active" : "○ Searching..."}
            </p>
          </div>
        </div>
        {location && (
            <div className="bg-green-50 px-4 py-2 rounded-2xl border border-green-100 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
                <span className="text-[10px] font-black text-green-700 uppercase">Live Sync</span>
            </div>
        )}
      </header>

      <main className="flex-1 relative">
        {error ? (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md p-8 text-center">
            <div className="max-w-sm">
              <AlertTriangle className="text-red-500 mx-auto mb-4" size={50} />
              <h2 className="text-2xl font-black text-[#4f336f] mb-2">Broadcasting Suspended</h2>
              <p className="text-sm text-gray-400 font-medium mb-6">{error}</p>
              <button onClick={() => window.location.reload()} className="bg-[#4f336f] text-white px-8 py-3 rounded-2xl font-black w-full shadow-lg">RE-ESTABLISH CONNECTION</button>
            </div>
          </div>
        ) : location && (
          <MapContainer 
  center={[location.lat, location.lng]} 
  zoom={15} 
  className="h-full w-full"
>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  
  {/* Add the icon prop here */}
  <Marker position={[location.lat, location.lng]} icon={customIcon}>
    <Circle 
      center={[location.lat, location.lng]} 
      radius={150} 
      pathOptions={{ fillColor: '#4f336f', color: '#4f336f', weight: 1, opacity: 0.2 }} 
    />
  </Marker>
  
  <RecenterMap coords={[location.lat, location.lng]} />
</MapContainer>
        )}

        {location && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-sm">
            <div className="bg-white/90 backdrop-blur-xl p-5 rounded-[2.5rem] shadow-2xl border border-white flex items-center gap-4">
              <div className="bg-[#b64f8f] p-4 rounded-3xl text-white shadow-xl shadow-pink-100">
                <MapPin size={24} className="animate-bounce" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Target Coordinates</p>
                <p className="font-mono font-black text-[#4f336f] text-sm truncate">
                  LAT: {location.lat.toFixed(5)} <br/> LNG: {location.lng.toFixed(5)}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}