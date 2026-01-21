import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongoose";
import Post from "../../../models/Post";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export async function GET() {
  try {
    await connectDB();

    const posts = await Post.find().sort({ createdAt: -1 });
   return NextResponse.json(posts, {
  headers: { "Cache-Control": "no-store" },
});
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Server error (GET)" },
      { status: 500 }
    );
  }
}

// POST: create a new post in DB
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { author, title, content, likes } = body;

    // validation (simple)
    if (!author || !title || !content) {
      return NextResponse.json(
        { error: "Missing fields: author/title/content" },
        { status: 400 }
      );
    }

    const likesNum = Number(likes);
    if (Number.isNaN(likesNum)) {
      return NextResponse.json(
        { error: "Likes must be a number" },
        { status: 400 }
      );
    }

    const created = await Post.create({
      author,
      title,
      content,
      likes: likesNum,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Server error (POST)" },
      { status: 500 }
    );
  }
}

// DELETE: delete a post by id (using query param ?id=...)
export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await Post.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Server error (DELETE)" },
      { status: 500 }
    );
  }
}
