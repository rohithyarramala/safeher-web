"use client";
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import Sidebar from "@/components/Sidebar";
import EmergencyContacts from "@/components/EmergencyContacts";
import { MapIcon, MapPin, Share2, Copy, Check } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SafetyMap = dynamic(() => import('../../components/SafetyMap.js').then((mod) => mod.default), { 
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-50 flex items-center justify-center rounded-3xl animate-pulse text-[#7e5f97] font-bold text-sm">📍 Syncing Map...</div>
});

export default function DashboardPage() {
  const [currentCoord, setCurrentCoord] = useState<[number, number] | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // 1. Get Logged-in User Info
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    navigator.geolocation.getCurrentPosition((pos) => {
      setCurrentCoord([pos.coords.latitude, pos.coords.longitude]);
    });
  }, []);

  // 2. The Tracking URL for friends
  const shareUrl = user ? `${window.location.origin}/track/${user.id}` : "";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleLiveShare = () => {
    if (!user) return alert("Please log in to share location.");

    if (isSharing) {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsSharing(false);
      
      // Mark as offline in DB
      supabase.from('tracking').update({ is_live: false }).eq('user_id', user.id);
    } else {
      setIsSharing(true);
      const id = navigator.geolocation.watchPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setCurrentCoord([latitude, longitude]);

          // 🔥 FIXED: Using real user.id instead of "USER_ID_HERE"
          await supabase.from('tracking').upsert({ 
            user_id: user.id, 
            lat: latitude, 
            lng: longitude,
            is_live: true,
            updated_at: new Date() 
          });
        },
        (err) => console.error(err),
        { enableHighAccuracy: true }
      );
      setWatchId(id);
    }
  };

  return (
    <div className="safeher-page md:flex">
      <Sidebar variant="user" />
      <main className="flex-1 p-4 md:p-8 md:ml-72">
        <section className="glass-shell rounded-3xl p-5 md:p-7 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <p className="safeher-pill safeher-pill-pink mb-2">Personal Dashboard</p>
              <h1 className="text-3xl md:text-4xl font-black text-[#4f336f]">Your Safety Overview</h1>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={toggleLiveShare}
                className={`rounded-2xl border px-6 py-3 font-black transition-all shadow-sm flex items-center gap-2 ${
                  isSharing ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-[#e8d4e5] text-[#7a5a94] hover:bg-gray-50'
                }`}
              >
                <MapPin size={18} className={isSharing ? "animate-bounce" : ""} />
                {isSharing ? "TRACKING ACTIVE" : "SHARE LIVE LOCATION"}
              </button>
            </div>
          </div>

          {/* --- SHARE URL UI --- */}
          {isSharing && (
            <div className="mt-4 p-4 bg-white/60 border border-green-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                  <Share2 size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Share this link with trusted friends:</p>
                  <p className="text-xs font-mono text-gray-500 truncate max-w-[200px] md:max-w-md">{shareUrl}</p>
                </div>
              </div>
              <button 
                onClick={copyToClipboard}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                {copied ? "COPIED!" : "COPY LINK"}
              </button>
            </div>
          )}
        </section>

        <section className="grid xl:grid-cols-2 gap-6">
          <div className="safeher-card p-5 md:p-6 lg:col-span-1">
             <div className="flex items-center gap-2 mb-4">
                <MapIcon size={20} className="text-[#b64f8f]" />
                <h2 className="text-xl font-black text-[#5e3f82]">Live Safety Map</h2>
             </div>
             <div className="rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-gray-100 h-[400px] md:h-[500px]">
                <SafetyMap />
             </div>
          </div>

          <article className="safeher-card p-5 md:p-6">
            <h2 className="text-xl font-black text-[#5e3f82] mb-4">Emergency Contacts</h2>
            <EmergencyContacts />
          </article>
        </section>
      </main>
    </div>
  );
}