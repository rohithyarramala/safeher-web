import SignupForm from "../../components/SignupForm";
import Image from "next/image";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="safeher-page min-h-screen px-4 py-8 md:px-8 md:py-12 flex items-center justify-center">
      <div className="glass-shell w-full max-w-6xl rounded-3xl overflow-hidden grid md:grid-cols-2">
        <section className="p-8 md:p-10 bg-gradient-to-br from-[#f5efff] to-[#ffeef7] border-b md:border-b-0 md:border-r border-[#f2d8e8]">
          <div className="flex items-center gap-3 mb-6">
            <Image
              src="/logo.png"
              alt="SafeHer logo"
              width={46}
              height={46}
              className="rounded-full"
            />
            <div>
              <p className="font-black text-[#64418f] tracking-wide">SAFEHER</p>
              <p className="text-xs font-semibold text-[#a05d8f]">
                Personal safety network
              </p>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#4f336f] leading-tight mb-4">
            Create your safety space
          </h1>
          <p className="text-[#7a5a94] mb-8">
            Register once to set up emergency contacts, safety feed updates, and
            secure account access.
          </p>
          <div className="safeher-card p-5">
            <h2 className="font-bold text-[#5f3f81] mb-2">
              In your first 2 minutes
            </h2>
            <ul className="space-y-2 text-sm text-[#785b92]">
              <li>Add trusted emergency contacts</li>
              <li>Enable immediate SOS support flows</li>
              <li>Access curated safety knowledge</li>
            </ul>
          </div>
        </section>
        <section className="p-8 md:p-10 bg-white">
          <h2 className="text-2xl font-black text-[#5f3f81] mb-2">Register</h2>
          <p className="text-sm text-[#7f6599] mb-6">
            Create your account to begin.
          </p>
          <SignupForm />
          <p className="text-sm text-[#7f6599] mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[#b64f8f] hover:underline"
            >
              Login
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
