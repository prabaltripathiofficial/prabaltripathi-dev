"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Linkedin, Mail, Heart, Terminal } from "lucide-react";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-white/[0.06] bg-[#0a0a0f]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">
                prabal<span className="text-brand-400">.dev</span>
              </span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Building scalable systems & sharing what I learn along the way.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm text-zinc-300 uppercase tracking-wider mb-4">Navigate</h4>
            <div className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About" },
                { href: "/blog", label: "Blog" },
                { href: "/sponsor", label: "Sponsor" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-zinc-500 hover:text-white text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold text-sm text-zinc-300 uppercase tracking-wider mb-4">Connect</h4>
            <div className="space-y-2">
              <a
                href="https://github.com/prabaltripathi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-zinc-500 hover:text-white text-sm transition-colors"
              >
                <Github className="w-4 h-4" /> GitHub
              </a>
              <a
                href="https://linkedin.com/in/prabaltripathiofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-zinc-500 hover:text-white text-sm transition-colors"
              >
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
              <a
                href="mailto:prabaltripathiofficial@gmail.com"
                className="flex items-center gap-2 text-zinc-500 hover:text-white text-sm transition-colors"
              >
                <Mail className="w-4 h-4" /> Email
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-sm text-zinc-300 uppercase tracking-wider mb-4">Newsletter</h4>
            <p className="text-zinc-500 text-sm mb-3">
              Get notified about new articles and projects.
            </p>
            <NewsletterForm compact />
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-600 text-sm">
            &copy; {new Date().getFullYear()} Prabal Tripathi. All rights reserved.
          </p>
          <p className="text-zinc-600 text-sm flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> using Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
