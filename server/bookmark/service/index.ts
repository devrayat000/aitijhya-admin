import { desc, eq } from "drizzle-orm";

import { bookAuthor, bookmark, chapter, post, subject } from "@/db/schema";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { redirect } from "next/navigation";

export async function getBookmarkedList() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }

  const bookmarked = await db
    .select({
      postId: bookmark.postId,
    })
    .from(bookmark)
    .where(eq(bookmark.userId, session.user.id))
    .orderBy(desc(bookmark.createdAt));

  return bookmarked;
}

export type BookmarkedList = Awaited<ReturnType<typeof getBookmarkedList>>;

export * from "./get-bookmarked-posts";
