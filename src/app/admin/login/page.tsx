"use client";
import { useState } from "react";
import { ShieldCheck, Lock, User, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      body: JSON.stringify(form),
    });

    if (res.ok) {
      window.location.href = "/admin"; // Redirect on success
    } else {
      setError("Access Denied: Invalid Credentials");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl border-2 border-white">
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-[#4f336f] text-white rounded-3xl mb-4 shadow-xl shadow-purple-100">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-black text-[#4f336f]">Admin Command</h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              required
              type="text"
              placeholder="Username"
              className="w-full pl-12 pr-4 py-4 bg-[#faf8ff] border-2 border-[#f2e8f5] rounded-2xl outline-none focus:border-[#4f336f] font-bold text-sm transition-all"
              onChange={(e) => setForm({...form, username: e.target.value})}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              required
              type="password"
              placeholder="Password"
              className="w-full pl-12 pr-4 py-4 bg-[#faf8ff] border-2 border-[#f2e8f5] rounded-2xl outline-none focus:border-[#4f336f] font-bold text-sm transition-all"
              onChange={(e) => setForm({...form, password: e.target.value})}
            />
          </div>

          {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

          <button 
            disabled={loading}
            className="w-full py-4 bg-[#4f336f] text-white rounded-2xl font-black shadow-xl shadow-purple-100 hover:bg-[#3a2652] transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "AUTHENTICATE"}
          </button>
        </form>
      </div>
    </div>
  );
}