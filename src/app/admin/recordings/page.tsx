"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Play, ShieldAlert, FileSearch, CheckCircle, Clock, Loader2, X, Download, ExternalLink, MapPin } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminRecordingsPage() {
  const [recordings, setRecordings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRec, setSelectedRec] = useState<any>(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, escalated: 0 });

  const fetchRecordings = async () => {
    setLoading(true);
    
    // 1. Fetching from your 'sos_vault' table and joining with 'profiles'
    const { data, error } = await supabase
      .from("sos_vault")
      .select(`
        *,
        profiles (
          full_name,
          phone
        )
      `)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setRecordings(data);
      setStats({
        total: data.length,
        pending: data.filter(r => r.status === "PENDING").length,
        escalated: data.filter(r => r.status === "REVIEWED").length // Adjust based on your status logic
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecordings();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("sos_vault")
      .update({ status })
      .eq("id", id);
    
    if (!error) {
      setRecordings(recordings.map(r => r.id === id ? { ...r, status } : r));
      if (selectedRec?.id === id) setSelectedRec({ ...selectedRec, status });
    }
  };

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#faf8ff]">
      <Loader2 className="animate-spin text-[#b64f8f]" size={40} />
    </div>
  );

  return (
    <div className="safeher-page md:flex bg-[#faf8ff] min-h-screen">
      <Sidebar variant="admin" />
      <main className="flex-1 p-4 md:p-8 md:ml-72">
        
        {/* HEADER */}
        <section className="glass-shell rounded-[2.5rem] p-6 md:p-10 mb-8 border-2 border-white shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <FileSearch className="text-[#b64f8f]" size={18} />
            <p className="text-[10px] font-black text-[#b64f8f] uppercase tracking-widest">Incident Evidence</p>
          </div>
          <h1 className="text-4xl font-black text-[#4f336f] tracking-tight">SOS Vault</h1>
          <p className="text-[#7e5f97] mt-2 font-medium">Review emergency recordings and GPS snapshots captured by users.</p>
        </section>

        {/* QUICK STATS */}
        <section className="grid sm:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Total Incidents", value: stats.total, icon: <Clock size={20}/> },
            { label: "Awaiting Action", value: stats.pending, icon: <Loader2 size={20}/> },
            { label: "Under Review", value: stats.escalated, icon: <ShieldAlert size={20}/> }
          ].map((s, i) => (
            <div key={i} className="safeher-card p-6 border-2 border-white flex justify-between items-center bg-white shadow-xl shadow-purple-50/20">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                <p className="text-3xl font-black text-[#4f336f]">{s.value}</p>
              </div>
              <div className="text-[#b64f8f] opacity-20">{s.icon}</div>
            </div>
          ))}
        </section>

        {/* TABLE */}
        <section className="safeher-card p-0 overflow-hidden border-2 border-white shadow-xl">
          <div className="overflow-x-auto">
            <table className="safeher-table w-full">
              <thead className="bg-[#faf8ff] border-b border-[#f2e8f5]">
                <tr>
                  <th className="text-left p-6">User / Identity</th>
                  <th className="text-left">Captured At</th>
                  <th className="text-left">Coordinates</th>
                  <th className="text-left">Status</th>
                  <th className="text-right p-6">Evidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2e8f5]">
                {recordings.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#fcfaff] transition-colors group">
                    <td className="p-6">
                      <p className="font-black text-[#4f336f] text-sm">{rec.profiles?.full_name || "Anonymous"}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{rec.profiles?.phone || "No Phone"}</p>
                    </td>
                    <td className="text-xs font-bold text-[#7e5f97]">
                      {new Date(rec.created_at).toLocaleString()}
                    </td>
                    <td className="text-[10px] font-black text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} className="text-[#b64f8f]" />
                        {rec.location_snapshot?.lat.toFixed(4)}, {rec.location_snapshot?.lng.toFixed(4)}
                      </div>
                    </td>
                    <td>
                      <span className={`safeher-pill text-[10px] ${
                        rec.status === "REVIEWED" ? "safeher-pill-indigo" : rec.status === "PENDING" ? "safeher-pill-pink" : "safeher-pill-green"
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => setSelectedRec(rec)}
                        className="p-3 bg-[#4f336f] text-white rounded-xl hover:bg-[#b64f8f] transition-all shadow-lg shadow-purple-100"
                      >
                        <Play size={16} fill="currentColor" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* MEDIA PLAYER MODAL */}
        {selectedRec && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#4f336f]/80 backdrop-blur-sm" onClick={() => setSelectedRec(null)}></div>
            <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              
              <div className="p-8 border-b flex justify-between items-center bg-[#faf8ff]">
                <div>
                  <h2 className="text-xl font-black text-[#4f336f]">Evidence Playback</h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Incident ID: {selectedRec.id.slice(0, 12)}</p>
                </div>
                <button onClick={() => setSelectedRec(null)} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-all">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8">
                {/* VIDEO PLAYER */}
                <div className="aspect-video bg-black rounded-3xl mb-6 flex items-center justify-center overflow-hidden shadow-inner">
                  {selectedRec.video_url ? (
                    <video controls autoPlay className="w-full h-full">
                      <source src={selectedRec.video_url} type="video/webm" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <p className="text-gray-500 font-bold italic">No video source found</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 mb-8">
                  <button onClick={() => updateStatus(selectedRec.id, 'REVIEWED')} className="flex-1 py-4 bg-green-50 text-green-700 rounded-2xl font-black text-xs flex items-center justify-center gap-2 border border-green-100 hover:bg-green-100 transition-all">
                    <CheckCircle size={16} /> MARK AS REVIEWED
                  </button>
                  <button onClick={() => updateStatus(selectedRec.id, 'RESOLVED')} className="flex-1 py-4 bg-[#4f336f] text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 border border-[#4f336f] hover:bg-[#3a2652] transition-all">
                    <ShieldAlert size={16} /> RESOLVE INCIDENT
                  </button>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-dashed border-gray-200">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">User Profile</p>
                    <p className="font-black text-[#4f336f] text-sm">{selectedRec.profiles?.full_name}</p>
                    <p className="text-[10px] font-bold text-[#b64f8f]">{selectedRec.profiles?.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <a href={selectedRec.video_url} download className="p-3 bg-gray-50 rounded-xl text-[#7e5f97] hover:bg-gray-100 transition-all"><Download size={18} /></a>
                    <a 
                      href={`https://www.google.com/maps?q=${selectedRec.location_snapshot?.lat},${selectedRec.location_snapshot?.lng}`} 
                      target="_blank" 
                      className="p-3 bg-gray-50 rounded-xl text-[#b64f8f] hover:bg-gray-100 transition-all"
                    >
                      <MapPin size={18} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}