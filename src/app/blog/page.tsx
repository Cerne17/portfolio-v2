import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { Post } from "@prisma/client";

interface BlogPostCardProps {
  post: Pick<
    Post,
    "slug" | "title" | "excerpt" | "imageUrl" | "publishedAt" | "views"
  >;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <article className="bg-white rounded-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
      {post.imageUrl && (
        <Link href={`/blog/${post.slug}`}>
          <Image
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-48 object-cover"
          />
        </Link>
      )}
      <div className="p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          <Link
            href={`/blog/${post.slug}`}
            className="hover:text-blue-600 transition-colors"
          >
            {post.title}
          </Link>
        </h2>
        {post.excerpt && (
          <p className="text-slate-600 text-sm mb-3 leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        )}
        <div className="text-xs text-slate-500 mb-3">
          {post.publishedAt && (
            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
          )}
          <span className="mx-1">•</span>
          <span>{post.views} views</span>
        </div>
        <Link
          href={`/blog/${post.slug}`}
          className="inline-block text-blue-600 hover:text-blue-700 hover:underline text-sm font-medium transition-colors"
        >
          Read more →
        </Link>
      </div>
    </article>
  );
};

async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      where: {
        publishedAt: {
          not: null,
          lte: new Date(),
        },
      },
      orderBy: {
        publishedAt: "desc",
      },
      select: {
        // Select only necessary fields
        id: true, // id is good for the key prop
        title: true,
        slug: true,
        excerpt: true,
        imageUrl: true,
        publishedAt: true,
        views: true,
      },
    });
    return posts;
  } catch (error) {
    console.log("Error fetching posts:", error);
    return [];
  }
}

export default async function BlogListPage() {
  const posts = await getPosts(); // Data fetching happens on the server

  if (!posts || posts.length === 0) {
    return (
      <div className="container min-h-screen min-w-screen bg-slate-200 mx-auto p-6 md:p-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-700 mb-10">
          My Blog
        </h1>
        <p>No posts found. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="container min-h-screen min-w-screen bg-slate-200 mx-auto p-6 md:p-8">
      <h1 className="text-4xl md:text-5xl font-bold text-slate-700 mb-10 text-center">
        My Blog
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          // The Post type from Prisma includes 'id', so we can use it as a key
          // The fields selected in getPosts match what BlogPostCardProps expects
          <BlogPostCard
            key={post.id}
            post={post as BlogPostCardProps["post"]}
          />
        ))}
      </div>
    </div>
  );
}
