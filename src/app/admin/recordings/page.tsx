import Sidebar from "@/components/Sidebar";

export default function AdminRecordingsPage() {
  const recordings = [
    {
      id: "REC-663",
      user: "Jane Doe",
      date: "2026-03-29 20:01",
      status: "Reviewed",
      length: "02:11",
    },
    {
      id: "REC-662",
      user: "John Smith",
      date: "2026-03-29 19:35",
      status: "Pending",
      length: "01:08",
    },
    {
      id: "REC-658",
      user: "Ananya Singh",
      date: "2026-03-29 18:22",
      status: "Escalated",
      length: "03:44",
    },
    {
      id: "REC-651",
      user: "Riya Mehta",
      date: "2026-03-29 16:05",
      status: "Reviewed",
      length: "00:53",
    },
  ];

  return (
    <div className="safeher-page md:flex">
      <Sidebar variant="admin" />
      <main className="flex-1 p-4 md:p-8 md:ml-72">
        <section className="glass-shell rounded-3xl p-5 md:p-7 mb-6">
          <p className="safeher-pill safeher-pill-pink mb-3">Evidence Review</p>
          <h1 className="text-3xl font-black text-[#4f336f]">
            Safety Recordings
          </h1>
          <p className="text-[#7e5f97] mt-1">
            Review captured recordings tied to incidents, alerts, and follow-up
            workflows.
          </p>
        </section>

        <section className="grid sm:grid-cols-3 gap-4 mb-6">
          <div className="safeher-card p-4">
            <p className="text-sm font-bold text-[#7d5f95]">Total today</p>
            <p className="text-3xl font-black text-[#5e3f82]">74</p>
          </div>
          <div className="safeher-card p-4">
            <p className="text-sm font-bold text-[#7d5f95]">Pending review</p>
            <p className="text-3xl font-black text-[#5e3f82]">13</p>
          </div>
          <div className="safeher-card p-4">
            <p className="text-sm font-bold text-[#7d5f95]">Escalated</p>
            <p className="text-3xl font-black text-[#5e3f82]">4</p>
          </div>
        </section>

        <section className="safeher-card p-5 md:p-6 overflow-x-auto">
          <table className="safeher-table min-w-[680px]">
            <thead>
              <tr>
                <th>Recording ID</th>
                <th>User</th>
                <th>Captured At</th>
                <th>Length</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recordings.map((rec) => (
                <tr key={rec.id}>
                  <td className="font-semibold text-[#5f3f81]">{rec.id}</td>
                  <td>{rec.user}</td>
                  <td>{rec.date}</td>
                  <td>{rec.length}</td>
                  <td>
                    <span
                      className={`safeher-pill ${rec.status === "Escalated" ? "safeher-pill-pink" : rec.status === "Pending" ? "safeher-pill-indigo" : "safeher-pill-green"}`}
                    >
                      {rec.status}
                    </span>
                  </td>
                  <td>
                    <button className="rounded-lg border border-[#e8d4e5] bg-white px-3 py-1.5 text-xs font-bold text-[#7a5a94] hover:bg-[#fff4fa]">
                      Open
                    </button>
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
