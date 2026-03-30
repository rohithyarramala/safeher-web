"use client";

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
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
} from 'lucide-react';

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

const adminNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={18} /> },
  { label: 'Users', href: '/admin/users', icon: <Users size={18} /> },
  { label: 'Recordings', href: '/admin/recordings', icon: <Video size={18} /> },
  { label: 'AI Monitoring', href: '/admin/monitoring', icon: <Bell size={18} /> },
  { label: 'Community', href: '/admin/network', icon: <Network size={18} /> },
  { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 size={18} /> },
];

const userNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Contacts', href: '/dashboard/contacts', icon: <Users size={18} /> },
  { label: 'Family Sharing', href: '/dashboard/family', icon: <Share2 size={18} /> },
  { label: 'Safety Feed', href: '/dashboard/feed', icon: <Shield size={18} /> },
  { label: 'Articles', href: '/dashboard/articles', icon: <Newspaper size={18} /> },
  { label: 'Helplines', href: '/dashboard/helplines', icon: <LifeBuoy size={18} /> },
];

function isRouteActive(pathname: string, href: string) {
  if (href === '/admin' || href === '/dashboard') {
    return pathname === href;
  }
  return pathname.startsWith(href);
}

export default function Sidebar({ variant = 'user' }: { variant?: 'admin' | 'user' }) {
  const pathname = usePathname();
  const router = useRouter();
  const navItems = variant === 'admin' ? adminNavItems : userNavItems;

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <aside className="glass-shell w-full md:w-72 md:min-h-screen rounded-none md:rounded-r-3xl px-4 py-4 md:p-6">
      <div className="flex items-center justify-between md:justify-start gap-3 mb-5 md:mb-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="SafeHer logo" width={42} height={42} className="rounded-full border border-pink-200" />
          <div>
            <div className="font-black tracking-wide text-[#5c3d82]">SAFEHER</div>
            <div className="text-xs font-semibold text-[#a36694]">{variant === 'admin' ? 'Admin Console' : 'Safety Hub'}</div>
          </div>
        </Link>
      </div>

      <nav className="grid grid-cols-2 gap-2 md:grid-cols-1">
        {navItems.map((item) => {
          const active = isRouteActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                active
                  ? 'bg-gradient-to-r from-[#d66fb1] to-[#7c68bf] text-white shadow'
                  : 'text-[#5c4a73] hover:bg-[#fff1f8]'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 md:mt-10 border-t border-[#efd7e5] pt-4">
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-[#8a628f] hover:bg-[#fff1f8] transition">
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
