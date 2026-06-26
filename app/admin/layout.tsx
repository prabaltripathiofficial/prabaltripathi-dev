import { redirect } from "next/navigation";
import { isOwner } from "@/lib/auth";
import AdminNav from "@/components/AdminNav";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isOwner()) redirect("/login");
  return (
    <div className="min-h-screen">
      <AdminNav />
      <div>{children}</div>
    </div>
  );
}
