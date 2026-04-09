import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Subscriber from "@/lib/models/Subscriber";

export async function GET() {
  try {
    await connectDB();
    const subscribers = await Subscriber.find({ active: true })
      .sort({ subscribedAt: -1 })
      .lean();
    return NextResponse.json(subscribers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      if (!existing.active) {
        existing.active = true;
        await existing.save();
        return NextResponse.json({ message: "Welcome back! You're re-subscribed." });
      }
      return NextResponse.json({ error: "You're already subscribed!" }, { status: 400 });
    }

    await Subscriber.create({ email, name });
    return NextResponse.json({ message: "Successfully subscribed!" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
