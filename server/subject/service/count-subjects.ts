import { subject } from "@/db/schema";
import db from "@/lib/db";
import { count, ilike, sql, eq } from "drizzle-orm";

const subjectCountStatement = db
  .select({ count: count() })
  .from(subject)
  .where(ilike(subject.name, sql.placeholder("query")))
  .prepare("get_subject_count");

export async function countSubjects(query?: string) {
  query = `%${query ?? ""}%`;

  const [{ count }] = await subjectCountStatement.execute({ query });

  return count;
}
