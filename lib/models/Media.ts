import mongoose, { Schema, models } from "mongoose";

export interface IMedia {
  _id: string;
  filename: string;
  contentType: string;
  data: Buffer;
  size: number;
  createdAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    data: { type: Buffer, required: true },
    size: { type: Number, required: true },
  },
  { timestamps: true }
);

export default models.Media || mongoose.model<IMedia>("Media", MediaSchema);
