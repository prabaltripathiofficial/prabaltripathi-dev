import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { NAME } from "@/lib/site";

// Public site shell: sticky sidebar + main column (mirrors mitchellh.com).
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-5xl mb-40 flex flex-col md:flex-row mx-4 mt-8 md:mt-20 lg:mt-32 lg:mx-auto">
      <Sidebar />
      <main className="flex-auto min-w-0 mt-6 md:mt-0 flex flex-col">
        <h1 className="mb-20 nimbus uppercase tracking-wide mt-[9px] hidden md:block text-base">
          <a href="/">{NAME}</a>
        </h1>
        {/* min-height keeps the footer from riding up above its About-page
            position on short pages; longer content pushes it down naturally. */}
        <div className="flex-auto min-h-[58vh]">{children}</div>
        <Footer />
      </main>
    </div>
  );
}
