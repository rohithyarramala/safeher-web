import Sidebar from "@/components/Sidebar";

export default function AdminUsersPage() {
  const users = [
    {
      id: "USR-1043",
      name: "Jane Doe",
      email: "jane@example.com",
      status: "Active",
      joined: "2026-02-16",
    },
    {
      id: "USR-1041",
      name: "John Smith",
      email: "john@example.com",
      status: "Active",
      joined: "2026-02-12",
    },
    {
      id: "USR-1028",
      name: "Ananya Singh",
      email: "ananya@example.com",
      status: "Flagged",
      joined: "2026-01-31",
    },
    {
      id: "USR-1014",
      name: "Riya Mehta",
      email: "riya@example.com",
      status: "Active",
      joined: "2026-01-20",
    },
  ];

  return (
    <div className="safeher-page md:flex">
      <Sidebar variant="admin" />
      <main className="flex-1 p-4 md:p-8 md:ml-72">
        <section className="glass-shell rounded-3xl p-5 md:p-7 mb-6">
          <p className="safeher-pill safeher-pill-indigo mb-3">
            User Governance
          </p>
          <h1 className="text-3xl font-black text-[#4f336f]">All Users</h1>
          <p className="text-[#7e5f97] mt-1">
            Monitor registrations, account state, and onboarding quality.
          </p>
        </section>

        <section className="grid sm:grid-cols-3 gap-4 mb-6">
          <div className="safeher-card p-4">
            <p className="text-sm font-bold text-[#7d5f95]">Total accounts</p>
            <p className="text-3xl font-black text-[#5e3f82]">3,284</p>
          </div>
          <div className="safeher-card p-4">
            <p className="text-sm font-bold text-[#7d5f95]">New this week</p>
            <p className="text-3xl font-black text-[#5e3f82]">214</p>
          </div>
          <div className="safeher-card p-4">
            <p className="text-sm font-bold text-[#7d5f95]">Flagged accounts</p>
            <p className="text-3xl font-black text-[#5e3f82]">11</p>
          </div>
        </section>

        <section className="safeher-card p-5 md:p-6 overflow-x-auto">
          <table className="safeher-table min-w-[620px]">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="font-semibold text-[#5f3f81]">{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={`safeher-pill ${user.status === "Flagged" ? "safeher-pill-pink" : "safeher-pill-green"}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td>{user.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
