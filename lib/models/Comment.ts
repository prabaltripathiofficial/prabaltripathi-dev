import mongoose, { Schema, models } from "mongoose";

export interface IComment {
  _id: string;
  postId: string;
  postSlug: string;
  name: string;
  email: string;
  content: string;
  approved: boolean;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    postId: { type: String, required: true },
    postSlug: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    content: { type: String, required: true },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CommentSchema.index({ postSlug: 1, approved: 1 });

export default models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
