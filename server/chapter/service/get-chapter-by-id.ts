import { bookAuthor, chapter, subject } from "@/db/schema";
import db from "@/lib/db";
import { eq, sql } from "drizzle-orm";

const chapterByIdStatement = db
  .select({
    id: chapter.id,
    name: chapter.name,
    subject: {
      name: subject.name,
      id: subject.id,
    },
    book: {
      name: bookAuthor.name,
      id: bookAuthor.id,
    },
  })
  .from(chapter)
  .innerJoin(bookAuthor, eq(bookAuthor.id, chapter.bookAuthorId))
  .innerJoin(subject, eq(subject.id, bookAuthor.subjectId))
  .where(eq(chapter.id, sql.placeholder("id")))
  .prepare("get_chapter_by_id");

export async function getChapterById(id: string) {
  const [chapterById] = await chapterByIdStatement.execute({ id });
  return chapterById;
}
