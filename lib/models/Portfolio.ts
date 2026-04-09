import mongoose, { Schema, models } from "mongoose";

export interface IExperience {
  company: string;
  role: string;
  location: string;
  period: string;
  description: string[];
  current: boolean;
}

export interface IProject {
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
  image: string;
  featured: boolean;
}

export interface IAchievement {
  title: string;
  description: string;
  year: string;
}

export interface IPortfolio {
  _id: string;
  name: string;
  title: string;
  tagline: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  avatarUrl: string;
  resumeUrl: string;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
    leetcode: string;
  };
  skills: { name: string; category: string }[];
  experience: IExperience[];
  projects: IProject[];
  achievements: IAchievement[];
  education: {
    institution: string;
    degree: string;
    period: string;
    gpa: string;
  }[];
}

const PortfolioSchema = new Schema<IPortfolio>(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    tagline: { type: String, default: "" },
    bio: { type: String, default: "" },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    socialLinks: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
      leetcode: { type: String, default: "" },
    },
    skills: [
      {
        name: { type: String },
        category: { type: String },
      },
    ],
    experience: [
      {
        company: { type: String },
        role: { type: String },
        location: { type: String },
        period: { type: String },
        description: [{ type: String }],
        current: { type: Boolean, default: false },
      },
    ],
    projects: [
      {
        title: { type: String },
        description: { type: String },
        techStack: [{ type: String }],
        githubUrl: { type: String, default: "" },
        liveUrl: { type: String, default: "" },
        image: { type: String, default: "" },
        featured: { type: Boolean, default: false },
      },
    ],
    achievements: [
      {
        title: { type: String },
        description: { type: String },
        year: { type: String },
      },
    ],
    education: [
      {
        institution: { type: String },
        degree: { type: String },
        period: { type: String },
        gpa: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default models.Portfolio || mongoose.model<IPortfolio>("Portfolio", PortfolioSchema);
