import { bookAuthor, subject } from "@/db/schema";
import db from "@/lib/db";
import { count, eq, ilike, sql } from "drizzle-orm";
import { GetParams } from "./types";

const booksStatement = db
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
  .offset(sql.placeholder("offset"))
  .limit(sql.placeholder("limit"))
  .where(ilike(bookAuthor.name, sql.placeholder("query")))
  .prepare("get_books");

const bookCountStatement = db
  .select({ count: count() })
  .from(bookAuthor)
  .where(ilike(bookAuthor.name, sql.placeholder("query")))
  .prepare("get_books_count");

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

export async function getBooks(params?: GetParams) {
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const query = `%${params?.query || ""}%`;

  const [books, [{ count }]] = await Promise.all([
    booksStatement.execute({
      limit,
      offset: (page - 1) * limit,
      query,
    }),
    bookCountStatement.execute({ query }),
  ]);

  return { books, count };
}

export async function getBookById(id: string) {
  const [book] = await booksByIdStatement.execute({ id });
  return book;
}
