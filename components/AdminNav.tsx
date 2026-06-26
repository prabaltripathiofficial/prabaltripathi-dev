"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/editor", label: "New article" },
  { href: "/admin/updates", label: "Updates" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 bg-[var(--bg)] z-10">
      <div className="flex items-center gap-4">
        <span className="nimbus uppercase tracking-wide text-sm">Admin</span>
        <nav className="flex items-center gap-3 text-sm">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                pathname === l.href
                  ? "text-primary-600 dark:text-secondary-400"
                  : "text-gray-500 hover:text-primary-600 transition"
              }
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <Link href="/" className="text-gray-500 hover:text-primary-600 transition">
          View site ↗
        </Link>
        <button onClick={logout} className="text-gray-500 hover:text-red-500 transition">
          Log out
        </button>
      </div>
    </header>
  );
}
