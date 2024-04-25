import { bookAuthor, subject } from "@/db/schema";
import db from "@/lib/db";
import { eq } from "drizzle-orm";

export async function getBooks() {
  const books = await db
    .select({
      id: bookAuthor.id,
      name: bookAuthor.name,
      edition: bookAuthor.edition,
      marked: bookAuthor.marked,
      subject: {
        name: subject.name,
        id: subject.id,
      },
    })
    .from(bookAuthor)
    .innerJoin(subject, eq(bookAuthor.subjectId, subject.id));
  return books;
}

export async function getBookById(id: string) {
  const [book] = await db
    .select({
      id: bookAuthor.id,
      name: bookAuthor.name,
      edition: bookAuthor.edition,
      marked: bookAuthor.marked,
      coverUrl: bookAuthor.coverUrl,
      subject: {
        name: subject.name,
        id: subject.id,
      },
    })
    .from(bookAuthor)
    .innerJoin(subject, eq(bookAuthor.subjectId, subject.id))
    .where(eq(bookAuthor.id, id));
  return book;
}
