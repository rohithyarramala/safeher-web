import Sidebar from "@/components/Sidebar";

const feedItems = [
  {
    title: "Street-light outage in Sector 9",
    area: "Sector 9, Pune",
    severity: "Medium",
    time: "12 min ago",
  },
  {
    title: "Crowd congestion reported near station",
    area: "MG Road Metro",
    severity: "High",
    time: "25 min ago",
  },
  {
    title: "Police patrolling increased in district",
    area: "Koregaon Park",
    severity: "Low",
    time: "48 min ago",
  },
  {
    title: "Safe route recommendation updated",
    area: "Indiranagar",
    severity: "Low",
    time: "1 hr ago",
  },
];

export default function FeedPage() {
  return (
    <div className="safeher-page md:flex">
      <Sidebar variant="user" />
      <main className="flex-1 p-4 md:p-8 md:ml-72">
        <section className="glass-shell rounded-3xl p-5 md:p-7 mb-6">
          <p className="safeher-pill safeher-pill-pink mb-3">
            Local Intelligence
          </p>
          <h1 className="text-3xl font-black text-[#4f336f]">Safety Feed</h1>
          <p className="text-[#7e5f97] mt-1">
            Stay updated with local incidents, route advisories, and community
            alerts.
          </p>
        </section>

        <section className="grid lg:grid-cols-[1.2fr,0.8fr] gap-6">
          <article className="space-y-4">
            {feedItems.map((item) => (
              <div key={item.title} className="safeher-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-black text-[#5f3f81]">
                      {item.title}
                    </h2>
                    <p className="text-sm text-[#7e5f97] mt-1">{item.area}</p>
                  </div>
                  <span
                    className={`safeher-pill ${item.severity === "High" ? "safeher-pill-pink" : item.severity === "Medium" ? "safeher-pill-indigo" : "safeher-pill-green"}`}
                  >
                    {item.severity}
                  </span>
                </div>
                <p className="text-xs text-[#9a77a8] mt-3">
                  Updated {item.time}
                </p>
              </div>
            ))}
          </article>
          <article className="safeher-card p-5 md:p-6">
            <h2 className="text-xl font-black text-[#5e3f82] mb-4">
              Feed Trends
            </h2>
            <div className="space-y-3">
              <div className="safeher-card-soft p-4">
                <p className="text-sm font-bold text-[#7d5f95]">
                  High-risk alerts
                </p>
                <p className="text-2xl font-black text-[#5e3f82] mt-1">+14%</p>
              </div>
              <div className="safeher-card-soft p-4">
                <p className="text-sm font-bold text-[#7d5f95]">
                  Safe route adoption
                </p>
                <p className="text-2xl font-black text-[#5e3f82] mt-1">82%</p>
              </div>
              <div className="safeher-card-soft p-4">
                <p className="text-sm font-bold text-[#7d5f95]">
                  Community reports/day
                </p>
                <p className="text-2xl font-black text-[#5e3f82] mt-1">37</p>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
