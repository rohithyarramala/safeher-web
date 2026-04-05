"use client";
import { useState, useEffect } from "react";
import { 
  Share2, Copy, Check, Radio, Globe, 
  ShieldCheck, Activity, Link as LinkIcon, 
  MapPin, Navigation 
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface LocationSharerProps {
  user: any;
  isSharing: boolean;
  onToggle: () => void;
}

export default function LocationSharer({ user, isSharing, onToggle }: LocationSharerProps) {
  const [copied, setCopied] = useState(false);
  const [isLiveInDB, setIsLiveInDB] = useState(false);
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);

  const shareUrl = typeof window !== "undefined" && user 
    ? `${window.location.origin}/track/${user.id}` 
    : "";

  // --- LIVE COORDINATES: Pull real-time data without a map ---
  useEffect(() => {
    let watchId: number;

    if (isSharing) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => console.error(err),
        { enableHighAccuracy: true }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isSharing]);

  // --- VALIDATOR: Check Supabase Sync ---
  useEffect(() => {
    let interval: any;
    if (isSharing && user) {
      interval = setInterval(async () => {
        const { data } = await supabase
          .from("tracking")
          .select("is_live")
          .eq("user_id", user.id)
          .single();
        setIsLiveInDB(data?.is_live || false);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isSharing, user]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-shell rounded-[2.5rem] border-2 border-[#f2e8f5] bg-white overflow-hidden shadow-sm transition-all">
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-3xl transition-all shadow-sm ${
              isSharing ? 'bg-green-500 text-white animate-pulse' : 'bg-[#fcfaff] text-[#c4b5d1]'
            }`}>
              <Radio size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-black text-[#4f336f] text-xl">Broadcast Orbit</h3>
                {isLiveInDB && (
                  <span className="flex items-center gap-1 bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    <Activity size={10} /> SYNCED
                  </span>
                )}
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {isSharing ? "Signal: Active & Encrypted" : "Signal: Dormant"}
              </p>
            </div>
          </div>

          <button
            onClick={onToggle}
            className={`w-full md:w-auto px-10 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-3 text-sm shadow-xl active:scale-95 ${
              isSharing 
              ? 'bg-red-50 text-red-600 border-2 border-red-100' 
              : 'bg-[#4f336f] text-white'
            }`}
          >
            {isSharing ? "TERMINATE SIGNAL" : "INITIATE LIVE BROADCAST"}
          </button>
        </div>

        {isSharing && (
          <div className="mt-8 space-y-4 animate-in slide-in-from-top-4">
            
            {/* LIVE COORDINATE HUB (Replaces Map) */}
            <div className="bg-[#4f336f] rounded-3xl p-6 text-white relative overflow-hidden shadow-2xl shadow-purple-200">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Navigation size={120} className="rotate-45" />
               </div>
               
               <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6">
                     <div className="h-2 w-2 rounded-full bg-green-400 animate-ping" />
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Live Telemetry</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                        <p className="text-[10px] font-bold text-purple-200 uppercase mb-1">Latitude</p>
                        <p className="text-xl font-mono font-black">{coords?.lat.toFixed(6) || "Searching..."}</p>
                     </div>
                     <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                        <p className="text-[10px] font-bold text-purple-200 uppercase mb-1">Longitude</p>
                        <p className="text-xl font-mono font-black">{coords?.lng.toFixed(6) || "Searching..."}</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* SECURE LINK UI */}
            <div className="bg-[#fcfaff] border-2 border-[#e8d4e5] rounded-3xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-hidden w-full">
                <div className="p-2 bg-white rounded-xl text-[#b64f8f] shadow-sm">
                  <LinkIcon size={18} />
                </div>
                <div className="overflow-hidden">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Secure Tracking Link</p>
                   <p className="text-xs font-mono text-[#7a5a94] truncate">{shareUrl}</p>
                </div>
              </div>
              
              <button 
                onClick={copyToClipboard}
                className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 bg-white border-2 border-[#f2e8f5] px-6 py-3 rounded-2xl text-xs font-black text-[#4f336f] hover:border-[#b64f8f] transition-all"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                {copied ? "COPIED" : "COPY LINK"}
              </button>
            </div>
          </div>
        )}

        {!isSharing && (
          <div className="mt-6 py-10 text-center bg-[#faf8ff] rounded-3xl border-2 border-dashed border-[#e8d4e5]">
            <Globe className="mx-auto text-[#c4b5d1] mb-3 opacity-30" size={40} />
            <p className="text-sm font-bold text-[#7a5a94]">
              Public tracking is currently disabled.
              <br />
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Satellite Link: Offline</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}