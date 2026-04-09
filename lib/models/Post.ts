import mongoose, { Schema, models } from "mongoose";

export interface IPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  category: string;
  status: "draft" | "published";
  readingTime: number;
  views: number;
  author: string;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String, default: "" },
    tags: [{ type: String }],
    category: { type: String, default: "General" },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    readingTime: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    author: { type: String, default: "Prabal Tripathi" },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

PostSchema.index({ slug: 1 });
PostSchema.index({ status: 1, publishedAt: -1 });
PostSchema.index({ tags: 1 });

export default models.Post || mongoose.model<IPost>("Post", PostSchema);
