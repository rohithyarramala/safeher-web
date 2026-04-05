"use client";
import { useEffect, useState, useRef } from "react";
import dynamic from 'next/dynamic';
import Sidebar from "@/components/Sidebar";
import { AlertOctagon, Phone, MessageSquare, ShieldAlert, Loader2, MapPin } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import LocationSharer from "@/components/LocationSharer.js";

// Client for database operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SafetyMap = dynamic(() => import('../../components/SafetyMap.js').then((mod) => mod.default), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-50 flex items-center justify-center rounded-3xl animate-pulse text-[#7e5f97] font-bold text-sm">📍 Syncing Map...</div>
});

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<any[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const userRef = useRef<any>(null);

  useEffect(() => {
    const syncSession = async () => {
      try {
        // 1. Try to get session from API
        const res = await fetch("/api/session");

        if (res.ok) {
          const data = await res.json();
          setupDashboard(data.user, data.supabaseAccessToken);
        } else {
          // 2. BACKUP: Check if token exists in localStorage if API fails
          const savedToken = localStorage.getItem('safeher-token');
          if (savedToken) {
            // You would decode this locally or just use the ID
            // For now, let's assume the API must work
            console.error("API Unauthorized. Check your JWT_SECRET env variable.");
          }
        }
      } catch (err) {
        console.error("Dashboard Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };

    const setupDashboard = async (userData: any, token: string) => {
      setUser(userData);
      userRef.current = userData;

      // 1. SKIP setSession if it's causing signature errors.
      // Instead, we will fetch data normally. 
      // ⚠️ Ensure RLS is DISABLED for this table in Supabase for this to work.

      console.log("📡 Fetching contacts for ID:", userData.id);

      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', userData.id);


      console.log("📊 Contacts Fetch Result:", { data, error });
      if (error) {
        console.error("❌ Fetch Error:", error.message);
      } else {
        console.log("✅ Success:", data);
        setContacts(data || []);
      }
    };

    syncSession();
  }, []);
  const toggleLiveShare = async () => {
    const activeUser = userRef.current;
    if (!activeUser) return alert("Session expired. Please log in.");

    if (isSharing) {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsSharing(false);
      await supabase.from('tracking').update({ is_live: false }).eq('user_id', activeUser.id);
    } else {
      setIsSharing(true);
      const id = navigator.geolocation.watchPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          await supabase.from('tracking').upsert({
            user_id: activeUser.id,
            lat: latitude,
            lng: longitude,
            is_live: true,
            updated_at: new Date().toISOString()
          });
        },
        (err) => { console.error(err); setIsSharing(false); },
        { enableHighAccuracy: true }
      );
      setWatchId(id);
    }
  };
const triggerSOS = async () => {
  // Use the ref to get the most recent user data without waiting for re-renders
  const activeUser = userRef.current;
  
  if (!activeUser) {
    alert("Safety session not found. Please log in again.");
    return;
  }

  try {
    setIsRecording(true);

    // 1. Capture Media & Current Location
    const [stream, position] = await Promise.all([
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: true }),
      new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000
        });
      })
    ]);

    const mediaRecorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

mediaRecorder.onstop = async () => {
  stream.getTracks().forEach(track => track.stop());
  setIsRecording(false);

  const blob = new Blob(chunks, { type: "video/webm" });
  const formData = new FormData();
  formData.append("file", blob);
  formData.append("userId", activeUser.id);

  try {
    const uploadRes = await fetch("/api/sos/upload", {
      method: "POST",
      body: formData,
    });

    const uploadData = await uploadRes.json();
    if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");

    // --- DEBUGGING INSERT ---
    console.log("Attempting Vault Insert with:", {
      user_id: activeUser.id,
      video_url: uploadData.url
    });

    const { error: dbError } = await supabase
      .from("sos_vault")
      .insert([{
        user_id: activeUser.id, 
        video_url: uploadData.url, // Ensure this matches your column name 'video_url'
        status: 'PENDING',
        location_snapshot: {
          lat: (position as any).coords.latitude,
          lng: (position as any).coords.longitude,
          accuracy: (position as any).coords.accuracy,
          timestamp: new Date().toISOString()
        }
      }]);

    if (dbError) {
      // THIS WILL LOG THE EXACT REASON (e.g., "foreign key violation" or "column does not exist")
      console.error("❌ SUPABASE DB ERROR:", dbError.message);
      console.error("❌ ERROR DETAILS:", dbError.details);
      console.error("❌ ERROR HINT:", dbError.hint);
      throw dbError; 
    }

    alert("🚨 SOS SECURED: Evidence uploaded.");

  } catch (uploadErr: any) {
    console.error("Vault/Upload Error:", uploadErr);
    alert(`SOS Alert triggered, but storage failed: ${uploadErr.message}`);
  }
};

    // 5. Start recording for 5 seconds
    mediaRecorder.start();
    setTimeout(() => {
      if (mediaRecorder.state === "recording") {
        mediaRecorder.stop();
      }
    }, 5000);

  } catch (err) {
    setIsRecording(false);
    console.error("Hardware/Permission Error:", err);
    alert("Camera and Location access are required for the SOS Shield.");
  }
};
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#faf8ff]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#b64f8f]" size={50} />
          <p className="font-black text-[#4f336f] animate-pulse uppercase tracking-widest text-sm">Syncing Shield...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white p-6">
        <div className="safeher-card p-10 text-center max-w-md border-2 border-red-50">
          <ShieldAlert className="mx-auto text-red-400 mb-4" size={48} />
          <h2 className="text-2xl font-black text-[#4f336f] mb-2">Unauthorized</h2>
          <p className="text-sm text-gray-500 mb-6">Please log in to access your safety dashboard.</p>
          <button onClick={() => window.location.href = '/login'} className="safeher-btn-primary w-full py-3">LOGIN</button>
        </div>
      </div>
    );
  }

  return (
    <div className="safeher-page md:flex bg-[#faf8ff] min-h-screen">
      <Sidebar variant="user" />
      <main className="flex-1 p-4 md:p-8 md:ml-72">

        {/* SOS HEADER */}
        <header className="glass-shell rounded-3xl p-6 mb-6 flex flex-col md:flex-row gap-6 items-center justify-between border-2 border-red-50 bg-gradient-to-r from-white to-red-50/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Live Security Active</p>
            </div>
            <h1 className="text-3xl font-black text-[#4f336f]">SafeHer Shield</h1>
          </div>

          <button
            onClick={triggerSOS}
            disabled={isRecording}
            className="w-full md:w-auto bg-red-600 text-white px-10 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl transition-all disabled:opacity-50"
          >
            {isRecording ? <Loader2 className="animate-spin" /> : <AlertOctagon size={24} />}
            {isRecording ? "RECORDING..." : "TRIGGER SOS"}
          </button>
        </header>

        <section className="mb-8">
          <LocationSharer user={user} isSharing={isSharing} onToggle={toggleLiveShare} />
        </section>

        <section className="grid xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 safeher-card p-0 overflow-hidden border-4 border-white shadow-xl h-[550px] relative">
            <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-xl border font-bold text-[#b64f8f] text-xs">
              📍 Active Monitoring
            </div>
            <SafetyMap />
          </div>

          <aside className="safeher-card p-6 border-2 border-[#f2e8f5]">
            <h2 className="text-xl font-black text-[#5e3f82] mb-6 flex items-center gap-2">
              <Phone size={20} className="text-[#b64f8f]" />
              Emergency Circle
            </h2>
            <div className="space-y-4">
              {contacts.length > 0 ? contacts.map((contact, idx) => (
                <div key={idx} className="p-4 bg-[#fcfaff] border-2 border-[#f2e8f5] rounded-2xl flex items-center justify-between hover:border-[#b64f8f] transition-all">
                  <div>
                    <h4 className="font-black text-[#4f336f]">{contact.label}</h4>
                    <p className="text-[10px] text-gray-400 font-bold tracking-widest">{contact.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <a href={`tel:${contact.phone}`} className="p-3 bg-white border border-gray-100 text-blue-600 rounded-xl shadow-sm">
                      <Phone size={18} />
                    </a>
                    <a
                      href={`https://wa.me/${contact.phone}?text=HELP!%20My%20Location:%20${window.location.origin}/track/${user.id}`}
                      target="_blank"
                      className="p-3 bg-white border border-gray-100 text-green-600 rounded-xl shadow-sm"
                    >
                      <MessageSquare size={18} />
                    </a>
                  </div>
                </div>
              )) : (
                <p className="text-center text-sm text-gray-400 py-10 italic">No contacts found.</p>
              )}
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}