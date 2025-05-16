import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface Params {
  slug: string;
}

export async function GET(request: Request, context: { params: Params }) {
  const slug = context.params.slug;

  try {
    // Increment views atomically - "fire and forget" for this request
    // The returned post might not immediately reflect this incremented view
    // unless you re-fetch or handle it differently.
    await prisma.post.updateMany({
      // use updateMany to avoid error if slug not found for increment
      where: {
        slug: slug,
        publishedAt: {
          not: null,
          lte: new Date(),
        },
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    const post = await prisma.post.findUnique({
      where: {
        slug: slug,
        // Ensure we only fetch published posts via this public endpoint
        AND: [
          { publishedAt: { not: null } },
          { publishedAt: { lte: new Date() } },
        ],
      },
      // Include all fields needed for the single post view
      // select: { ... } // Or omit select to get all fields
    });

    if (!post) {
      return NextResponse.json(
        { message: "Post not found or not published" },
        { status: 404 }
      );
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    return NextResponse.json(
      { message: "Error fetching post" },
      { status: 500 }
    );
  }
}
