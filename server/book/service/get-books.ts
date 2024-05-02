import { bookAuthor, subject } from "@/db/schema";
import db from "@/lib/db";
import { eq, ilike, sql } from "drizzle-orm";
import { GetParams, GetResults, TableData } from "../../types";
import { countBooks } from "./count-books";

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

export type BookTable = TableData<typeof booksStatement>;

export async function getBooks(params?: GetParams): GetResults<BookTable> {
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const query = `%${params?.query || ""}%`;

  const [data, count] = await Promise.all([
    booksStatement.execute({
      limit,
      offset: (page - 1) * limit,
      query,
    }),
    countBooks(query),
  ]);

  return { data, count };
}
