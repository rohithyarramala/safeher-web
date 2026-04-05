import Sidebar from "@/components/Sidebar";

const partners = [
  {
    partner: "City Women Cell",
    region: "Bengaluru",
    coverage: "Active",
    sla: "4 mins",
  },
  {
    partner: "Night Transit Patrol",
    region: "Mumbai",
    coverage: "Active",
    sla: "6 mins",
  },
  {
    partner: "Campus Security Alliance",
    region: "Delhi NCR",
    coverage: "Pilot",
    sla: "9 mins",
  },
  {
    partner: "Community Volunteers",
    region: "Hyderabad",
    coverage: "Active",
    sla: "7 mins",
  },
];

export default function NetworkPage() {
  return (
    <div className="safeher-page md:flex">
      <Sidebar variant="admin" />
      <main className="flex-1 p-4 md:p-8 md:ml-72">
        <section className="glass-shell rounded-3xl p-5 md:p-7 mb-6">
          <p className="safeher-pill safeher-pill-pink mb-3">
            Ecosystem Coverage
          </p>
          <h1 className="text-3xl font-black text-[#4f336f]">
            Community Network
          </h1>
          <p className="text-[#7e5f97] mt-1">
            Track responder partnerships and support-grid readiness by region.
          </p>
        </section>

        <section className="grid sm:grid-cols-3 gap-4 mb-6">
          <div className="safeher-card p-4">
            <p className="text-sm font-bold text-[#7d5f95]">Active partners</p>
            <p className="text-3xl font-black text-[#5e3f82]">42</p>
          </div>
          <div className="safeher-card p-4">
            <p className="text-sm font-bold text-[#7d5f95]">Cities covered</p>
            <p className="text-3xl font-black text-[#5e3f82]">18</p>
          </div>
          <div className="safeher-card p-4">
            <p className="text-sm font-bold text-[#7d5f95]">Avg support SLA</p>
            <p className="text-3xl font-black text-[#5e3f82]">6.2m</p>
          </div>
        </section>

        <section className="safeher-card p-5 md:p-6 overflow-x-auto">
          <table className="safeher-table min-w-[620px]">
            <thead>
              <tr>
                <th>Partner</th>
                <th>Region</th>
                <th>Coverage</th>
                <th>Response SLA</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((row) => (
                <tr key={row.partner + row.region}>
                  <td className="font-semibold text-[#5f3f81]">
                    {row.partner}
                  </td>
                  <td>{row.region}</td>
                  <td>
                    <span
                      className={`safeher-pill ${row.coverage === "Pilot" ? "safeher-pill-indigo" : "safeher-pill-green"}`}
                    >
                      {row.coverage}
                    </span>
                  </td>
                  <td>{row.sla}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
