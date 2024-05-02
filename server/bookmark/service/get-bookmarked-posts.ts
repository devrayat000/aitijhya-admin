import { desc, eq, sql } from "drizzle-orm";

import { bookAuthor, bookmark, chapter, post, subject } from "@/db/schema";
import db from "@/lib/db";

const bookmarkedPostStatement = db
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
  .where(eq(bookmark.userId, sql.placeholder("userId")))
  .orderBy(desc(bookmark.createdAt))
  .prepare("get_bookmarked_posts_statement");

export async function getBookmarkedPosts(userId: string) {
  const bookmarked = await bookmarkedPostStatement.execute({ userId });
  return bookmarked;
}
export type BookmarkedPosts = Awaited<ReturnType<typeof getBookmarkedPosts>>;
