import Sidebar from '@/components/Sidebar';
import StatsGrid from '@/components/StatsGrid';

const incidents = [
  { id: 'INC-1024', zone: 'Andheri East', severity: 'High', updated: '2m ago' },
  { id: 'INC-1020', zone: 'Koramangala', severity: 'Medium', updated: '9m ago' },
  { id: 'INC-1015', zone: 'South Delhi', severity: 'High', updated: '14m ago' },
  { id: 'INC-1012', zone: 'Banjara Hills', severity: 'Low', updated: '20m ago' },
];

export default function AdminPage() {
  return (
    <div className="safeher-page md:flex">
      <Sidebar variant="admin" />
      <main className="flex-1 p-4 md:p-8">
        <section className="glass-shell rounded-3xl p-5 md:p-7 mb-6">
          <p className="safeher-pill safeher-pill-indigo mb-3">Admin Control Center</p>
          <h1 className="text-3xl md:text-4xl font-black text-[#4f336f]">Safety Operations Dashboard</h1>
          <p className="text-sm md:text-base text-[#7e5f97] mt-1 mb-6">Track user safety signals, platform health, and operational response timelines.</p>
          <StatsGrid />
        </section>

        <section className="grid xl:grid-cols-2 gap-6">
          <article className="safeher-card p-5 md:p-6">
            <h2 className="text-xl font-black text-[#5e3f82] mb-4">Live Incident Queue</h2>
            <div className="overflow-x-auto">
              <table className="safeher-table min-w-[520px]">
                <thead>
                  <tr>
                    <th>Incident ID</th>
                    <th>Zone</th>
                    <th>Severity</th>
                    <th>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map((item) => (
                    <tr key={item.id}>
                      <td className="font-semibold text-[#5f3f81]">{item.id}</td>
                      <td>{item.zone}</td>
                      <td>
                        <span className={`safeher-pill ${item.severity === 'High' ? 'safeher-pill-pink' : item.severity === 'Medium' ? 'safeher-pill-indigo' : 'safeher-pill-green'}`}>
                          {item.severity}
                        </span>
                      </td>
                      <td className="text-[#8a689e]">{item.updated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="safeher-card p-5 md:p-6">
            <h2 className="text-xl font-black text-[#5e3f82] mb-4">Response Health</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="safeher-card-soft p-4">
                <p className="text-sm font-bold text-[#7d5f95]">Avg. First Response</p>
                <p className="text-3xl font-black text-[#5e3f82] mt-2">02:18</p>
              </div>
              <div className="safeher-card-soft p-4">
                <p className="text-sm font-bold text-[#7d5f95]">Escalations Resolved</p>
                <p className="text-3xl font-black text-[#5e3f82] mt-2">94%</p>
              </div>
              <div className="safeher-card-soft p-4">
                <p className="text-sm font-bold text-[#7d5f95]">AI Triage Confidence</p>
                <p className="text-3xl font-black text-[#5e3f82] mt-2">89%</p>
              </div>
              <div className="safeher-card-soft p-4">
                <p className="text-sm font-bold text-[#7d5f95]">Critical Open Cases</p>
                <p className="text-3xl font-black text-[#5e3f82] mt-2">6</p>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
