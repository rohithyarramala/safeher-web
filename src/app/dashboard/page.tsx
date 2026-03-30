import Sidebar from '@/components/Sidebar';
import EmergencyContacts from '@/components/EmergencyContacts';
import { AlertTriangle, Bell, MapPin, ShieldCheck } from 'lucide-react';

const quickStats = [
  { label: 'SOS This Week', value: '07', icon: <Bell size={18} className="text-[#b64f8f]" />, tone: 'safeher-pill-pink' },
  { label: 'Safe Check-ins', value: '23', icon: <ShieldCheck size={18} className="text-[#6e59b5]" />, tone: 'safeher-pill-indigo' },
  { label: 'Nearby Alerts', value: '04', icon: <AlertTriangle size={18} className="text-[#c2713a]" />, tone: 'safeher-pill-pink' },
  { label: 'Shared Locations', value: '12', icon: <MapPin size={18} className="text-[#2c8f70]" />, tone: 'safeher-pill-green' },
];

const recentEvents = [
  { id: 1, event: 'Late-night commute check-in', status: 'Completed', time: 'Today, 9:15 PM' },
  { id: 2, event: 'SOS dry-run with circle', status: 'Completed', time: 'Today, 6:00 PM' },
  { id: 3, event: 'Area caution alert', status: 'In review', time: 'Yesterday, 11:40 PM' },
  { id: 4, event: 'Helpline quick dial used', status: 'Completed', time: 'Yesterday, 8:22 PM' },
];

export default function DashboardPage() {
  return (
    <div className="safeher-page md:flex">
      <Sidebar variant="user" />
      <main className="flex-1 p-4 md:p-8">
        <section className="glass-shell rounded-3xl p-5 md:p-7 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <p className="safeher-pill safeher-pill-pink mb-2">Personal Dashboard</p>
              <h1 className="text-3xl md:text-4xl font-black text-[#4f336f]">Your Safety Overview</h1>
              <p className="text-sm md:text-base text-[#7e5f97] mt-1">Monitor alerts, trusted contacts, and readiness in one place.</p>
            </div>
            <div className="flex gap-2">
              <button className="safeher-btn-primary px-4 py-2">Trigger SOS</button>
              <button className="rounded-xl border border-[#e8d4e5] bg-white px-4 py-2 text-[#7a5a94] font-bold">Share Live Location</button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickStats.map((stat) => (
              <article key={stat.label} className="safeher-card p-4">
                <div className={`safeher-pill ${stat.tone} w-fit mb-3`}>{stat.icon}{stat.label}</div>
                <p className="text-3xl font-black text-[#5e3e82]">{stat.value}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid xl:grid-cols-2 gap-6">
          <article className="safeher-card p-5 md:p-6">
            <h2 className="text-xl font-black text-[#5e3f82] mb-4">Recent Safety Events</h2>
            <div className="overflow-x-auto">
              <table className="safeher-table min-w-[520px]">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEvents.map((row) => (
                    <tr key={row.id}>
                      <td className="font-semibold text-[#604186]">{row.event}</td>
                      <td>
                        <span className={`safeher-pill ${row.status === 'In review' ? 'safeher-pill-indigo' : 'safeher-pill-green'}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="text-[#8a689e]">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="safeher-card p-5 md:p-6">
            <h2 className="text-xl font-black text-[#5e3f82] mb-4">Emergency Contacts</h2>
            <EmergencyContacts />
          </article>
        </section>
      </main>
    </div>
  );
}
