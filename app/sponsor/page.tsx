import type { Metadata } from "next";
import { Heart, Coffee, Star, Zap, Github, Mail, Smartphone, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Sponsor",
  description: "Support Prabal Tripathi's open-source work and content creation.",
};

const tiers = [
  {
    name: "Coffee",
    icon: Coffee,
    amount: "149",
    upiAmount: "149",
    description: "Buy me a coffee to fuel late-night coding sessions.",
    color: "from-amber-500 to-orange-600",
    perks: ["A heartfelt thank you", "Name in supporters list"],
  },
  {
    name: "Supporter",
    icon: Heart,
    amount: "499",
    upiAmount: "499",
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
    amount: "1499",
    upiAmount: "1499",
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

function getUpiLink(amount: string, name: string) {
  return `upi://pay?pa=9565958869@yespop&pn=Prabal%20Tripathi&am=${amount}&cu=INR&tn=Sponsor%20-%20${encodeURIComponent(name)}`;
}

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

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-primary">
            Sponsor My Work
          </h1>
          <p className="text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
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

                <h3 className="text-xl font-bold text-primary mb-1">{tier.name}</h3>
                <div className="text-3xl font-bold gradient-text mb-2">
                  &#8377;{tier.amount}
                  <span className="text-sm text-muted font-normal">/one-time</span>
                </div>

                <p className="text-secondary text-sm mb-6">{tier.description}</p>

                <ul className="space-y-2 mb-6 flex-1">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2 text-sm text-secondary">
                      <Zap className="w-3 h-3 text-brand-400 flex-shrink-0" />
                      {perk}
                    </li>
                  ))}
                </ul>

                {/* UPI Pay Button */}
                <a
                  href={getUpiLink(tier.upiAmount, tier.name)}
                  className={tier.popular ? "btn-primary w-full" : "btn-secondary w-full"}
                >
                  <Smartphone className="w-4 h-4" />
                  Pay &#8377;{tier.amount} via UPI
                </a>
              </div>
            );
          })}
        </section>

        {/* Direct UPI Section */}
        <section className="glass-card p-8 text-center mb-8">
          <h2 className="text-2xl font-bold text-primary mb-2">Pay Any Amount via UPI</h2>
          <p className="text-secondary mb-6">
            Want to sponsor a custom amount? Use the UPI ID directly or scan with any UPI app.
          </p>

          <div className="inline-flex flex-col items-center gap-4">
            {/* UPI ID */}
            <div className="flex items-center gap-3 px-6 py-3 rounded-xl" style={{ background: "var(--brand-subtle)", border: "1px solid var(--border)" }}>
              <Smartphone className="w-5 h-5 text-brand-400" />
              <span className="font-mono font-semibold text-primary text-lg">9565958869@yespop</span>
            </div>

            {/* Quick amount links */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
              {["50", "100", "200", "500", "1000", "2000"].map((amt) => (
                <a
                  key={amt}
                  href={getUpiLink(amt, "Custom")}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                  style={{ background: "var(--brand-subtle)", border: "1px solid var(--border)", color: "var(--fg)" }}
                >
                  &#8377;{amt}
                </a>
              ))}
            </div>
            <p className="text-muted text-xs mt-1">
              Tap any amount to open your UPI app directly
            </p>
          </div>
        </section>

        {/* Other ways to support */}
        <section className="glass-card p-8 text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">Other Ways to Support</h2>
          <p className="text-secondary mb-8 max-w-lg mx-auto">
            Not ready for a financial contribution? There are other ways to show your support.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <a
              href="https://github.com/prabaltripathiofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card-hover p-4 flex flex-col items-center gap-2 text-center"
            >
              <Github className="w-6 h-6 text-secondary" />
              <span className="font-medium text-sm text-primary">Star my repos</span>
              <span className="text-xs text-muted">on GitHub</span>
            </a>

            <a
              href="https://linkedin.com/in/prabaltripathiofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card-hover p-4 flex flex-col items-center gap-2 text-center"
            >
              <Star className="w-6 h-6 text-secondary" />
              <span className="font-medium text-sm text-primary">Endorse skills</span>
              <span className="text-xs text-muted">on LinkedIn</span>
            </a>

            <a
              href="mailto:prabaltripathiofficial@gmail.com"
              className="glass-card-hover p-4 flex flex-col items-center gap-2 text-center"
            >
              <Mail className="w-6 h-6 text-secondary" />
              <span className="font-medium text-sm text-primary">Send feedback</span>
              <span className="text-xs text-muted">via Email</span>
            </a>
          </div>
        </section>

        {/* International */}
        <section className="mt-8 glass-card p-6 text-center">
          <p className="text-secondary text-sm">
            <strong className="text-primary">International sponsors:</strong> Reach out via{" "}
            <a href="mailto:prabaltripathiofficial@gmail.com" className="text-brand-400 hover:underline">
              email
            </a>{" "}
            and I&apos;ll share payment details for your region.
          </p>
        </section>
      </div>
    </div>
  );
}
