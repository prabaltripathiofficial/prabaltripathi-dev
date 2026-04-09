"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Loader2,
  Plus,
  Trash2,
  User,
  Briefcase,
  Code2,
  Trophy,
  GraduationCap,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminPortfolioPage() {
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((data) => setPortfolio(data))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(portfolio),
      });
      if (res.ok) {
        toast.success("Portfolio updated!");
      } else {
        toast.error("Failed to update");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setPortfolio((prev: any) => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    setPortfolio((prev: any) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  };

  // Experience helpers
  const addExperience = () => {
    updateField("experience", [
      ...(portfolio.experience || []),
      { company: "", role: "", location: "", period: "", description: [""], current: false },
    ]);
  };

  const removeExperience = (idx: number) => {
    updateField("experience", portfolio.experience.filter((_: any, i: number) => i !== idx));
  };

  const updateExperience = (idx: number, field: string, value: any) => {
    const updated = [...portfolio.experience];
    updated[idx] = { ...updated[idx], [field]: value };
    updateField("experience", updated);
  };

  // Project helpers
  const addProject = () => {
    updateField("projects", [
      ...(portfolio.projects || []),
      { title: "", description: "", techStack: [], githubUrl: "", liveUrl: "", image: "", featured: false },
    ]);
  };

  const removeProject = (idx: number) => {
    updateField("projects", portfolio.projects.filter((_: any, i: number) => i !== idx));
  };

  const updateProject = (idx: number, field: string, value: any) => {
    const updated = [...portfolio.projects];
    updated[idx] = { ...updated[idx], [field]: value };
    updateField("projects", updated);
  };

  // Skill helpers
  const addSkill = () => {
    updateField("skills", [...(portfolio.skills || []), { name: "", category: "Languages" }]);
  };

  const removeSkill = (idx: number) => {
    updateField("skills", portfolio.skills.filter((_: any, i: number) => i !== idx));
  };

  // Achievement helpers
  const addAchievement = () => {
    updateField("achievements", [...(portfolio.achievements || []), { title: "", description: "", year: "" }]);
  };

  const removeAchievement = (idx: number) => {
    updateField("achievements", portfolio.achievements.filter((_: any, i: number) => i !== idx));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (!portfolio || portfolio.error) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-zinc-400">Portfolio not found. Run <code className="text-brand-400">npm run seed</code> first.</p>
      </div>
    );
  }

  const tabs = [
    { id: "basic", label: "Basic Info", icon: User },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "projects", label: "Projects", icon: Code2 },
    { id: "skills", label: "Skills", icon: Code2 },
    { id: "achievements", label: "Achievements", icon: Trophy },
    { id: "education", label: "Education", icon: GraduationCap },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Edit Portfolio</h1>
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-brand-600/10 text-brand-400 border border-brand-500/10"
                  : "text-zinc-500 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Basic Info */}
      {activeTab === "basic" && (
        <div className="glass-card p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Name</label>
              <input type="text" value={portfolio.name || ""} onChange={(e) => updateField("name", e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Title</label>
              <input type="text" value={portfolio.title || ""} onChange={(e) => updateField("title", e.target.value)} className="input-field" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">Tagline</label>
            <input type="text" value={portfolio.tagline || ""} onChange={(e) => updateField("tagline", e.target.value)} className="input-field" />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">Bio</label>
            <textarea value={portfolio.bio || ""} onChange={(e) => updateField("bio", e.target.value)} rows={4} className="input-field resize-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Email</label>
              <input type="email" value={portfolio.email || ""} onChange={(e) => updateField("email", e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Phone</label>
              <input type="text" value={portfolio.phone || ""} onChange={(e) => updateField("phone", e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Location</label>
              <input type="text" value={portfolio.location || ""} onChange={(e) => updateField("location", e.target.value)} className="input-field" />
            </div>
          </div>

          <h3 className="font-semibold text-sm text-zinc-300 pt-4 border-t border-white/[0.06]">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">GitHub</label>
              <input type="url" value={portfolio.socialLinks?.github || ""} onChange={(e) => updateNestedField("socialLinks", "github", e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">LinkedIn</label>
              <input type="url" value={portfolio.socialLinks?.linkedin || ""} onChange={(e) => updateNestedField("socialLinks", "linkedin", e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Twitter</label>
              <input type="url" value={portfolio.socialLinks?.twitter || ""} onChange={(e) => updateNestedField("socialLinks", "twitter", e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">LeetCode</label>
              <input type="url" value={portfolio.socialLinks?.leetcode || ""} onChange={(e) => updateNestedField("socialLinks", "leetcode", e.target.value)} className="input-field" />
            </div>
          </div>
        </div>
      )}

      {/* Experience */}
      {activeTab === "experience" && (
        <div className="space-y-4">
          {portfolio.experience?.map((exp: any, i: number) => (
            <div key={i} className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Experience #{i + 1}</h3>
                <button onClick={() => removeExperience(i)} className="p-2 hover:bg-red-500/10 text-zinc-500 hover:text-red-400 rounded-lg transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="text" value={exp.company || ""} onChange={(e) => updateExperience(i, "company", e.target.value)} placeholder="Company" className="input-field" />
                <input type="text" value={exp.role || ""} onChange={(e) => updateExperience(i, "role", e.target.value)} placeholder="Role" className="input-field" />
                <input type="text" value={exp.location || ""} onChange={(e) => updateExperience(i, "location", e.target.value)} placeholder="Location" className="input-field" />
                <input type="text" value={exp.period || ""} onChange={(e) => updateExperience(i, "period", e.target.value)} placeholder="Period" className="input-field" />
              </div>
              <div className="mt-3">
                <label className="block text-sm text-zinc-400 mb-1.5">Description (one per line)</label>
                <textarea
                  value={exp.description?.join("\n") || ""}
                  onChange={(e) => updateExperience(i, "description", e.target.value.split("\n"))}
                  rows={4}
                  className="input-field resize-none text-sm"
                />
              </div>
              <label className="flex items-center gap-2 mt-3 text-sm text-zinc-400">
                <input type="checkbox" checked={exp.current || false} onChange={(e) => updateExperience(i, "current", e.target.checked)} className="rounded" />
                Current position
              </label>
            </div>
          ))}
          <button onClick={addExperience} className="btn-secondary w-full"><Plus className="w-4 h-4" /> Add Experience</button>
        </div>
      )}

      {/* Projects */}
      {activeTab === "projects" && (
        <div className="space-y-4">
          {portfolio.projects?.map((project: any, i: number) => (
            <div key={i} className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Project #{i + 1}</h3>
                <button onClick={() => removeProject(i)} className="p-2 hover:bg-red-500/10 text-zinc-500 hover:text-red-400 rounded-lg transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="text" value={project.title || ""} onChange={(e) => updateProject(i, "title", e.target.value)} placeholder="Title" className="input-field" />
                <input type="text" value={project.techStack?.join(", ") || ""} onChange={(e) => updateProject(i, "techStack", e.target.value.split(",").map((s: string) => s.trim()))} placeholder="Tech stack (comma separated)" className="input-field" />
                <input type="url" value={project.githubUrl || ""} onChange={(e) => updateProject(i, "githubUrl", e.target.value)} placeholder="GitHub URL" className="input-field" />
                <input type="url" value={project.liveUrl || ""} onChange={(e) => updateProject(i, "liveUrl", e.target.value)} placeholder="Live URL" className="input-field" />
              </div>
              <textarea value={project.description || ""} onChange={(e) => updateProject(i, "description", e.target.value)} placeholder="Description" rows={3} className="input-field resize-none mt-3" />
              <label className="flex items-center gap-2 mt-3 text-sm text-zinc-400">
                <input type="checkbox" checked={project.featured || false} onChange={(e) => updateProject(i, "featured", e.target.checked)} className="rounded" />
                Featured project
              </label>
            </div>
          ))}
          <button onClick={addProject} className="btn-secondary w-full"><Plus className="w-4 h-4" /> Add Project</button>
        </div>
      )}

      {/* Skills */}
      {activeTab === "skills" && (
        <div className="glass-card p-6">
          <div className="space-y-2">
            {portfolio.skills?.map((skill: any, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  type="text"
                  value={skill.name || ""}
                  onChange={(e) => {
                    const updated = [...portfolio.skills];
                    updated[i] = { ...updated[i], name: e.target.value };
                    updateField("skills", updated);
                  }}
                  placeholder="Skill name"
                  className="input-field flex-1"
                />
                <select
                  value={skill.category || "Languages"}
                  onChange={(e) => {
                    const updated = [...portfolio.skills];
                    updated[i] = { ...updated[i], category: e.target.value };
                    updateField("skills", updated);
                  }}
                  className="input-field w-40"
                >
                  <option value="Languages">Languages</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Tools">Tools</option>
                </select>
                <button onClick={() => removeSkill(i)} className="p-2 hover:bg-red-500/10 text-zinc-500 hover:text-red-400 rounded-lg transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button onClick={addSkill} className="btn-secondary w-full mt-4"><Plus className="w-4 h-4" /> Add Skill</button>
        </div>
      )}

      {/* Achievements */}
      {activeTab === "achievements" && (
        <div className="space-y-4">
          {portfolio.achievements?.map((ach: any, i: number) => (
            <div key={i} className="glass-card p-6 flex gap-4">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                <input type="text" value={ach.title || ""} onChange={(e) => {
                  const updated = [...portfolio.achievements];
                  updated[i] = { ...updated[i], title: e.target.value };
                  updateField("achievements", updated);
                }} placeholder="Title" className="input-field md:col-span-2" />
                <input type="text" value={ach.year || ""} onChange={(e) => {
                  const updated = [...portfolio.achievements];
                  updated[i] = { ...updated[i], year: e.target.value };
                  updateField("achievements", updated);
                }} placeholder="Year" className="input-field" />
                <input type="text" value={ach.description || ""} onChange={(e) => {
                  const updated = [...portfolio.achievements];
                  updated[i] = { ...updated[i], description: e.target.value };
                  updateField("achievements", updated);
                }} placeholder="Description" className="input-field md:col-span-3" />
              </div>
              <button onClick={() => removeAchievement(i)} className="p-2 hover:bg-red-500/10 text-zinc-500 hover:text-red-400 rounded-lg transition-all self-start">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button onClick={addAchievement} className="btn-secondary w-full"><Plus className="w-4 h-4" /> Add Achievement</button>
        </div>
      )}

      {/* Education */}
      {activeTab === "education" && (
        <div className="space-y-4">
          {portfolio.education?.map((edu: any, i: number) => (
            <div key={i} className="glass-card p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="text" value={edu.institution || ""} onChange={(e) => {
                  const updated = [...portfolio.education];
                  updated[i] = { ...updated[i], institution: e.target.value };
                  updateField("education", updated);
                }} placeholder="Institution" className="input-field md:col-span-2" />
                <input type="text" value={edu.degree || ""} onChange={(e) => {
                  const updated = [...portfolio.education];
                  updated[i] = { ...updated[i], degree: e.target.value };
                  updateField("education", updated);
                }} placeholder="Degree" className="input-field" />
                <input type="text" value={edu.period || ""} onChange={(e) => {
                  const updated = [...portfolio.education];
                  updated[i] = { ...updated[i], period: e.target.value };
                  updateField("education", updated);
                }} placeholder="Period" className="input-field" />
                <input type="text" value={edu.gpa || ""} onChange={(e) => {
                  const updated = [...portfolio.education];
                  updated[i] = { ...updated[i], gpa: e.target.value };
                  updateField("education", updated);
                }} placeholder="GPA" className="input-field" />
              </div>
            </div>
          ))}
          <button
            onClick={() => updateField("education", [...(portfolio.education || []), { institution: "", degree: "", period: "", gpa: "" }])}
            className="btn-secondary w-full"
          >
            <Plus className="w-4 h-4" /> Add Education
          </button>
        </div>
      )}
    </div>
  );
}
