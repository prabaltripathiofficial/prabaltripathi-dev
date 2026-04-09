"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Terminal, Rss } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/sponsor", label: "Sponsor" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (isAdmin) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl border-b"
          : "bg-transparent"
      }`}
      style={scrolled ? { backgroundColor: "color-mix(in srgb, var(--bg) 80%, transparent)", borderColor: "var(--border)" } : {}}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-brand-600/25 transition-all">
            <Terminal className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            prabal<span className="text-brand-400">.dev</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
              style={{
                color: pathname === link.href ? "var(--fg)" : "var(--fg-muted)",
              }}
            >
              {link.label}
              {pathname === link.href && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 rounded-lg"
                  style={{ zIndex: -1, background: "var(--brand-subtle)", border: "1px solid var(--border)" }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
            </Link>
          ))}
          <Link href="/blog" className="ml-2 btn-ghost text-sm">
            <Rss className="w-4 h-4" />
            Subscribe
          </Link>
          <ThemeToggle />
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 hover:bg-white/[0.05] rounded-lg transition-colors"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden backdrop-blur-xl border-b"
            style={{ backgroundColor: "color-mix(in srgb, var(--bg) 95%, transparent)", borderColor: "var(--border)" }}
          >
            <div className="px-6 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    color: pathname === link.href ? "var(--fg)" : "var(--fg-muted)",
                    background: pathname === link.href ? "var(--brand-subtle)" : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
