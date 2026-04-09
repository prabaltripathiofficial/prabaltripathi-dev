import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import Post from "@/lib/models/Post";
import Comment from "@/lib/models/Comment";
import Subscriber from "@/lib/models/Subscriber";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      totalComments,
      pendingComments,
      totalSubscribers,
      totalViewsResult,
    ] = await Promise.all([
      Post.countDocuments(),
      Post.countDocuments({ status: "published" }),
      Post.countDocuments({ status: "draft" }),
      Comment.countDocuments(),
      Comment.countDocuments({ approved: false }),
      Subscriber.countDocuments({ active: true }),
      Post.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
    ]);

    const totalViews = totalViewsResult[0]?.total || 0;

    const recentPosts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title slug status views createdAt")
      .lean();

    const recentComments = await Comment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({
      stats: {
        totalPosts,
        publishedPosts,
        draftPosts,
        totalComments,
        pendingComments,
        totalSubscribers,
        totalViews,
      },
      recentPosts,
      recentComments,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
