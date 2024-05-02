import { bookAuthor, post, subject, chapter } from "@/db/schema";
import db from "@/lib/db";
import { eq, sql } from "drizzle-orm";
import { TableData } from "../../types";

const postByIdStatement = db
  .select({
    id: post.id,
    text: post.text,
    page: post.page,
    keywords: post.keywords,
    imageUrl: post.imageUrl,
    chapter: {
      name: chapter.name,
      id: chapter.id,
    },
    subject: {
      name: subject.name,
      id: subject.id,
    },
    book: {
      name: bookAuthor.name,
      id: bookAuthor.id,
    },
  })
  .from(post)
  .innerJoin(chapter, eq(chapter.id, post.chapterId))
  .innerJoin(bookAuthor, eq(bookAuthor.id, chapter.bookAuthorId))
  .innerJoin(subject, eq(subject.id, bookAuthor.subjectId))
  .where(eq(post.id, sql.placeholder("id")))
  .prepare("get_post_by_id");

export async function getPostById(id: string) {
  const [postById] = await postByIdStatement.execute({ id });
  return postById;
}

export type PostById = TableData<typeof postByIdStatement>;
