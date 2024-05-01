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

export async function getBookmarkedPosts() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }

  const bookmarked = await db
    .select({
      id: post.id,
      page: post.page,
      imageUrl: post.imageUrl,
      chapter: chapter.name,
      subject: subject.name,
      book: bookAuthor.name,
    })
    .from(bookmark)
    .innerJoin(post, eq(bookmark.postId, post.id))
    .innerJoin(chapter, eq(chapter.id, post.chapterId))
    .innerJoin(bookAuthor, eq(bookAuthor.id, chapter.bookAuthorId))
    .innerJoin(subject, eq(subject.id, bookAuthor.subjectId))
    .where(eq(bookmark.userId, session.user.id))
    .orderBy(desc(bookmark.createdAt));

  return bookmarked;
}
