import { bookAuthor, chapter, subject } from "@/db/schema";
import db from "@/lib/db";
import { eq } from "drizzle-orm";

export async function getChapters() {
  const books = await db
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
    .innerJoin(subject, eq(subject.id, bookAuthor.subjectId));
  return books;
}

export async function getChapterById(id: string) {
  const [book] = await db
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
    .where(eq(chapter.id, id));
  return book;
}
