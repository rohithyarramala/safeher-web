import Sidebar from "@/components/Sidebar";

const familyMembers = [
  {
    name: "Anika Fernandes",
    role: "Mother",
    sharing: "Live",
    updated: "30s ago",
  },
  {
    name: "Rahul Fernandes",
    role: "Brother",
    sharing: "Enabled",
    updated: "2m ago",
  },
  {
    name: "Sara Joseph",
    role: "Cousin",
    sharing: "Paused",
    updated: "18m ago",
  },
];

export default function FamilyPage() {
  return (
    <div className="safeher-page md:flex">
      <Sidebar variant="user" />
      <main className="flex-1 p-4 md:p-8 md:ml-72">
        <section className="glass-shell rounded-3xl p-5 md:p-7 mb-6">
          <p className="safeher-pill safeher-pill-indigo mb-3">
            Connected Support
          </p>
          <h1 className="text-3xl font-black text-[#4f336f]">Family Sharing</h1>
          <p className="text-[#7e5f97] mt-1">
            Manage who can view your check-ins, emergency updates, and route
            status.
          </p>
        </section>

        <section className="grid lg:grid-cols-[1.15fr,0.85fr] gap-6">
          <article className="safeher-card p-5 md:p-6 overflow-x-auto">
            <h2 className="text-xl font-black text-[#5e3f82] mb-4">
              Shared Access Matrix
            </h2>
            <table className="safeher-table min-w-[500px]">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {familyMembers.map((item) => (
                  <tr key={item.name}>
                    <td className="font-semibold text-[#5f3f81]">
                      {item.name}
                    </td>
                    <td>{item.role}</td>
                    <td>
                      <span
                        className={`safeher-pill ${item.sharing === "Paused" ? "safeher-pill-pink" : "safeher-pill-green"}`}
                      >
                        {item.sharing}
                      </span>
                    </td>
                    <td className="text-[#8a689e]">{item.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>

          <article className="safeher-card p-5 md:p-6">
            <h2 className="text-xl font-black text-[#5e3f82] mb-4">
              Permissions Snapshot
            </h2>
            <div className="space-y-3">
              <div className="safeher-card-soft p-4">
                <p className="text-sm font-bold text-[#7d5f95]">
                  Location Visibility
                </p>
                <p className="text-2xl font-black text-[#5e3f82] mt-1">
                  2 Active
                </p>
              </div>
              <div className="safeher-card-soft p-4">
                <p className="text-sm font-bold text-[#7d5f95]">
                  SOS Broadcast Group
                </p>
                <p className="text-2xl font-black text-[#5e3f82] mt-1">
                  5 Members
                </p>
              </div>
              <div className="safeher-card-soft p-4">
                <p className="text-sm font-bold text-[#7d5f95]">
                  Auto Check-in Rules
                </p>
                <p className="text-2xl font-black text-[#5e3f82] mt-1">
                  3 Enabled
                </p>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
