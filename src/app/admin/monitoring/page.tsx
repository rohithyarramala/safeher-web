import Sidebar from "@/components/Sidebar";

const detections = [
  {
    id: "MON-332",
    signal: "Distress phrase cluster",
    confidence: "93%",
    action: "Escalated",
  },
  {
    id: "MON-329",
    signal: "Location anomaly",
    confidence: "86%",
    action: "Watchlist",
  },
  {
    id: "MON-325",
    signal: "Repeat harassment report",
    confidence: "91%",
    action: "Escalated",
  },
  {
    id: "MON-321",
    signal: "Silent route deviation",
    confidence: "79%",
    action: "Watchlist",
  },
];

export default function MonitoringPage() {
  return (
    <div className="safeher-page md:flex">
      <Sidebar variant="admin" />
      <main className="flex-1 p-4 md:p-8 md:ml-72">
        <section className="glass-shell rounded-3xl p-5 md:p-7 mb-6">
          <p className="safeher-pill safeher-pill-indigo mb-3">
            Intelligence Layer
          </p>
          <h1 className="text-3xl font-black text-[#4f336f]">AI Monitoring</h1>
          <p className="text-[#7e5f97] mt-1">
            Model health, confidence scores, and priority signals for active
            risk triage.
          </p>
        </section>

        <section className="grid sm:grid-cols-3 gap-4 mb-6">
          <div className="safeher-card p-4">
            <p className="text-sm font-bold text-[#7d5f95]">Model precision</p>
            <p className="text-3xl font-black text-[#5e3f82]">91.6%</p>
          </div>
          <div className="safeher-card p-4">
            <p className="text-sm font-bold text-[#7d5f95]">False positives</p>
            <p className="text-3xl font-black text-[#5e3f82]">3.2%</p>
          </div>
          <div className="safeher-card p-4">
            <p className="text-sm font-bold text-[#7d5f95]">Escalated today</p>
            <p className="text-3xl font-black text-[#5e3f82]">17</p>
          </div>
        </section>

        <section className="safeher-card p-5 md:p-6 overflow-x-auto">
          <table className="safeher-table min-w-[620px]">
            <thead>
              <tr>
                <th>Event ID</th>
                <th>Signal</th>
                <th>Confidence</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {detections.map((row) => (
                <tr key={row.id}>
                  <td className="font-semibold text-[#5f3f81]">{row.id}</td>
                  <td>{row.signal}</td>
                  <td>{row.confidence}</td>
                  <td>
                    <span
                      className={`safeher-pill ${row.action === "Escalated" ? "safeher-pill-pink" : "safeher-pill-indigo"}`}
                    >
                      {row.action}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
