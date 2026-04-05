"use client";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Phone, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const cleanPhone = form.phone.trim();
    if (!cleanPhone) {
      setError("Please enter your registered phone number.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          phone: cleanPhone, 
          password: form.password 
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload?.error || "Invalid phone number or password.");
        setLoading(false);
        return;
      }

      // Role-based redirect logic
      if (payload.user?.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      
      router.refresh();
    } catch (err) {
      setError("Connection error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Phone Input - Symmetric pl-12 and icon positioning */}
      <div className="relative group">
        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b64f8f]" size={18} />
        <input
          name="phone"
          type="tel"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
          className="w-full pl-12 pr-4 py-3 bg-[#fcfaff] border-2 border-[#f2e8f5] rounded-2xl focus:border-[#b64f8f] outline-none transition-all font-semibold text-[#4f336f] placeholder:text-[#c4b5d1]"
        />
      </div>

      {/* Password Input - Symmetric pl-12 and eye toggle */}
      <div className="relative group">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b64f8f]" size={18} />
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full pl-12 pr-12 py-3 bg-[#fcfaff] border-2 border-[#f2e8f5] rounded-2xl focus:border-[#b64f8f] outline-none transition-all font-semibold text-[#4f336f] placeholder:text-[#c4b5d1]"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#c4b5d1] hover:text-[#b64f8f] transition-colors"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* Symmetric Error Styling */}
      {error && (
        <div className="text-xs font-bold text-[#bf3a6f] bg-[#fff0f5] p-3 rounded-xl border border-[#ffdce8] animate-in fade-in duration-300">
          ⚠️ {error}
        </div>
      )}

      {/* Symmetric Submit Button */}
      <button
        type="submit"
        className="safeher-btn-primary w-full py-4 rounded-2xl shadow-lg shadow-[#b64f8f]/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
        disabled={loading}
      >
        {loading ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <span className="font-black uppercase tracking-tight">Login to Dashboard</span>
        )}
      </button>

      {/* <div className="text-center pt-2">
        <button type="button" className="text-xs font-bold text-[#7e5f97] hover:text-[#b64f8f] transition-colors">
          Forgot Password?
        </button>
      </div> */}
    </form>
  );
}