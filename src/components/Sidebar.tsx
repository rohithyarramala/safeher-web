"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import {
  BarChart3,
  Bell,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Network,
  Newspaper,
  Shield,
  Share2,
  Users,
  Video,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

const adminNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} /> },
  { label: "Users", href: "/admin/users", icon: <Users size={18} /> },
  { label: "Recordings", href: "/admin/recordings", icon: <Video size={18} /> },
  {
    label: "AI Monitoring",
    href: "/admin/monitoring",
    icon: <Bell size={18} />,
  },
  { label: "Community", href: "/admin/network", icon: <Network size={18} /> },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: <BarChart3 size={18} />,
  },
];

const userNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  { label: "Contacts", href: "/dashboard/contacts", icon: <Users size={18} /> },
  {
    label: "Family Sharing",
    href: "/dashboard/family",
    icon: <Share2 size={18} />,
  },
  { label: "Safety Feed", href: "/dashboard/feed", icon: <Shield size={18} /> },
  {
    label: "Articles",
    href: "/dashboard/articles",
    icon: <Newspaper size={18} />,
  },
  {
    label: "Helplines",
    href: "/dashboard/helplines",
    icon: <LifeBuoy size={18} />,
  },
];

function isRouteActive(pathname: string, href: string) {
  if (href === "/admin" || href === "/dashboard") {
    return pathname === href;
  }
  return pathname.startsWith(href);
}

export default function Sidebar({ variant }: { variant: "admin" | "user" }) {
  const pathname = usePathname();
  const router = useRouter();
  const navItems = variant === "admin" ? adminNavItems : userNavItems;
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  // Sidebar content as a function for reuse
  const sidebarContent = (
    <div className="flex flex-col h-full min-h-0 flex-1">
      <div>
        <div className="flex items-center justify-between md:justify-start gap-3 mb-5 md:mb-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="SafeHer logo"
              width={42}
              height={42}
              className="rounded-full border border-pink-200"
            />
            <div>
              <div className="font-black tracking-wide text-[#5c3d82]">
                SAFEHER
              </div>
              <div className="text-xs font-semibold text-[#a36694]">
                {variant === "admin" ? "Admin Console" : "Safety Hub"}
              </div>
            </div>
          </Link>
        </div>

        <nav className="grid grid-cols-1 gap-2">
          {navItems.map((item) => {
            const active = isRouteActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "bg-gradient-to-r from-[#d66fb1] to-[#7c68bf] text-white shadow"
                    : "text-[#5c4a73] hover:bg-[#fff1f8]"
                }`}
                onClick={() => setOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      {/* Spacer to push logout to bottom */}
      <div className="flex-1" />
      <div className="mt-6 md:mt-10 border-t border-[#efd7e5] pt-4 md:pt-6 md:mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-[#8a628f] hover:bg-[#fff1f8] transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile header with centered logo and hamburger */}
      <div className="md:hidden flex flex-col items-stretch mb-4">
        <div className="flex items-center justify-center bg-white py-2 border-b border-[#efd7e5] relative">
          <Image
            src="/logo.png"
            alt="SafeHer logo"
            width={40}
            height={40}
            className="rounded-full border border-pink-200"
          />
          <button
            aria-label="Open sidebar"
            onClick={() => setOpen(true)}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-lg border border-[#efd7e5] bg-white"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Sidebar overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          style={{ position: "fixed" }}
          onClick={() => setOpen(false)}
        >
          <aside
            className="fixed left-0 top-0 bottom-0 w-64 bg-white glass-shell z-50 p-6 flex flex-col h-full overflow-hidden"
            style={{
              position: "fixed",
              height: "100dvh",
              maxHeight: "100dvh",
              top: 0,
              left: 0,
              bottom: 0,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close sidebar"
              onClick={() => setOpen(false)}
              className="mb-6 p-2 rounded-full bg-[#efd7e5] text-[#5c3d82] flex items-center justify-center w-9 h-9 shadow"
            >
              <X size={20} strokeWidth={3} fill="#fff" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main sidebar for md+ screens */}
      <aside
        className="glass-shell w-full md:w-72 md:min-h-screen rounded-none md:rounded-r-3xl px-4 py-4 md:p-6 hidden md:flex md:flex-col md:h-screen md:fixed md:left-0 md:top-0 md:bottom-0 md:z-30"
        style={{
          position: "fixed",
          height: "100vh",
          maxHeight: "100vh",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
