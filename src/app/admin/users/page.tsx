"use client";
import { useEffect, useState, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import { Search, UserCheck, UserX, Mail, Calendar, Loader2, MoreVertical, ShieldAlert } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({ total: 0, newThisWeek: 0, flagged: 0 });

  const fetchUsers = async () => {
    setLoading(true);
    // 1. Fetch all profiles
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setUsers(data);
      
      // 2. Calculate Stats
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      setStats({
        total: data.length,
        newThisWeek: data.filter(u => new Date(u.created_at) > oneWeekAgo).length,
        flagged: data.filter(u => u.status === "Flagged").length
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 3. Toggle User Status (Real Action)
  const toggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "Flagged" ? "Active" : "Flagged";
    const { error } = await supabase
      .from("profiles")
      .update({ status: newStatus })
      .eq("id", userId);

    if (!error) {
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    }
  };

  // 4. Client-side Search
  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#faf8ff]">
      <Loader2 className="animate-spin text-[#4f336f]" size={40} />
    </div>
  );

  return (
    <div className="safeher-page md:flex bg-[#faf8ff] min-h-screen">
      <Sidebar variant="admin" />
      <main className="flex-1 p-4 md:p-8 md:ml-72">
        
        {/* HEADER & SEARCH */}
        <section className="glass-shell rounded-[2.5rem] p-6 md:p-10 mb-8 border-2 border-white shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className="text-[#b64f8f]" size={18} />
                <p className="text-[10px] font-black text-[#b64f8f] uppercase tracking-widest">User Governance</p>
              </div>
              <h1 className="text-4xl font-black text-[#4f336f] tracking-tight">Identity Directory</h1>
            </div>

            <div className="w-full lg:w-96 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by name or email..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-[#f2e8f5] bg-white focus:border-[#4f336f] outline-none font-bold text-sm transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* QUICK STATS */}
        <section className="grid sm:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Total Accounts", value: stats.total, color: "text-[#4f336f]" },
            { label: "New this week", value: `+${stats.newThisWeek}`, color: "text-green-600" },
            { label: "Flagged Risk", value: stats.flagged, color: "text-red-500" }
          ].map((s, i) => (
            <div key={i} className="safeher-card p-6 border-2 border-white shadow-xl shadow-purple-50/50">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </section>

        {/* USERS TABLE */}
        <section className="safeher-card p-0 overflow-hidden border-2 border-white shadow-xl">
          <div className="overflow-x-auto">
            <table className="safeher-table w-full">
              <thead className="bg-[#faf8ff] border-b border-[#f2e8f5]">
                <tr>
                  <th className="text-left p-6">User Details</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Joined Date</th>
                  <th className="text-right p-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2e8f5]">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#fcfaff] transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#4f336f] text-white flex items-center justify-center font-black text-xs">
                          {user.full_name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-black text-[#4f336f] text-sm">{user.full_name || "Unknown User"}</p>
                          <p className="text-xs text-gray-400 font-bold flex items-center gap-1">
                            <Mail size={10} /> {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`safeher-pill text-[10px] ${
                        user.status === "Flagged" ? "safeher-pill-pink" : "safeher-pill-green"
                      }`}>
                        {user.status || "Active"}
                      </span>
                    </td>
                    <td>
                      <p className="text-xs font-bold text-[#7e5f97] flex items-center gap-1 uppercase">
                        <Calendar size={12} /> {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => toggleStatus(user.id, user.status)}
                        className={`p-2 rounded-lg transition-all ${
                          user.status === "Flagged" 
                          ? "bg-green-50 text-green-600 hover:bg-green-100" 
                          : "bg-red-50 text-red-600 hover:bg-red-100"
                        }`}
                        title={user.status === "Flagged" ? "Unflag User" : "Flag User"}
                      >
                        {user.status === "Flagged" ? <UserCheck size={18} /> : <UserX size={18} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}