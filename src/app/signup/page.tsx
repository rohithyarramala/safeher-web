"use client";
import SignupForm from "../../components/SignupForm";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Users, Heart } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="safeher-page min-h-screen px-4 py-8 md:px-8 md:py-12 flex items-center justify-center">
      <div className="glass-shell w-full max-w-6xl rounded-3xl overflow-hidden grid md:grid-cols-2">
        
        {/* Left Side: Branding & Value Proposition */}
        <section className="p-8 md:p-12 bg-gradient-to-br from-[#fff4fa] to-[#efe4ff] border-b md:border-b-0 md:border-r border-[#f2d8e8]">
          <div className="flex items-center gap-3 mb-10">
            <Image
              src="/logo.png"
              alt="SafeHer logo"
              width={46}
              height={46}
              className="rounded-full shadow-md"
            />
            <div>
              <p className="font-black text-[#64418f] tracking-wide uppercase">SAFEHER</p>
              <p className="text-xs font-semibold text-[#a05d8f]">
                Your community-backed shield
              </p>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-[#4f336f] leading-tight mb-6">
            Join the circle of protection.
          </h1>
          
          <div className="space-y-6 mt-10">
            <div className="flex gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm text-[#b64f8f] h-fit">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-bold text-[#5f3f81]">AI-Powered Surveillance</h3>
                <p className="text-sm text-[#7e5f97]">Real-time risk assessment and danger zone alerts based on live data.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm text-[#6e59b5] h-fit">
                <Users size={24} />
              </div>
              <div>
                <h3 className="font-bold text-[#5f3f81]">Trusted Emergency Network</h3>
                <p className="text-sm text-[#7e5f97]">Instant location sharing with your 3 most trusted contacts during SOS.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm text-[#c2713a] h-fit">
                <Heart size={24} />
              </div>
              <div>
                <h3 className="font-bold text-[#5f3f81]">Evidence Vault</h3>
                <p className="text-sm text-[#7e5f97]">Automatic background recording to secure encrypted evidence in the cloud.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: The Form */}
        <section className="p-8 md:p-12 bg-white overflow-y-auto max-h-[90vh] custom-scrollbar">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-[#5f3f81] mb-1">Create Account</h2>
            <p className="text-sm text-[#7f6599]">
              Set up your profile and emergency contacts.
            </p>
          </div>

          <SignupForm />

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-[#7f6599]">
              Already have a SafeHer account?{" "}
              <Link
                href="/login"
                className="font-bold text-[#b64f8f] hover:text-[#4f336f] transition-colors underline underline-offset-4"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}