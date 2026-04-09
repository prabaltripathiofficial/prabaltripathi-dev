"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  PenSquare,
  Users,
  MessageSquare,
  User,
  LogOut,
  Terminal,
  ExternalLink,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/posts/new", label: "Write Post", icon: PenSquare },
  { href: "/admin/portfolio", label: "Portfolio", icon: User },
  { href: "/admin/subscribers", label: "Subscribers", icon: Users },
  { href: "/admin/comments", label: "Comments", icon: MessageSquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0d0d14] border-r border-white/[0.06] flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-white/[0.06]">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <Terminal className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-sm">prabal.dev</span>
            <span className="block text-[10px] text-zinc-600 uppercase tracking-wider">Admin Panel</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href ||
            (link.href !== "/admin" && pathname.startsWith(link.href));

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-brand-600/10 text-brand-400 border border-brand-500/10"
                  : "text-zinc-500 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/[0.06] space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-500 hover:text-white hover:bg-white/[0.04] transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          View Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
