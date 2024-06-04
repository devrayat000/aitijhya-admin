import { users } from "@/db/auth";
import db from "@/lib/db";
import { count, desc, sql } from "drizzle-orm";
import { unstable_cache as cache } from "next/cache";

const dailyUserStatement = db
  .select({
    count: count(users.id).as("user_count"),
    created_date: sql`to_char(${users.createdAt}, 'DD Mon YYYY')`
      .mapWith(String)
      .as("created_date"),
  })
  .from(users)
  .groupBy(sql`to_char(${users.createdAt}, 'DD Mon YYYY')`)
  .orderBy(desc(sql`created_date`))
  .limit(7)
  .prepare("get_daily_user_count_statement");

export const getDailyUserCount = cache(
  async () => {
    const dailyUserCount = await dailyUserStatement.execute();
    return dailyUserCount;
  },
  ["getDailyUserCount"],
  {
    tags: ["getDailyUserCount"],
    revalidate: 1800,
  }
);
