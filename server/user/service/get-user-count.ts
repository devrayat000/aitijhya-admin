import { users } from "@/db/auth";
import db from "@/lib/db";
import { count } from "drizzle-orm";

const dailyUserStatement = db
  .select({
    count: count().as("user_count"),
  })
  .from(users)
  .prepare("get_user_count_statement");

export async function getUserCount() {
  const [{ count }] = await dailyUserStatement.execute();
  return count;
}
