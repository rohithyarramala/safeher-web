import { Users, Bell, Activity, Group } from "lucide-react";

const stats = [
  {
    label: "Total Users",
    value: "3,284",
    icon: <Users className="text-[#b64f8f]" size={24} />,
    note: "+7.2% this month",
  },
  {
    label: "SOS Today",
    value: "41",
    icon: <Bell className="text-[#6e59b5]" size={24} />,
    note: "8 escalated",
  },
  {
    label: "High Risk Alerts",
    value: "19",
    icon: <Activity className="text-[#cf7a3f]" size={24} />,
    note: "3 unresolved",
  },
  {
    label: "Active Community",
    value: "1,106",
    icon: <Group className="text-[#23916d]" size={24} />,
    note: "82 new members",
  },
];

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <article key={stat.label} className="safeher-card p-5">
          <div className="w-10 h-10 rounded-xl bg-[#fff0f8] flex items-center justify-center mb-4">
            {stat.icon}
          </div>
          <div className="text-3xl font-black text-[#5f3f81]">{stat.value}</div>
          <div className="text-sm font-bold text-[#7a5b94] mt-1">
            {stat.label}
          </div>
          <div className="text-xs text-[#a17aa8] mt-1">{stat.note}</div>
        </article>
      ))}
    </div>
  );
}
