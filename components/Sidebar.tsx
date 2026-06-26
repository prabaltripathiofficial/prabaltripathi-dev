import Nav from "./Nav";
import { NAME } from "@/lib/site";

export default function Sidebar() {
  return (
    <aside className="md:w-[200px] md:shrink-0 -mx-4 md:mx-0 md:px-0">
      <div className="lg:sticky lg:top-20">
        <div className="mb-2 px-4 md:px-0 md:mb-20 flex flex-col md:flex-row items-start">
          <a href="/" aria-label={NAME} className="block">
            <svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg">
              <circle cx="19" cy="19" r="19" className="fill-primary-600 dark:fill-secondary-500" />
              <text
                x="15"
                y="19"
                textAnchor="middle"
                dominantBaseline="central"
                fontWeight={700}
                fontSize={14}
                letterSpacing={0.5}
                className="nimbus"
                style={{ fill: "var(--bg)" }}
              >
                PT
              </text>
              <rect
                x="25.5"
                y="12"
                width="2.6"
                height="14"
                rx="0.5"
                className="cursor-blink"
                style={{ fill: "var(--bg)" }}
              />
            </svg>
          </a>
          <h1 className="nimbus uppercase tracking-wide mt-10 md:hidden text-base">
            <a href="/">{NAME}</a>
          </h1>
        </div>
        <Nav />
      </div>
    </aside>
  );
}
