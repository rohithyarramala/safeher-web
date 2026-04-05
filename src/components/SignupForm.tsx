"use client";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    phone: "",
    password: "",
    contacts: [
      { name: "", phone: "" },
      { name: "", phone: "" },
      { name: "", phone: "" },
    ],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleContactChange = (
    idx: number,
    field: "name" | "phone",
    value: string,
  ) => {
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

    const normalizedEmail = form.email.trim().toLowerCase();
    const normalizedPhone = form.phone.trim();

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: normalizedEmail,
        password: form.password,
        phone: normalizedPhone,
        contacts: form.contacts,
      }),
    });

    const payload = await response.json();
    if (!response.ok) {
      setError(payload?.error || "Signup failed");
      setLoading(false);
      return;
    }

    setSuccess(
      "Signup successful! Please check your email to verify your account.",
    );
    setLoading(false);
    setTimeout(() => {
      router.push("/login");
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
        className="safeher-input"
      />
      <input
        name="phone"
        type="tel"
        placeholder="Phone Number"
        value={form.phone}
        onChange={handleChange}
        required
        className="safeher-input"
      />
      <input
        name="password"
        type="password"
        placeholder="Password (min 8 chars)"
        value={form.password}
        onChange={handleChange}
        required
        className="safeher-input"
      />
      <div>
        <div className="font-semibold text-[#7f5f95] mb-2">
          Emergency Contacts
        </div>
        {form.contacts.map((c, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Name"
              value={c.name}
              onChange={(e) => handleContactChange(idx, "name", e.target.value)}
              required
              className="safeher-input flex-1"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={c.phone}
              onChange={(e) =>
                handleContactChange(idx, "phone", e.target.value)
              }
              required
              className="safeher-input flex-1"
            />
          </div>
        ))}
      </div>
      {error && (
        <div className="text-sm font-semibold text-[#bf3a6f]">{error}</div>
      )}
      {success && (
        <div className="text-sm font-semibold text-[#1f7a5c]">{success}</div>
      )}
      <button
        type="submit"
        className="safeher-btn-primary w-full py-2.5"
        disabled={loading}
      >
        {loading ? "Signing up..." : "Create Account"}
      </button>
    </form>
  );
}
