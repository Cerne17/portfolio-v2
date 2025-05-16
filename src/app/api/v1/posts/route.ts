import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
  // Takes request for filtering and/or pagination
  // To be added

  try {
    const posts = await prisma.post.findMany({
      where: {
        publishedAt: {
          not: null,
          lte: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        imageUrl: true,
        publishedAt: true,
        views: true,
        // Omiting content to prevent overloading blog list page
      },
    });
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.log("Error fetching posts:", error);
    return NextResponse.json(
      { message: "Error fetching posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, slug, excerpt, imageUrl, publishedAt } = body; // Add publishedAt here

    if (!title || !content || !slug) {
      return NextResponse.json(
        { message: "Missing required fields (title, content, slug)" },
        { status: 400 }
      );
    }

    const existingPost = await prisma.post.findUnique({ where: { slug } });
    if (existingPost) {
      return NextResponse.json(
        { message: "Slug already exists" },
        { status: 409 }
      ); // Conflict
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        slug,
        excerpt,
        imageUrl,
        publishedAt: publishedAt
          ? new Date(publishedAt)
          : body.publishNow
          ? new Date()
          : null, // Handle publishNow or specific date
        // 'views' will default to 0
      },
    });
    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    console.error("Error creating post:", error);
    // Check for Prisma unique constraint violation for slug
    if (error.code === "P2002" && error.meta?.target?.includes("slug")) {
      return NextResponse.json(
        { message: "A post with this slug already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: "Error creating post", error: error.message },
      { status: 500 }
    );
  }
}
