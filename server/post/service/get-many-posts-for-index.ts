import { bookAuthor, post, subject, chapter } from "@/db/schema";
import db from "@/lib/db";
import { eq, inArray } from "drizzle-orm";

export async function getManyPostsForIndexing(ids: string[]) {
  const posts = await db
    .select({
      objectID: post.id,
      text: post.text,
      keywords: post.keywords,
      imageUrl: post.imageUrl,
      chapter: {
        name: chapter.name,
      },
      subject: {
        name: subject.name,
      },
      book: {
        name: bookAuthor.name,
        edition: bookAuthor.edition,
      },
    })
    .from(post)
    .innerJoin(chapter, eq(chapter.id, post.chapterId))
    .innerJoin(bookAuthor, eq(bookAuthor.id, chapter.bookAuthorId))
    .innerJoin(subject, eq(subject.id, bookAuthor.subjectId))
    .where(inArray(post.id, ids));
  return posts;
}
