import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import Portfolio from "@/lib/models/Portfolio";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const portfolio = await Portfolio.findOne().lean();
    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }
    return NextResponse.json(portfolio);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    let portfolio = await Portfolio.findOne();
    if (portfolio) {
      Object.assign(portfolio, body);
      await portfolio.save();
    } else {
      portfolio = await Portfolio.create(body);
    }

    return NextResponse.json(portfolio);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
