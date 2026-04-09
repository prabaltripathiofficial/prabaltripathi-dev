import type { Metadata } from "next";
import { Heart, Coffee, Star, Zap, Github, Mail, CreditCard } from "lucide-react";

export const metadata: Metadata = {
  title: "Sponsor",
  description: "Support Prabal Tripathi's open-source work and content creation.",
};

const tiers = [
  {
    name: "Coffee",
    icon: Coffee,
    amount: "$5",
    description: "Buy me a coffee to fuel late-night coding sessions.",
    color: "from-amber-500 to-orange-600",
    perks: ["A heartfelt thank you", "Name in supporters list"],
  },
  {
    name: "Supporter",
    icon: Heart,
    amount: "$15",
    description: "Support my open-source work and content creation.",
    color: "from-pink-500 to-rose-600",
    perks: [
      "Everything in Coffee",
      "Early access to articles",
      "Priority comment responses",
    ],
    popular: true,
  },
  {
    name: "Sponsor",
    icon: Star,
    amount: "$50",
    description: "Become an official sponsor and get premium perks.",
    color: "from-brand-500 to-purple-600",
    perks: [
      "Everything in Supporter",
      "Logo/name on the website",
      "Monthly 1:1 chat session",
      "Custom article requests",
    ],
  },
];

export default function SponsorPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm mb-6">
            <Heart className="w-4 h-4 fill-current" />
            Support Open Source
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Sponsor My Work
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
            I build open-source tools, write engineering articles, and mentor developers.
            Your sponsorship helps me dedicate more time to creating quality content
            and contributing to the community.
          </p>
        </section>

        {/* Tiers */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.name}
                className={`glass-card p-6 flex flex-col relative ${
                  tier.popular ? "border-brand-500/30 glow-effect" : ""
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-brand-600 text-white text-xs font-medium rounded-full">
                    Most Popular
                  </div>
                )}

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-xl font-bold text-white mb-1">{tier.name}</h3>
                <div className="text-3xl font-bold gradient-text mb-2">
                  {tier.amount}
                  <span className="text-sm text-zinc-500 font-normal">/month</span>
                </div>

                <p className="text-zinc-400 text-sm mb-6">{tier.description}</p>

                <ul className="space-y-2 mb-6 flex-1">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2 text-sm text-zinc-300">
                      <Zap className="w-3 h-3 text-brand-400 flex-shrink-0" />
                      {perk}
                    </li>
                  ))}
                </ul>

                <a
                  href="mailto:prabaltripathiofficial@gmail.com?subject=Sponsorship%20Inquiry"
                  className={tier.popular ? "btn-primary w-full" : "btn-secondary w-full"}
                >
                  <CreditCard className="w-4 h-4" />
                  Sponsor {tier.name}
                </a>
              </div>
            );
          })}
        </section>

        {/* Other ways to support */}
        <section className="glass-card p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Other Ways to Support</h2>
          <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
            Not ready for a monthly commitment? There are other ways to show your support.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <a
              href="https://github.com/prabaltripathi"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card-hover p-4 flex flex-col items-center gap-2 text-center"
            >
              <Github className="w-6 h-6 text-zinc-300" />
              <span className="font-medium text-sm">Star my repos</span>
              <span className="text-xs text-zinc-500">on GitHub</span>
            </a>

            <a
              href="https://linkedin.com/in/prabaltripathiofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card-hover p-4 flex flex-col items-center gap-2 text-center"
            >
              <Star className="w-6 h-6 text-zinc-300" />
              <span className="font-medium text-sm">Endorse skills</span>
              <span className="text-xs text-zinc-500">on LinkedIn</span>
            </a>

            <a
              href="mailto:prabaltripathiofficial@gmail.com"
              className="glass-card-hover p-4 flex flex-col items-center gap-2 text-center"
            >
              <Mail className="w-6 h-6 text-zinc-300" />
              <span className="font-medium text-sm">Send feedback</span>
              <span className="text-xs text-zinc-500">via Email</span>
            </a>
          </div>
        </section>

        {/* UPI / India specific */}
        <section className="mt-8 glass-card p-8 text-center">
          <h3 className="text-lg font-bold mb-2">From India?</h3>
          <p className="text-zinc-400 text-sm mb-4">
            You can support me directly via UPI. Just scan or use the ID below:
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/[0.08] rounded-xl">
            <span className="text-brand-400 font-mono font-medium">9565958869@yespop</span>
          </div>
          <p className="text-xs text-zinc-600 mt-2">
            Or reach out via email for other payment methods.
          </p>
        </section>
      </div>
    </div>
  );
}
