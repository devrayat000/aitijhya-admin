import { post } from "@/db/schema";
import db from "@/lib/db";
import { count, ilike, sql } from "drizzle-orm";

const postCountStatement = db
  .select({ count: count() })
  .from(post)
  .where(ilike(post.text, sql.placeholder("query")))
  .prepare("get_post_count");

export async function countPosts(query?: string) {
  query = `%${query ?? ""}%`;

  const [{ count }] = await postCountStatement.execute({ query });
  return count;
}
