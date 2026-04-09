import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Media from "@/lib/models/Media";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const media = await Media.findById(params.id);

    if (!media) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return new NextResponse(media.data, {
      headers: {
        "Content-Type": media.contentType,
        "Content-Length": media.size.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
