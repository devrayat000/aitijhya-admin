import { ad } from "@/db/schema";
import db from "@/lib/db";
import { count, ilike, sql } from "drizzle-orm";

const adCountStatement = db
  .select({ count: count() })
  .from(ad)
  .where(ilike(ad.title, sql.placeholder("query")))
  .prepare("get_ad_count");

export async function countAds(query?: string) {
  query = `%${query ?? ""}%`;

  const [{ count }] = await adCountStatement.execute({ query });

  return count;
}
