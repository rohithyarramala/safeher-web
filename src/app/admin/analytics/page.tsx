import Sidebar from "@/components/Sidebar";

const channels = [
  { channel: "SOS Button", incidents: 401, resolved: "95%" },
  { channel: "Voice Trigger", incidents: 189, resolved: "91%" },
  { channel: "Manual Report", incidents: 263, resolved: "89%" },
  { channel: "Community Feed", incidents: 147, resolved: "84%" },
];

export default function AnalyticsPage() {
  return (
    <div className="safeher-page md:flex">
      <Sidebar variant="admin" />
      <main className="flex-1 p-4 md:p-8 md:ml-72">
        <section className="glass-shell rounded-3xl p-5 md:p-7 mb-6">
          <p className="safeher-pill safeher-pill-indigo mb-3">
            Platform Intelligence
          </p>
          <h1 className="text-3xl font-black text-[#4f336f]">Analytics</h1>
          <p className="text-[#7e5f97] mt-1">
            Performance, response quality, and incident channel effectiveness
            overview.
          </p>
        </section>

        <section className="grid sm:grid-cols-4 gap-4 mb-6">
          <div className="safeher-card p-4">
            <p className="text-sm font-bold text-[#7d5f95]">MTTR</p>
            <p className="text-3xl font-black text-[#5e3f82]">11m</p>
          </div>
          <div className="safeher-card p-4">
            <p className="text-sm font-bold text-[#7d5f95]">Resolved Cases</p>
            <p className="text-3xl font-black text-[#5e3f82]">92%</p>
          </div>
          <div className="safeher-card p-4">
            <p className="text-sm font-bold text-[#7d5f95]">Repeat Risk Drop</p>
            <p className="text-3xl font-black text-[#5e3f82]">-18%</p>
          </div>
          <div className="safeher-card p-4">
            <p className="text-sm font-bold text-[#7d5f95]">Weekly Adoption</p>
            <p className="text-3xl font-black text-[#5e3f82]">+12%</p>
          </div>
        </section>

        <section className="grid lg:grid-cols-[1fr,1fr] gap-6">
          <article className="safeher-card p-5 md:p-6">
            <h2 className="text-xl font-black text-[#5e3f82] mb-4">
              Incident Channels
            </h2>
            <div className="overflow-x-auto">
              <table className="safeher-table min-w-[500px]">
                <thead>
                  <tr>
                    <th>Channel</th>
                    <th>Incidents</th>
                    <th>Resolved</th>
                  </tr>
                </thead>
                <tbody>
                  {channels.map((row) => (
                    <tr key={row.channel}>
                      <td className="font-semibold text-[#5f3f81]">
                        {row.channel}
                      </td>
                      <td>{row.incidents}</td>
                      <td>
                        <span className="safeher-pill safeher-pill-green">
                          {row.resolved}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="safeher-card p-5 md:p-6">
            <h2 className="text-xl font-black text-[#5e3f82] mb-4">
              Resolution Quality
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-semibold text-[#7d5f95] mb-1">
                  <span>Critical incidents</span>
                  <span>88%</span>
                </div>
                <div className="h-2 rounded-full bg-[#f4e8f4]">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-[#b64f8f] to-[#7c68bf]"
                    style={{ width: "88%" }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-semibold text-[#7d5f95] mb-1">
                  <span>Medium incidents</span>
                  <span>93%</span>
                </div>
                <div className="h-2 rounded-full bg-[#f4e8f4]">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-[#b64f8f] to-[#7c68bf]"
                    style={{ width: "93%" }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-semibold text-[#7d5f95] mb-1">
                  <span>Low incidents</span>
                  <span>96%</span>
                </div>
                <div className="h-2 rounded-full bg-[#f4e8f4]">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-[#b64f8f] to-[#7c68bf]"
                    style={{ width: "96%" }}
                  />
                </div>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
