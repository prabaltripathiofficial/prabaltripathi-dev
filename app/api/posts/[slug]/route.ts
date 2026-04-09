import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import Post from "@/lib/models/Post";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await connectDB();
    const post = await Post.findOne({ slug: params.slug });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Increment views
    await Post.updateOne({ slug: params.slug }, { $inc: { views: 1 } });

    return NextResponse.json(post);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    // Recalculate reading time if content changed
    if (body.content) {
      const wordCount = body.content.split(/\s+/).length;
      body.readingTime = Math.max(1, Math.ceil(wordCount / 200));
    }

    // Set publishedAt when publishing for first time
    if (body.status === "published") {
      const existing = await Post.findOne({ slug: params.slug });
      if (existing && !existing.publishedAt) {
        body.publishedAt = new Date();
      }
    }

    const post = await Post.findOneAndUpdate(
      { slug: params.slug },
      { $set: body },
      { new: true }
    );

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const post = await Post.findOneAndDelete({ slug: params.slug });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Post deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
