import { desc, eq } from "drizzle-orm";

import { searchHistory } from "@/db/schema";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { redirect } from "next/navigation";

export async function getCurrentUserSearchHistory() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }

  const history = await db
    .select()
    .from(searchHistory)
    .where(eq(searchHistory.userId, session.user.id))
    .orderBy(desc(searchHistory.createdAt))
    .limit(15);

  return history;
}

export type SearchHistory = Awaited<
  ReturnType<typeof getCurrentUserSearchHistory>
>;
