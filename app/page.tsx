import Link from "next/link";
import {
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  Code2,
  Briefcase,
  GraduationCap,
  Trophy,
  ChevronRight,
  ExternalLink,
  Clock,
  Eye,
} from "lucide-react";
import { connectDB } from "@/lib/db";
import Portfolio from "@/lib/models/Portfolio";
import Post from "@/lib/models/Post";
import NewsletterForm from "@/components/NewsletterForm";

async function getData() {
  await connectDB();
  const portfolio = await Portfolio.findOne().lean();
  const posts = await Post.find({ status: "published" })
    .sort({ publishedAt: -1 })
    .limit(3)
    .lean();
  return { portfolio: JSON.parse(JSON.stringify(portfolio)), posts: JSON.parse(JSON.stringify(posts)) };
}

export default async function HomePage() {
  const { portfolio, posts } = await getData();

  if (!portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Welcome to prabal.dev</h1>
          <p className="text-zinc-400">Run <code className="text-brand-400">npm run seed</code> to initialize your portfolio data.</p>
        </div>
      </div>
    );
  }

  const skillsByCategory = portfolio.skills?.reduce((acc: any, skill: any) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill.name);
    return acc;
  }, {}) || {};

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-[128px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[128px] animate-float" style={{ animationDelay: "3s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[200px]" />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative max-w-6xl mx-auto px-6 py-32 text-center">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Available for collaborations
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
            <span className="block text-white">Hi, I&apos;m</span>
            <span className="block gradient-text">{portfolio.name}</span>
          </h1>

          <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-4 font-light">
            {portfolio.title}
          </p>

          <p className="text-base md:text-lg text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            {portfolio.tagline}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <Link href="/blog" className="btn-primary text-base">
              Read My Blog <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/about" className="btn-secondary text-base">
              About Me
            </Link>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-3">
            {portfolio.socialLinks?.github && (
              <a href={portfolio.socialLinks.github} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.12] transition-all">
                <Github className="w-5 h-5" />
              </a>
            )}
            {portfolio.socialLinks?.linkedin && (
              <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.12] transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            <a href={`mailto:${portfolio.email}`}
              className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.12] transition-all">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-zinc-700 flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-zinc-500 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Experience Section */}
      {portfolio.experience?.length > 0 && (
        <section className="py-24 relative">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-2">
              <Briefcase className="w-5 h-5 text-brand-400" />
              <span className="text-brand-400 font-medium text-sm uppercase tracking-wider">Experience</span>
            </div>
            <h2 className="section-heading mb-12">Where I&apos;ve Worked</h2>

            <div className="space-y-6">
              {portfolio.experience.map((exp: any, i: number) => (
                <div key={i} className="glass-card-hover p-6 md:p-8 group">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-brand-400 transition-colors">
                        {exp.role}
                      </h3>
                      <p className="text-brand-400 font-medium">{exp.company}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-2 md:mt-0">
                      <span className="text-zinc-500 text-sm">{exp.period}</span>
                      {exp.current && (
                        <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/20">
                          Current
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-zinc-500 text-sm mb-4">{exp.location}</p>
                  <ul className="space-y-2">
                    {exp.description?.map((item: string, j: number) => (
                      <li key={j} className="flex items-start gap-3 text-zinc-400 text-sm leading-relaxed">
                        <ChevronRight className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {Object.keys(skillsByCategory).length > 0 && (
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-950/20 to-transparent" />
          <div className="relative max-w-6xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-2">
              <Code2 className="w-5 h-5 text-brand-400" />
              <span className="text-brand-400 font-medium text-sm uppercase tracking-wider">Skills</span>
            </div>
            <h2 className="section-heading mb-12">Tech Stack</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(skillsByCategory).map(([category, skills]: [string, any]) => (
                <div key={category} className="glass-card p-6">
                  <h3 className="text-sm font-semibold text-brand-400 uppercase tracking-wider mb-4">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill: string) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-sm text-zinc-300 hover:bg-brand-600/10 hover:border-brand-500/20 hover:text-brand-300 transition-all cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {portfolio.projects?.length > 0 && (
        <section className="py-24 relative">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-2">
              <Code2 className="w-5 h-5 text-brand-400" />
              <span className="text-brand-400 font-medium text-sm uppercase tracking-wider">Projects</span>
            </div>
            <h2 className="section-heading mb-12">Featured Work</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolio.projects.map((project: any, i: number) => (
                <div key={i} className="glass-card-hover p-6 md:p-8 group flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-brand-400 transition-colors">
                      {project.title}
                    </h3>
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                        className="text-zinc-500 hover:text-white transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-4 flex-1">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack?.map((tech: string) => (
                      <span key={tech} className="px-2.5 py-1 bg-brand-600/10 text-brand-400 text-xs font-medium rounded-md border border-brand-500/10">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Blog Posts */}
      {posts.length > 0 && (
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-950/20 to-transparent" />
          <div className="relative max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-brand-400 font-medium text-sm uppercase tracking-wider">Blog</span>
                </div>
                <h2 className="section-heading">Latest Articles</h2>
              </div>
              <Link href="/blog" className="btn-ghost">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post: any) => (
                <Link key={post._id} href={`/blog/${post.slug}`} className="glass-card-hover p-6 group flex flex-col">
                  {post.coverImage && (
                    <div className="w-full h-40 rounded-xl overflow-hidden mb-4 bg-white/[0.03]">
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-xs text-zinc-500 mb-3">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readingTime} min read</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views} views</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-brand-400 transition-colors mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {post.tags?.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="px-2 py-0.5 bg-white/[0.04] text-zinc-500 text-xs rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Achievements */}
      {portfolio.achievements?.length > 0 && (
        <section className="py-24 relative">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-5 h-5 text-brand-400" />
              <span className="text-brand-400 font-medium text-sm uppercase tracking-wider">Achievements</span>
            </div>
            <h2 className="section-heading mb-12">Milestones</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {portfolio.achievements.map((ach: any, i: number) => (
                <div key={i} className="glass-card p-6 group">
                  <div className="text-3xl font-bold text-brand-400 mb-2">{ach.year}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{ach.title}</h3>
                  <p className="text-zinc-500 text-sm">{ach.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education */}
      {portfolio.education?.length > 0 && (
        <section className="py-24 relative">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-2">
              <GraduationCap className="w-5 h-5 text-brand-400" />
              <span className="text-brand-400 font-medium text-sm uppercase tracking-wider">Education</span>
            </div>
            <h2 className="section-heading mb-12">Academic Background</h2>

            {portfolio.education.map((edu: any, i: number) => (
              <div key={i} className="glass-card p-6 md:p-8">
                <h3 className="text-xl font-bold text-white">{edu.institution}</h3>
                <p className="text-brand-400 font-medium mt-1">{edu.degree}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-zinc-500">
                  <span>{edu.period}</span>
                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-950/30 to-transparent" />
        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <h2 className="section-heading mb-4">Stay in the Loop</h2>
          <p className="section-subheading mx-auto mb-8">
            I write about engineering, system design, and the tools I build. Subscribe to get notified when I publish something new.
          </p>
          <div className="glass-card p-8">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  );
}
