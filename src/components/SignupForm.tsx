"use client";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Users, 
  ShieldCheck, 
  Loader2 
} from "lucide-react";

export default function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    // Matches DB schema 'label'
    contacts: [
      { label: "", phone: "" },
      { label: "", phone: "" },
      { label: "", phone: "" },
    ],
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleContactChange = (idx: number, field: "label" | "phone", value: string) => {
    const updated = [...form.contacts];
    updated[idx] = { ...updated[idx], [field]: value };
    setForm({ ...form, contacts: updated });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.full_name,
          email: form.email.trim().toLowerCase(),
          password: form.password,
          phone: form.phone.trim(),
          emergency_contacts: form.contacts,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        setError(payload?.error || "Signup failed");
        setLoading(false);
        return;
      }

      setSuccess("Signup successful! Redirecting to login...");
      setLoading(false);
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError("Connection error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Full Name */}
      <div className="relative group">
        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b64f8f]" size={18} />
        <input
          name="full_name"
          type="text"
          placeholder="Full Name"
          value={form.full_name}
          onChange={handleChange}
          required
          className="w-full pl-12 pr-4 py-3 bg-[#fcfaff] border-2 border-[#f2e8f5] rounded-2xl focus:border-[#b64f8f] outline-none transition-all font-semibold text-[#4f336f]"
        />
      </div>

      {/* Email */}
      <div className="relative group">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b64f8f]" size={18} />
        <input
          name="email"
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full pl-12 pr-4 py-3 bg-[#fcfaff] border-2 border-[#f2e8f5] rounded-2xl focus:border-[#b64f8f] outline-none transition-all font-semibold text-[#4f336f]"
        />
      </div>

      {/* Phone */}
      <div className="relative group">
        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b64f8f]" size={18} />
        <input
          name="phone"
          type="tel"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
          className="w-full pl-12 pr-4 py-3 bg-[#fcfaff] border-2 border-[#f2e8f5] rounded-2xl focus:border-[#b64f8f] outline-none transition-all font-semibold text-[#4f336f]"
        />
      </div>

      {/* Password with Eye Toggle */}
      <div className="relative group">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b64f8f]" size={18} />
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Create Password (min 8 chars)"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full pl-12 pr-12 py-3 bg-[#fcfaff] border-2 border-[#f2e8f5] rounded-2xl focus:border-[#b64f8f] outline-none transition-all font-semibold text-[#4f336f]"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#c4b5d1] hover:text-[#b64f8f] transition-colors"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* Emergency Contacts Section */}
      <div className="pt-4">
        <div className="flex items-center gap-2 font-black text-[#7a5a94] text-xs uppercase tracking-widest mb-4">
          <ShieldCheck size={16} className="text-[#b64f8f]" />
          Emergency Safety Circle
        </div>
        
        {form.contacts.map((c, idx) => (
          <div key={idx} className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b64f8f]" size={14} />
              <input
                type="text"
                placeholder="Relation (e.g. Mom)"
                value={c.label}
                onChange={(e) => handleContactChange(idx, "label", e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-[#f2e8f5] rounded-xl focus:border-[#b64f8f] outline-none text-sm font-semibold"
              />
            </div>
            <div className="relative flex-1">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b64f8f]" size={14} />
              <input
                type="tel"
                placeholder="Phone"
                value={c.phone}
                onChange={(e) => handleContactChange(idx, "phone", e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-[#f2e8f5] rounded-xl focus:border-[#b64f8f] outline-none text-sm font-semibold"
              />
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="text-xs font-bold text-[#bf3a6f] bg-red-50 p-3 rounded-xl border border-red-100 animate-in fade-in">
          ⚠️ {error}
        </div>
      )}
      
      {success && (
        <div className="text-xs font-bold text-[#1f7a5c] bg-green-50 p-3 rounded-xl border border-green-100 animate-in fade-in">
          ✅ {success}
        </div>
      )}

      <button
        type="submit"
        className="safeher-btn-primary w-full py-4 rounded-2xl shadow-lg shadow-[#b64f8f]/20 flex items-center justify-center gap-2 group transition-all"
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <span className="font-black uppercase tracking-tight">Protect My Future</span>
        )}
      </button>
    </form>
  );
}