import { PrismaClient } from "@prisma/client";

// Creates a Prisma Singleton to prevent multiple
// Prisma Client Instances to run at once and overload
// the database

// Example in an API route: pages/api/posts.ts (or app/api/posts/route.ts)
/*
import prisma from '@/lib/prisma'; // Adjust path if needed

 ...
 const posts = await prisma.post.findMany();
 ...
*/

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : [],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
