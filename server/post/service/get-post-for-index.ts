import { bookAuthor, post, subject, chapter } from "@/db/schema";
import db from "@/lib/db";
import { eq, sql } from "drizzle-orm";

const postIndexStatement = db
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
  .where(eq(post.id, sql.placeholder("id")))
  .prepare("get_post_by_id_for_indexing");

export async function getPostByIdForIndexing(id: string) {
  const [postById] = await postIndexStatement.execute({ id });
  return postById;
}

export type PostHit = Awaited<ReturnType<typeof getPostByIdForIndexing>>;
