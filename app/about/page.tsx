import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Mail,
  Phone,
  Github,
  Linkedin,
  Download,
  Briefcase,
  GraduationCap,
  Trophy,
  Code2,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { connectDB } from "@/lib/db";
import Portfolio from "@/lib/models/Portfolio";

export const metadata: Metadata = { title: "About" };

async function getData() {
  await connectDB();
  const portfolio = await Portfolio.findOne().lean();
  return JSON.parse(JSON.stringify(portfolio));
}

export default async function AboutPage() {
  const portfolio = await getData();

  if (!portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <p className="text-zinc-400">Portfolio not found. Run seed first.</p>
      </div>
    );
  }

  const skillsByCategory = portfolio.skills?.reduce((acc: any, skill: any) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill.name);
    return acc;
  }, {}) || {};

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar placeholder */}
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white flex-shrink-0 shadow-2xl shadow-brand-600/20">
              {portfolio.name?.split(" ").map((n: string) => n[0]).join("")}
            </div>

            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
                {portfolio.name}
              </h1>
              <p className="text-xl text-brand-400 font-medium mb-4">{portfolio.title}</p>

              <div className="flex flex-wrap gap-4 text-sm text-zinc-400 mb-6">
                {portfolio.location && (
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{portfolio.location}</span>
                )}
                <a href={`mailto:${portfolio.email}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />{portfolio.email}
                </a>
                {portfolio.phone && (
                  <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" />{portfolio.phone}</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {portfolio.socialLinks?.github && (
                  <a href={portfolio.socialLinks.github} target="_blank" rel="noopener noreferrer"
                    className="btn-ghost text-sm"><Github className="w-4 h-4" /> GitHub</a>
                )}
                {portfolio.socialLinks?.linkedin && (
                  <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                    className="btn-ghost text-sm"><Linkedin className="w-4 h-4" /> LinkedIn</a>
                )}
                {portfolio.resumeUrl && (
                  <a href={portfolio.resumeUrl} target="_blank" rel="noopener noreferrer"
                    className="btn-primary text-sm"><Download className="w-4 h-4" /> Resume</a>
                )}
              </div>
            </div>
          </div>

          {portfolio.bio && (
            <div className="mt-8 glass-card p-6 md:p-8">
              <p className="text-zinc-300 leading-relaxed text-lg">{portfolio.bio}</p>
            </div>
          )}
        </section>

        {/* Experience */}
        {portfolio.experience?.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Briefcase className="w-5 h-5 text-brand-400" />
              <h2 className="text-2xl font-bold">Experience</h2>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/[0.06]" />

              <div className="space-y-8">
                {portfolio.experience.map((exp: any, i: number) => (
                  <div key={i} className="relative pl-8">
                    {/* Timeline dot */}
                    <div className={`absolute left-0 top-2 w-[15px] h-[15px] rounded-full border-2 ${
                      exp.current
                        ? "bg-brand-500 border-brand-400 shadow-lg shadow-brand-500/30"
                        : "bg-[#111118] border-zinc-700"
                    }`} />

                    <div className="glass-card p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                        <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                        {exp.current && (
                          <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/20 w-fit">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-brand-400 font-medium text-sm">{exp.company}</p>
                      <p className="text-zinc-500 text-xs mt-1">{exp.location} &middot; {exp.period}</p>

                      <ul className="mt-4 space-y-2">
                        {exp.description?.map((item: string, j: number) => (
                          <li key={j} className="flex items-start gap-2 text-zinc-400 text-sm leading-relaxed">
                            <ChevronRight className="w-3 h-3 text-brand-500 mt-1 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Skills */}
        {Object.keys(skillsByCategory).length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Code2 className="w-5 h-5 text-brand-400" />
              <h2 className="text-2xl font-bold">Technical Skills</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(skillsByCategory).map(([category, skills]: [string, any]) => (
                <div key={category} className="glass-card p-5">
                  <h3 className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-3">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill: string) => (
                      <span key={skill} className="px-2.5 py-1 bg-white/[0.04] border border-white/[0.06] rounded-md text-sm text-zinc-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {portfolio.projects?.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Code2 className="w-5 h-5 text-brand-400" />
              <h2 className="text-2xl font-bold">Projects</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolio.projects.map((project: any, i: number) => (
                <div key={i} className="glass-card-hover p-6 flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-white">{project.title}</h3>
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                        className="text-zinc-500 hover:text-white transition-colors">
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-4 flex-1">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack?.map((tech: string) => (
                      <span key={tech} className="px-2 py-0.5 bg-brand-600/10 text-brand-400 text-xs rounded-md border border-brand-500/10">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements */}
        {portfolio.achievements?.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-5 h-5 text-brand-400" />
              <h2 className="text-2xl font-bold">Achievements</h2>
            </div>

            <div className="space-y-3">
              {portfolio.achievements.map((ach: any, i: number) => (
                <div key={i} className="glass-card p-5 flex items-center gap-4">
                  <div className="text-2xl font-bold text-brand-500 w-16 flex-shrink-0 text-center">{ach.year}</div>
                  <div className="border-l border-white/[0.06] pl-4">
                    <h3 className="font-semibold text-white">{ach.title}</h3>
                    <p className="text-zinc-500 text-sm">{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {portfolio.education?.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <GraduationCap className="w-5 h-5 text-brand-400" />
              <h2 className="text-2xl font-bold">Education</h2>
            </div>

            {portfolio.education.map((edu: any, i: number) => (
              <div key={i} className="glass-card p-6">
                <h3 className="text-lg font-bold text-white">{edu.institution}</h3>
                <p className="text-brand-400 font-medium text-sm mt-1">{edu.degree}</p>
                <div className="flex items-center gap-3 mt-2 text-zinc-500 text-sm">
                  <span>{edu.period}</span>
                  {edu.gpa && <span>&middot; GPA: {edu.gpa}</span>}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* CTA */}
        <section className="glass-card p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Let&apos;s Connect</h2>
          <p className="text-zinc-400 mb-6">Interested in collaborating or just want to chat? Feel free to reach out.</p>
          <div className="flex items-center justify-center gap-4">
            <a href={`mailto:${portfolio.email}`} className="btn-primary">
              <Mail className="w-4 h-4" /> Get in Touch
            </a>
            <Link href="/sponsor" className="btn-secondary">
              Sponsor Me <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
