import mongoose, { Schema, models } from "mongoose";

export interface ISubscriber {
  _id: string;
  email: string;
  name: string;
  subscribedAt: Date;
  active: boolean;
}

const SubscriberSchema = new Schema<ISubscriber>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, default: "" },
    subscribedAt: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Subscriber || mongoose.model<ISubscriber>("Subscriber", SubscriberSchema);
