import Sidebar from "@/components/Sidebar";

const helplines = [
  {
    service: "Women Helpline",
    contact: "1091",
    availability: "24/7",
    scope: "National",
  },
  {
    service: "Emergency Response",
    contact: "112",
    availability: "24/7",
    scope: "National",
  },
  {
    service: "Police Control Room",
    contact: "100",
    availability: "24/7",
    scope: "City",
  },
  {
    service: "Domestic Violence Support",
    contact: "181",
    availability: "24/7",
    scope: "State",
  },
];

export default function HelplinesPage() {
  return (
    <div className="safeher-page md:flex">
      <Sidebar variant="user" />
      <main className="flex-1 p-4 md:p-8 md:ml-72">
        <section className="glass-shell rounded-3xl p-5 md:p-7 mb-6">
          <p className="safeher-pill safeher-pill-pink mb-3">
            Immediate Support
          </p>
          <h1 className="text-3xl font-black text-[#4f336f]">
            Emergency Helplines
          </h1>
          <p className="text-[#7e5f97] mt-1">
            Quick access to verified support numbers and emergency responders.
          </p>
        </section>

        <section className="grid lg:grid-cols-[1.15fr,0.85fr] gap-6">
          <article className="safeher-card p-5 md:p-6 overflow-x-auto">
            <h2 className="text-xl font-black text-[#5e3f82] mb-4">
              Verified Numbers
            </h2>
            <table className="safeher-table min-w-[500px]">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Contact</th>
                  <th>Availability</th>
                  <th>Scope</th>
                </tr>
              </thead>
              <tbody>
                {helplines.map((item) => (
                  <tr key={item.contact + item.service}>
                    <td className="font-semibold text-[#5f3f81]">
                      {item.service}
                    </td>
                    <td>
                      <a
                        href={`tel:${item.contact}`}
                        className="font-bold text-[#a84f89] hover:underline"
                      >
                        {item.contact}
                      </a>
                    </td>
                    <td>{item.availability}</td>
                    <td>
                      <span className="safeher-pill safeher-pill-indigo">
                        {item.scope}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>

          <article className="safeher-card p-5 md:p-6">
            <h2 className="text-xl font-black text-[#5e3f82] mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button className="safeher-btn-primary w-full py-2.5">
                Call Women Helpline
              </button>
              <button className="rounded-xl border border-[#e8d4e5] bg-white px-4 py-2.5 w-full font-bold text-[#7a5a94] hover:bg-[#fff4fa]">
                Share current location
              </button>
              <button className="rounded-xl border border-[#e8d4e5] bg-white px-4 py-2.5 w-full font-bold text-[#7a5a94] hover:bg-[#fff4fa]">
                Notify trusted contacts
              </button>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
