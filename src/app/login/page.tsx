import LoginForm from "../../components/LoginForm";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="safeher-page min-h-screen px-4 py-8 md:px-8 md:py-12 flex items-center justify-center">
      <div className="glass-shell w-full max-w-5xl rounded-3xl overflow-hidden grid md:grid-cols-2">
        <section className="p-8 md:p-10 bg-gradient-to-br from-[#fff4fa] to-[#efe4ff] border-b md:border-b-0 md:border-r border-[#f2d8e8]">
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
                Safety starts with connection
              </p>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#4f336f] leading-tight mb-4">
            Welcome back
          </h1>
          <p className="text-[#7a5a94] mb-8">
            Access your safety dashboard, trusted contacts, and live risk
            updates in one place.
          </p>
          <div className="safeher-card p-5">
            <h2 className="font-bold text-[#5f3f81] mb-2">
              Why women choose SafeHer
            </h2>
            <ul className="space-y-2 text-sm text-[#785b92]">
              <li>Trusted-circle alerts in one tap</li>
              <li>Live helplines and safety resources</li>
              <li>Organized emergency evidence logs</li>
            </ul>
          </div>
        </section>
        <section className="p-8 md:p-10 bg-white">
          <h2 className="text-2xl font-black text-[#5f3f81] mb-2">Login</h2>
          <p className="text-sm text-[#7f6599] mb-6">
            Enter your credentials to continue.
          </p>
          <LoginForm />
          <p className="text-sm text-[#7f6599] mt-6">
            New here?{" "}
            <Link
              href="/signup"
              className="font-bold text-[#b64f8f] hover:underline"
            >
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
