import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import Comment from "@/lib/models/Comment";
import Post from "@/lib/models/Post";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all");

    const query: any = { postSlug: params.slug };
    if (!all) query.approved = true;

    const comments = await Comment.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json(comments);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.name || !body.email || !body.content) {
      return NextResponse.json({ error: "Name, email, and comment are required" }, { status: 400 });
    }

    const post = await Post.findOne({ slug: params.slug });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const comment = await Comment.create({
      postId: post._id.toString(),
      postSlug: params.slug,
      name: body.name,
      email: body.email,
      content: body.content,
      approved: false,
    });

    return NextResponse.json(comment, { status: 201 });
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

    if (!body.commentId) {
      return NextResponse.json({ error: "Comment ID required" }, { status: 400 });
    }

    const comment = await Comment.findByIdAndUpdate(
      body.commentId,
      { approved: body.approved },
      { new: true }
    );

    return NextResponse.json(comment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
