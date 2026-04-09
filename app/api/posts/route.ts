import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import Post from "@/lib/models/Post";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || "published";
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");
    const all = searchParams.get("all"); // for admin

    const query: any = {};

    if (!all) {
      query.status = status;
    }

    if (tag) query.tags = tag;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check for duplicate slug
    const existing = await Post.findOne({ slug });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    // Calculate reading time (~200 words per minute)
    const wordCount = body.content.split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const post = await Post.create({
      ...body,
      slug: finalSlug,
      readingTime,
      publishedAt: body.status === "published" ? new Date() : null,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
