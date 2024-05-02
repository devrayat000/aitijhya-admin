import { bookAuthor, subject } from "@/db/schema";
import db from "@/lib/db";
import { eq, sql } from "drizzle-orm";

const booksByIdStatement = db
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
  .innerJoin(subject, eq(bookAuthor.subjectId, subject.id))
  .where(eq(bookAuthor.id, sql.placeholder("id")))
  .prepare("get_book_by_id");

export async function getBookById(id: string) {
  const [bookById] = await booksByIdStatement.execute({ id });
  return bookById;
}
