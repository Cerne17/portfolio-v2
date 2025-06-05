import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { Post } from "@prisma/client";
import { notFound } from "next/navigation"; // For handling 404

// For rendering Markdown content (install if needed: npm install react-markdown)
// import ReactMarkdown from 'react-markdown';
// For Tailwind Typography (install if needed: npm install -D @tailwindcss/typography)
// and add require('@tailwindcss/typography') to tailwind.config.ts plugins

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    // Atomically increment views and then fetch the post
    // This ensures the view count is for the current view, but makes two DB operations.
    // An alternative is to increment "fire-and-forget" and fetch, then the view count
    // shown would be pre-increment for the current request.
    await prisma.post.updateMany({
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
        AND: [
          // Ensure it's published
          { publishedAt: { not: null } },
          { publishedAt: { lte: new Date() } },
        ],
      },
    });

    return post;
  } catch (error) {
    console.error("Failed to fetch post by slug:", error);
    return null;
  }
}

// Function to generate static paths if you want to use SSG for blog posts
// This tells Next.js which slugs to pre-render at build time.
export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: {
      publishedAt: {
        not: null,
        lte: new Date(),
      },
    },
    select: { slug: true },
  });

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Optional: For dynamic metadata (title, description) for each blog post
export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = await getPost(params.slug); // Re-fetch or use a more optimized query
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }
  return {
    title: `${post.title} | My Blog`,
    description: post.excerpt || "Read this fascinating blog post.",
    // openGraph: {
    //   title: post.title,
    //   description: post.excerpt,
    //   images: post.imageUrl ? [{ url: post.imageUrl }] : [],
    // },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound(); // Triggers the not-found.tsx UI if post isn't found or published
  }

  // Basic rendering of HTML content (ensure it's sanitized if coming from a rich text editor)
  // For Markdown, you'd use a library like 'react-markdown'.
  const renderContent = () => {
    // If your content is Markdown:
    // return <ReactMarkdown className="prose lg:prose-xl max-w-none">{post.content}</ReactMarkdown>;

    // If your content is trusted HTML:
    // return <div className="prose lg:prose-xl max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />;

    // For plain text that might have newlines:
    return post.content.split("\n").map((paragraph, index) => (
      <p key={index} className="mb-4 leading-relaxed">
        {paragraph}
      </p>
    ));
  };

  return (
    <article className="container min-h-screen min-w-screen bg-slate-200 mx-auto p-6 md:p-8 max-w-3xl">
      {post.imageUrl && (
        <Image
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-auto md:h-96 object-cover rounded-lg mb-8 shadow-lg"
        />
      )}
      <h1 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4">
        {post.title}
      </h1>
      <div className="text-sm text-slate-500 mb-6 border-b pb-4">
        {post.publishedAt && (
          <span>
            Published: {new Date(post.publishedAt).toLocaleDateString()}
          </span>
        )}
        <span className="mx-2">|</span>
        <span>Views: {post.views}</span>
        {post.updatedAt.toISOString() !== post.createdAt.toISOString() && ( // More precise comparison
          <>
            <span className="mx-2">|</span>
            <span>
              Updated: {new Date(post.updatedAt).toLocaleDateString()}
            </span>
          </>
        )}
      </div>

      <div className="prose lg:prose-xl max-w-none text-slate-700">
        {renderContent()}
      </div>

      <div className="mt-12 pt-6 border-t">
        <Link href="/blog" className="text-blue-600 hover:underline">
          ← Back to Blog
        </Link>
      </div>
    </article>
  );
}
