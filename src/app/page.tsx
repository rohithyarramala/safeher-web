"use client";

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import {
  ArrowRight,
  BellRing,
  BookOpenText,
  CheckCircle2,
  Globe,
  LifeBuoy,
  MapPin,
  PhoneCall,
  Radar,
  Menu,
  ShieldCheck,
  Share2,
  Sparkles,
  Video,
  X,
} from 'lucide-react';

const kpis = [
  { value: '14,320+', label: 'Alerts Monitored Monthly' },
  { value: '4,800+', label: 'Trusted Circle Members' },
  { value: '1,200+', label: 'Safety Knowledge Articles' },
  { value: '160+', label: 'Verified Helplines' },
];

const flows = [
  {
    step: '01',
    title: 'Detect',
    detail: 'AI evaluates route context, community alerts, and environment risk signals in real time.',
    icon: <Radar size={18} />,
  },
  {
    step: '02',
    title: 'Protect',
    detail: 'One-tap SOS sends location, starts secure recording, and alerts your trusted circle instantly.',
    icon: <ShieldCheck size={18} />,
  },
  {
    step: '03',
    title: 'Respond',
    detail: 'Prioritized escalation paths connect family, local responders, and helplines with context.',
    icon: <LifeBuoy size={18} />,
  },
];

const capabilities = [
  {
    title: 'Incident Video Vault',
    text: 'Automatic evidence capture with timestamped metadata and secure cloud uploads.',
    icon: <Video size={22} />,
    tone: 'from-[#ffedf6] to-[#fff6fb] text-[#b54f8f]',
  },
  {
    title: 'Live Circle Sharing',
    text: 'Share location and status updates with chosen contacts under clear permission controls.',
    icon: <Share2 size={22} />,
    tone: 'from-[#f2eeff] to-[#faf7ff] text-[#6d5ab6]',
  },
  {
    title: 'Hyperlocal Safety Feed',
    text: 'Community-verified reports, route advisories, and neighborhood-level risk insights.',
    icon: <BellRing size={22} />,
    tone: 'from-[#ffedf6] to-[#fff7fc] text-[#b54f8f]',
  },
  {
    title: 'Guides That Matter',
    text: 'Practical, culturally relevant safety playbooks built for daily movement and emergencies.',
    icon: <BookOpenText size={22} />,
    tone: 'from-[#f1eeff] to-[#fbf9ff] text-[#6d5ab6]',
  },
];

const miniIncidents = [
  { area: 'Andheri East', level: 'Medium', eta: '3m' },
  { area: 'South Delhi', level: 'High', eta: '1m' },
  { area: 'Koregaon Park', level: 'Low', eta: '6m' },
];

const helplines = [
  { label: 'Women Helpline', number: '1091' },
  { label: 'Emergency Response', number: '112' },
  { label: 'Police Control', number: '100' },
];

const rise = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.55, ease: 'easeOut' as const },
};

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="safeher-page min-h-screen text-[#4f336f] overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-[#ffdcec] blur-3xl opacity-60"
          animate={{ x: [0, 20, 0], y: [0, 18, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-24 right-0 w-96 h-96 rounded-full bg-[#dfd3ff] blur-3xl opacity-60"
          animate={{ x: [0, -18, 0], y: [0, -22, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <header className="sticky top-0 z-50 border-b border-[#ecd8e7] bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="SafeHer logo" width={42} height={42} className="rounded-full border border-[#f3d9ea]" />
            <div>
              <p className="font-black text-[#604188] tracking-wide leading-tight">SAFEHER</p>
              <p className="text-[11px] font-semibold text-[#9d6a97] leading-tight">Built for women, designed for confidence</p>
            </div>
          </Link>
          <nav className="hidden lg:flex items-center gap-7 text-sm font-bold text-[#7b5c95]">
            <a href="#features" className="hover:text-[#b54f8f] transition">Features</a>
            <a href="#how" className="hover:text-[#b54f8f] transition">How it works</a>
            <a href="#intelligence" className="hover:text-[#b54f8f] transition">Safety intelligence</a>
          </nav>
          <div className="hidden md:flex items-center gap-2 md:gap-3">
            <Link href="/login" className="px-4 py-2 rounded-xl text-sm font-bold text-[#7f5f98] hover:bg-[#fff2f9] transition">Login</Link>
            <Link href="/signup" className="safeher-btn-primary px-4 md:px-5 py-2 text-sm md:text-base">Create Account</Link>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden w-10 h-10 rounded-xl border border-[#e7d4e6] bg-white text-[#6f4f89] flex items-center justify-center"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        <AnimatePresence>
          {mobileMenuOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="md:hidden border-t border-[#ecd8e7] px-4 pb-4"
            >
              <div className="pt-3 flex flex-col gap-2 text-sm font-bold text-[#7b5c95]">
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-3 py-2 hover:bg-[#fff2f9]">Features</a>
                <a href="#how" onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-3 py-2 hover:bg-[#fff2f9]">How it works</a>
                <a href="#intelligence" onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-3 py-2 hover:bg-[#fff2f9]">Safety intelligence</a>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center rounded-xl border border-[#e7d4e6] bg-white px-3 py-2 font-bold text-[#74558f]"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="safeher-btn-primary text-center px-3 py-2"
                >
                  Create
                </Link>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      <main>
        <section className="max-w-7xl mx-auto px-4 md:px-8 pt-10 md:pt-16 pb-10 md:pb-16 grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-8 md:gap-12 items-center">
          <motion.div {...rise}>
            <span className="safeher-pill safeher-pill-pink mb-5">
              <Sparkles size={14} /> AI-powered safety layer
            </span>
            <h1 className="text-4xl md:text-6xl font-black leading-[1.08] text-[#4f336f] mb-5">
              Move through your world with stronger safety control.
            </h1>
            <p className="text-base md:text-lg text-[#7b5c95] max-w-2xl leading-relaxed mb-8">
              SafeHer combines predictive intelligence, instant SOS workflows, trusted-circle coordination,
              and evidence capture into one elegant platform made for real daily life.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/signup" className="safeher-btn-primary px-6 py-3 text-base flex items-center gap-2">
                Start Free <ArrowRight size={18} />
              </Link>
              <Link href="/dashboard" className="px-6 py-3 rounded-xl border border-[#e7d4e6] bg-white font-bold text-[#74558f] hover:bg-[#fff4fa] transition">
                Open Demo Dashboard
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-2 text-sm text-[#8a6a9f] font-semibold">
              <span className="safeher-pill safeher-pill-indigo"><Globe size={13} /> Localized risk signals</span>
              <span className="safeher-pill safeher-pill-pink"><MapPin size={13} /> Route-aware alerts</span>
              <span className="safeher-pill safeher-pill-green"><CheckCircle2 size={13} /> Trusted response network</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative"
          >
            <div className="safeher-card-soft rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-6 relative overflow-hidden">
              <motion.div
                className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-[#f7d0e7]/70"
                animate={{ scale: [1, 1.12, 1], rotate: [0, 12, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute -bottom-10 -left-8 w-44 h-44 rounded-full bg-[#e2d6ff]/70"
                animate={{ scale: [1, 1.14, 1], rotate: [0, -10, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              />

              <div className="relative glass-shell rounded-[1.5rem] p-4 md:p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-black text-[#5d3e82]">SafeHer Live Preview</p>
                    <p className="text-xs text-[#8d6da2]">Emergency readiness dashboard</p>
                  </div>
                  <span className="safeher-pill safeher-pill-pink">Active</span>
                </div>

                <div className="safeher-card p-3 mb-3">
                  <div className="flex items-center gap-3">
                    <Image src="/logo.png" alt="SafeHer icon" width={38} height={38} className="rounded-full" />
                    <div>
                      <p className="text-sm font-bold text-[#5d3e82]">Safety Orbit</p>
                      <p className="text-xs text-[#8d6da2]">Trusted circle synced 22s ago</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="safeher-card p-3">
                    <p className="text-xs font-bold text-[#8d6da2]">Threat index</p>
                    <p className="text-2xl font-black text-[#b54f8f]">Medium</p>
                  </div>
                  <div className="safeher-card p-3">
                    <p className="text-xs font-bold text-[#8d6da2]">Circle reach</p>
                    <p className="text-2xl font-black text-[#6d5ab6]">5/5</p>
                  </div>
                </div>

                <div className="safeher-card p-3">
                  <p className="text-xs font-bold text-[#8d6da2] mb-2">Rapid actions</p>
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-bold text-center">
                    <span className="rounded-lg bg-[#ffe9f4] py-1.5 text-[#ae4d89]">SOS</span>
                    <span className="rounded-lg bg-[#ece5ff] py-1.5 text-[#6655b0]">Share</span>
                    <span className="rounded-lg bg-[#e3f8ef] py-1.5 text-[#2f8d6f]">Call</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="border-y border-[#ecd8e7] bg-white/70">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10 grid grid-cols-2 md:grid-cols-4 gap-5">
            {kpis.map((item) => (
              <motion.article key={item.label} {...rise} className="text-center">
                <p className="text-2xl md:text-3xl font-black text-[#5e3f82]">{item.value}</p>
                <p className="text-[11px] md:text-xs uppercase tracking-wider font-bold text-[#9673a9] mt-1">{item.label}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="how" className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <motion.div {...rise} className="mb-8 md:mb-10">
            <h2 className="text-3xl md:text-5xl font-black text-[#4f336f] mb-3">How SafeHer Works</h2>
            <p className="text-[#7b5c95] max-w-3xl">A practical three-stage safety loop that turns awareness into rapid support when it matters most.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-4 md:gap-5">
            {flows.map((item, index) => (
              <motion.article
                key={item.step}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="safeher-card p-5 md:p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-black text-[#e5d6f0]">{item.step}</span>
                  <span className="safeher-pill safeher-pill-indigo">{item.icon} {item.title}</span>
                </div>
                <p className="text-[#7b5c95] leading-relaxed">{item.detail}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="features" className="bg-gradient-to-br from-[#5b3e84] to-[#b35190] py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <motion.div {...rise} className="text-center text-white mb-9 md:mb-12">
              <h2 className="text-3xl md:text-5xl font-black mb-3">Capabilities Built for Real Situations</h2>
              <p className="text-[#f6ddf0] max-w-2xl mx-auto">Every module is designed to reduce response delay and increase confidence through clear workflows.</p>
            </motion.div>
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
              {capabilities.map((item, index) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  whileHover={{ y: -5 }}
                  className="bg-white/12 backdrop-blur-md border border-white/25 rounded-2xl p-5 text-white"
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.tone} flex items-center justify-center mb-4`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-black mb-2">{item.title}</h3>
                  <p className="text-sm text-[#f3e2ef]">{item.text}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="intelligence" className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20 grid xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-6 md:gap-8">
          <motion.article {...rise} className="safeher-card p-5 md:p-6 overflow-x-auto">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-2xl font-black text-[#5e3f82]">Live Intelligence Snapshot</h3>
                <p className="text-sm text-[#8a6a9f]">Illustrative operations stream for demonstration.</p>
              </div>
              <span className="safeher-pill safeher-pill-green">Operational</span>
            </div>
            <table className="safeher-table min-w-[540px]">
              <thead>
                <tr>
                  <th>Area</th>
                  <th>Risk Level</th>
                  <th>Responder ETA</th>
                </tr>
              </thead>
              <tbody>
                {miniIncidents.map((row) => (
                  <tr key={row.area}>
                    <td className="font-semibold text-[#5f3f81]">{row.area}</td>
                    <td>
                      <span className={`safeher-pill ${row.level === 'High' ? 'safeher-pill-pink' : row.level === 'Medium' ? 'safeher-pill-indigo' : 'safeher-pill-green'}`}>
                        {row.level}
                      </span>
                    </td>
                    <td>{row.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.article>

          <motion.aside {...rise} className="safeher-card p-5 md:p-6">
            <h3 className="text-2xl font-black text-[#5e3f82] mb-4">Quick Helplines</h3>
            <div className="space-y-3">
              {helplines.map((item) => (
                <div key={item.number} className="safeher-card-soft p-3.5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#8a6a9f]">{item.label}</p>
                    <p className="text-xl font-black text-[#5e3f82]">{item.number}</p>
                  </div>
                  <a href={`tel:${item.number}`} className="w-10 h-10 rounded-full bg-white border border-[#e6d3e5] flex items-center justify-center text-[#6c59b5] hover:bg-[#f9f3ff] transition">
                    <PhoneCall size={16} />
                  </a>
                </div>
              ))}
            </div>
            <Link href="/dashboard/helplines" className="safeher-btn-primary mt-5 w-full py-2.5 text-center block">
              View full directory
            </Link>
          </motion.aside>
        </section>

        <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16 md:pb-24">
          <motion.div
            {...rise}
            className="rounded-[2.25rem] md:rounded-[3rem] bg-gradient-to-br from-[#5d3f85] via-[#8b4f92] to-[#c35f96] p-8 md:p-14 text-white relative overflow-hidden"
          >
            <motion.div
              className="absolute -top-14 -right-14 w-56 h-56 rounded-full bg-white/15"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute -bottom-12 -left-16 w-64 h-64 rounded-full bg-white/10"
              animate={{ scale: [1, 1.13, 1] }}
              transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="relative text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black leading-tight mb-4">Build your personal safety network in under two minutes.</h2>
              <p className="text-[#f5dced] mb-8 text-base md:text-lg">
                Add trusted contacts, activate your response flow, and start navigating with more clarity and support.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/signup" className="px-6 py-3 rounded-xl bg-white text-[#613f84] font-black hover:opacity-95 transition">
                  Create Free Account
                </Link>
                <Link href="/dashboard" className="px-6 py-3 rounded-xl border border-white/40 font-bold hover:bg-white/10 transition">
                  Explore Dashboard
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-[#ecd8e7] bg-white/70 py-8 text-center text-sm font-bold text-[#9a78ac]">
        SafeHer 2026. Safety technology designed with care, dignity, and action.
      </footer>
    </div>
  );
}
