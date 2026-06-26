import { redirect } from "next/navigation";
import { isOwner } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sign in" };

export default function LoginPage() {
  if (isOwner()) redirect("/admin");
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <svg width="34" height="34" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg">
            <circle cx="19" cy="19" r="19" className="fill-primary-600 dark:fill-secondary-500" />
            <text x="15" y="19" textAnchor="middle" dominantBaseline="central" fontWeight={700} fontSize={14} className="nimbus" style={{ fill: "var(--bg)" }}>
              PT
            </text>
            <rect x="25.5" y="12" width="2.6" height="14" rx="0.5" className="cursor-blink" style={{ fill: "var(--bg)" }} />
          </svg>
          <span className="nimbus uppercase tracking-wide text-sm">Admin</span>
        </div>
        <LoginForm />
        <p className="text-xs text-gray-400 text-center mt-6">
          This area is private. Only the owner can post.
        </p>
      </div>
    </div>
  );
}
