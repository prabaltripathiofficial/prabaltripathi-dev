// ---------------------------------------------------------------------------
// SITE CONTENT — placeholder copy. The design mirrors mitchellh.com.
// ---------------------------------------------------------------------------

export const NAME = "Prabal Tripathi";
export const INITIAL = "PT";

export const NAV = [
  { href: "/", id: "/", label: "About" },
  { href: "/writing", id: "/writing", label: "Writing" },
  { href: "/updates", id: "/updates", label: "Updates" },
  { href: "/misc", id: "/misc", label: "Misc" },
];

// Footer social links.
export const SOCIALS = {
  email: "mailto:prabaltripathiofficial@gmail.com",
  twitter: "https://x.com/_i_am_pattyy",
  instagram: "https://instagram.com/withprabal",
  github: "https://github.com/prabaltripathiofficial",
  linkedin: "https://www.linkedin.com/in/prabaltripathiofficial/",
};

export const COPYRIGHT_YEAR = 2026;

// Mood palette for daily updates — emoji + label + accent color.
export type Mood = { key: string; label: string; emoji: string; color: string };
export const MOODS: Mood[] = [
  { key: "locked-in", label: "locked in", emoji: "🔒", color: "#22c55e" },
  { key: "shipping", label: "shipping", emoji: "🚀", color: "#16a34a" },
  { key: "caffeinated", label: "caffeinated", emoji: "☕", color: "#f59e0b" },
  { key: "curious", label: "curious", emoji: "🧠", color: "#8b5cf6" },
  { key: "calm", label: "calm", emoji: "🌿", color: "#10b981" },
  { key: "drained", label: "drained", emoji: "🪫", color: "#60a5fa" },
];

export function moodByKey(key: string): Mood {
  return MOODS.find((m) => m.key === key) || { key, label: key, emoji: "•", color: "#9ca3af" };
}
