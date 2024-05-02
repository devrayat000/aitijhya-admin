import { chapter } from "@/db/schema";
import db from "@/lib/db";
import { count, eq, ilike, sql } from "drizzle-orm";

const chapterCountStatement = db
  .select({ count: count() })
  .from(chapter)
  .where(ilike(chapter.name, sql.placeholder("query")))
  .prepare("get_chapter_count");

export async function countChapters(query?: string) {
  query = `%${query ?? ""}%`;

  const [{ count }] = await chapterCountStatement.execute({ query });

  return count;
}
