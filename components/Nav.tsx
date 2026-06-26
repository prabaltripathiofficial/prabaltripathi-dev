"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { NAV } from "@/lib/site";

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex flex-row md:flex-col items-start relative md:top-[-7px] overflow-scroll no-scrollbar px-4 md:px-0 pb-4 md:pb-0 md:overflow-auto md:relative md:left-[-6px]"
      id="nav"
    >
      <div className="flex flex-row md:flex-col space-x-4 md:space-x-0 pr-10">
        {NAV.map((item) => {
          const active = pathname === item.id;
          return (
            <div
              key={item.id}
              className="flex flex-col-reverse md:flex-row text-sm py-1 items-center"
            >
              <div
                className={`md:relative rounded-full md:mr-2 md:left-px w-[4px] h-[4px] mt-1 md:mt-0 transition-transform bg-primary-500 dark:bg-secondary-500 ${
                  active ? "scale-125" : "scale-0"
                }`}
              />
              <Link
                href={item.href}
                className={`transition-opacity ${
                  active
                    ? "text-primary-600 dark:text-secondary-400"
                    : "hover:opacity-60 dark:text-gray-400"
                }`}
              >
                {item.label}
              </Link>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
