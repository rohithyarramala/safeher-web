"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Plus, Trash2, Phone, UserPlus, Loader2, ShieldCheck } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ label: "", phone: "" });

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch("/api/session");
        const data = await res.json();
        if (data?.user) {
          setUser(data.user);
          fetchContacts(data.user.id);
        }
      } catch (err) {
        console.error("Session error:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const fetchContacts = async (userId: string) => {
    const { data } = await supabase
      .from("emergency_contacts")
      .select("*")
      .eq("user_id", userId);
    setContacts(data || []);
  };

  const addContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { data, error } = await supabase
      .from("emergency_contacts")
      .insert([{ 
        user_id: user.id, 
        label: formData.label, 
        phone: formData.phone 
      }])
      .select();

    if (!error) {
      setContacts([...contacts, ...data]);
      setFormData({ label: "", phone: "" });
      setIsAdding(false);
    }
  };

  const deleteContact = async (id: string) => {
    const { error } = await supabase
      .from("emergency_contacts")
      .delete()
      .eq("id", id);

    if (!error) {
      setContacts(contacts.filter(c => c.id !== id));
    }
  };

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#faf8ff]">
      <Loader2 className="animate-spin text-[#b64f8f]" size={40} />
    </div>
  );

  return (
    <div className="safeher-page md:flex bg-[#faf8ff] min-h-screen">
      <Sidebar variant="user" />
      <main className="flex-1 p-4 md:p-8 md:ml-72">
        
        {/* HEADER */}
        <section className="glass-shell rounded-[2rem] p-6 md:p-8 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 border-2 border-white shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="text-[#b64f8f]" size={18} />
              <p className="text-[10px] font-black text-[#b64f8f] uppercase tracking-widest">Verified Network</p>
            </div>
            <h1 className="text-4xl font-black text-[#4f336f]">Emergency Circle</h1>
            <p className="text-[#7e5f97] mt-1 font-medium">Manage who receives your SOS alerts and live tracking data.</p>
          </div>
          
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="w-full md:w-auto bg-[#4f336f] text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[#3a2652] transition-all shadow-xl shadow-purple-100"
          >
            {isAdding ? "Cancel" : <><UserPlus size={20} /> Add Member</>}
          </button>
        </section>

        {/* ADD CONTACT FORM */}
        {isAdding && (
          <form onSubmit={addContact} className="bg-white p-6 rounded-[2rem] mb-8 border-2 border-[#b64f8f]/20 animate-in slide-in-from-top-4 duration-300">
            <div className="grid md:grid-cols-3 gap-4">
              <input 
                required
                placeholder="Name / Relation (e.g. Mom)"
                className="safeher-input bg-[#faf8ff] border-2 border-[#f2e8f5] rounded-xl p-3 text-sm font-bold"
                value={formData.label}
                onChange={(e) => setFormData({...formData, label: e.target.value})}
              />
              <input 
                required
                placeholder="Phone Number"
                className="safeher-input bg-[#faf8ff] border-2 border-[#f2e8f5] rounded-xl p-3 text-sm font-bold"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
              <button type="submit" className="bg-[#b64f8f] text-white rounded-xl font-black hover:bg-[#9a4279] transition-all py-3">
                SAVE CONTACT
              </button>
            </div>
          </form>
        )}

        {/* CONTACTS GRID */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {contacts.map((contact) => (
            <div key={contact.id} className="safeher-card p-6 border-2 border-white hover:border-[#f2e8f5] transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-[#fcfaff] rounded-2xl flex items-center justify-center text-[#b64f8f] border border-[#f2e8f5]">
                  <Phone size={20} />
                </div>
                <button 
                  onClick={() => deleteContact(contact.id)}
                  className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <h3 className="text-xl font-black text-[#4f336f] mb-1">{contact.label}</h3>
              <p className="text-sm font-bold text-gray-400 tracking-widest mb-4">{contact.phone}</p>
              
              <div className="flex gap-2 mt-auto">
                <span className="safeher-pill safeher-pill-pink text-[10px]">Verified</span>
                <span className="safeher-pill safeher-pill-indigo text-[10px]">SMS Alerts</span>
              </div>
            </div>
          ))}

          {contacts.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white/50 rounded-[3rem] border-4 border-dashed border-[#f2e8f5]">
              <p className="text-[#7e5f97] font-black text-lg">Your circle is empty.</p>
              <p className="text-sm text-gray-400">Add at least 2 contacts for maximum safety coverage.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}