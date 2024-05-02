import { bookAuthor } from "@/db/schema";
import db from "@/lib/db";
import { count, ilike, sql } from "drizzle-orm";

const bookCountStatement = db
  .select({ count: count() })
  .from(bookAuthor)
  .where(ilike(bookAuthor.name, sql.placeholder("query")))
  .prepare("get_books_count");

export async function countBooks(query?: string) {
  query = `%${query ?? ""}%`;

  const [{ count }] = await bookCountStatement.execute({ query });

  return count;
}
