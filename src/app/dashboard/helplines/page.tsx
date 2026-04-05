"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Phone, MapPin, ShieldAlert, HeartHandshake, Share2, Users, Loader2, Activity } from "lucide-react";

// Real-world Indian Emergency dataset (can be moved to Supabase)
const HELPLINE_DATA = [
  { service: "National Emergency", contact: "112", icon: <ShieldAlert />, type: "SOS" },
  { service: "Women Helpline", contact: "1091", icon: <HeartHandshake />, type: "Safety" },
  { service: "Domestic Abuse", contact: "181", icon: <Users />, type: "Support" },
  { service: "Police", contact: "100", icon: <Phone />, type: "SOS" },
  { service: "Ambulance", contact: "102", icon: <Phone />, type: "Medical" },
];

export default function HelplinesPage() {
  const [location, setLocation] = useState<string>("Detecting...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate reverse geocoding to show local relevance
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(() => {
        setLocation("Bapatla, Andhra Pradesh"); // Example based on your context
        setLoading(false);
      }, () => {
        setLocation("National Access");
        setLoading(false);
      });
    }
  }, []);

  const triggerDirectDial = (number: string) => {
    window.location.href = `tel:${number}`;
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
        <section className="glass-shell rounded-[2.5rem] p-6 md:p-10 mb-8 border-2 border-white shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="max-w-lg">
            <div className="flex items-center gap-2 mb-3">
               <MapPin className="text-[#b64f8f]" size={16} />
               <p className="text-[10px] font-black text-[#b64f8f] uppercase tracking-widest">Region: {location}</p>
            </div>
            <h1 className="text-4xl font-black text-[#4f336f] tracking-tight">Crisis Support</h1>
            <p className="text-[#7e5f97] mt-2 font-medium">Verified emergency responders and support services available 24/7 for immediate assistance.</p>
          </div>
          <div className="bg-red-50 p-6 rounded-3xl border-2 border-red-100 flex items-center gap-4">
             <div className="h-12 w-12 bg-red-500 text-white rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-red-200">
                <ShieldAlert size={24} />
             </div>
             <div>
                <p className="text-[10px] font-black text-red-600 uppercase">Panic Response</p>
                <p className="text-sm font-bold text-red-900">Dial 112 for any emergency</p>
             </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-[1.2fr,0.8fr] gap-8">
          
          {/* DIALER GRID */}
          <section className="grid sm:grid-cols-2 gap-4">
            {HELPLINE_DATA.map((item, idx) => (
              <div key={idx} className="safeher-card p-6 border-2 border-white hover:border-[#b64f8f]/30 transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-[#faf8ff] rounded-2xl flex items-center justify-center text-[#4f336f] mb-4 group-hover:bg-[#b64f8f] group-hover:text-white transition-all shadow-inner">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-black text-[#4f336f]">{item.service}</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">{item.type} Support</p>
                </div>
                
                <button 
                  onClick={() => triggerDirectDial(item.contact)}
                  className="w-full py-4 bg-[#faf8ff] border-2 border-[#f2e8f5] rounded-2xl flex items-center justify-center gap-3 font-black text-[#b64f8f] hover:bg-[#b64f8f] hover:text-white hover:border-transparent transition-all"
                >
                  <Phone size={18} /> CALL {item.contact}
                </button>
              </div>
            ))}
          </section>

          {/* QUICK ACTIONS SIDEBAR */}
          <aside className="space-y-6">
            <article className="safeher-card p-8 border-2 border-[#b64f8f]/10 bg-gradient-to-br from-white to-[#fff4fa]">
              <h2 className="text-xl font-black text-[#4f336f] mb-6 flex items-center gap-2">
                 <Activity className="text-[#b64f8f]" size={20} />
                 Instant Response
              </h2>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-5 bg-white border-2 border-[#f2e8f5] rounded-3xl group hover:border-[#b64f8f] transition-all">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Share2 size={20} /></div>
                      <div className="text-left">
                         <p className="text-xs font-black text-[#4f336f] uppercase">Share Signal</p>
                         <p className="text-[10px] text-gray-400 font-bold">Broadcast Location</p>
                      </div>
                   </div>
                </button>

                <button className="w-full flex items-center justify-between p-5 bg-white border-2 border-[#f2e8f5] rounded-3xl group hover:border-[#b64f8f] transition-all">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><Users size={20} /></div>
                      <div className="text-left">
                         <p className="text-xs font-black text-[#4f336f] uppercase">Notify Circle</p>
                         <p className="text-[10px] text-gray-400 font-bold">Alert Trusted Contacts</p>
                      </div>
                   </div>
                </button>
                
                <div className="pt-6">
                   <div className="p-5 bg-[#4f336f] rounded-3xl text-white">
                      <p className="text-xs font-bold opacity-70 mb-2">Did you know?</p>
                      <p className="text-sm font-medium leading-relaxed">
                        The <strong>112</strong> helpline works even when your phone has no active SIM card or mobile data.
                      </p>
                   </div>
                </div>
              </div>
            </article>
          </aside>
        </div>
      </main>
    </div>
  );
}