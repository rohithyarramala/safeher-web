"use client";
import { useState, useEffect, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import { Phone, Search, ShieldAlert, HeartPulse, HardHat, Info, Loader2, Plus, X, Save, Zap } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Prefill Data for Indian Context
const PREFILL_RESOURCES = [
  { name: "National Emergency", number: "112", category: "Police" },
  { name: "Women Helpline", number: "1091", category: "Safety" },
  { name: "Ambulance", number: "102", category: "Medical" },
  { name: "Fire Station", number: "101", category: "Safety" },
];

export default function AdminHelplinesPage() {
  const [helplines, setHelplines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ name: "", number: "", category: "Safety" });

  const fetchHelplines = async () => {
    const { data, error } = await supabase
      .from("helplines")
      .select("*")
      .order("name", { ascending: true });
    if (!error) setHelplines(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchHelplines(); }, []);

  const handleAdd = async (e?: React.FormEvent, manualData?: any) => {
    if (e) e.preventDefault();
    const dataToInsert = manualData || formData;

    const { error } = await supabase.from("helplines").insert([dataToInsert]);
    if (!error) {
      fetchHelplines();
      setShowAddModal(false);
      setFormData({ name: "", number: "", category: "Safety" });
    }
  };

  const filteredLines = useMemo(() => {
    return helplines.filter(line => 
      line.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      line.number.includes(searchQuery)
    );
  }, [helplines, searchQuery]);

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#faf8ff]">
      <Loader2 className="animate-spin text-[#b64f8f]" size={40} />
    </div>
  );

  return (
    <div className="safeher-page md:flex bg-[#faf8ff] min-h-screen">
      <Sidebar variant="admin" />
      <main className="flex-1 p-4 md:p-8 md:ml-72">
        
        {/* ADMIN HEADER */}
        <section className="glass-shell rounded-[2.5rem] p-6 md:p-10 mb-8 border-2 border-white shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-black text-[#4f336f] tracking-tight">Helpline Registry</h1>
            <p className="text-[#7e5f97] mt-1 font-medium">Manage the emergency directory available to all users.</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#4f336f] text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-xl hover:bg-[#3a2652] transition-all"
          >
            <Plus size={20} /> ADD NEW HELPLINE
          </button>
        </section>

        {/* PREFILL SHORTCUTS */}
        <section className="mb-8">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Quick Import (National Numbers)</p>
           <div className="flex flex-wrap gap-3">
              {PREFILL_RESOURCES.map((res) => (
                <button 
                  key={res.number}
                  onClick={() => handleAdd(undefined, res)}
                  className="bg-white border-2 border-[#f2e8f5] px-5 py-3 rounded-xl flex items-center gap-3 hover:border-[#b64f8f] transition-all group"
                >
                  <Zap size={14} className="text-[#b64f8f] group-hover:scale-125 transition-transform" />
                  <div className="text-left">
                    <p className="text-xs font-black text-[#4f336f]">{res.name}</p>
                    <p className="text-[10px] font-bold text-gray-400">{res.number}</p>
                  </div>
                </button>
              ))}
           </div>
        </section>

        {/* SEARCH & LIST */}
        <div className="safeher-card p-0 overflow-hidden border-2 border-white shadow-xl">
           <div className="p-6 bg-white border-b flex items-center gap-4">
              <Search className="text-gray-300" size={20} />
              <input 
                placeholder="Search registry..."
                className="flex-1 outline-none font-bold text-[#4f336f] bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
           <table className="safeher-table w-full">
              <thead className="bg-[#faf8ff]">
                <tr>
                  <th className="text-left p-6">Service Name</th>
                  <th className="text-left">Number</th>
                  <th className="text-left">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2e8f5]">
                {filteredLines.map((line) => (
                  <tr key={line.id} className="hover:bg-[#fcfaff]">
                    <td className="p-6 font-black text-[#4f336f] text-sm">{line.name}</td>
                    <td className="font-bold text-[#b64f8f]">{line.number}</td>
                    <td><span className="safeher-pill safeher-pill-indigo">{line.category}</span></td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>

        {/* ADD MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 backdrop-blur-md bg-[#4f336f]/20">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-[#4f336f]">New Helpline</h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-300 hover:text-red-500"><X /></button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <input 
                  required
                  placeholder="Service Name (e.g. Police)"
                  className="w-full p-4 bg-[#faf8ff] border-2 border-[#f2e8f5] rounded-xl outline-none focus:border-[#4f336f] font-bold"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <input 
                  required
                  placeholder="Phone Number"
                  className="w-full p-4 bg-[#faf8ff] border-2 border-[#f2e8f5] rounded-xl outline-none focus:border-[#4f336f] font-bold"
                  value={formData.number}
                  onChange={(e) => setFormData({...formData, number: e.target.value})}
                />
                <select 
                  className="w-full p-4 bg-[#faf8ff] border-2 border-[#f2e8f5] rounded-xl font-bold"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Safety">Safety</option>
                  <option value="Medical">Medical</option>
                  <option value="Police">Police</option>
                  <option value="Other">Other</option>
                </select>
                <button className="w-full py-4 bg-[#b64f8f] text-white rounded-xl font-black shadow-lg flex items-center justify-center gap-2">
                  <Save size={18} /> SAVE TO DIRECTORY
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}