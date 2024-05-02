import { subject } from "@/db/schema";
import db from "@/lib/db";
import { sql, eq } from "drizzle-orm";

const subjectsByIdStatement = db
  .select()
  .from(subject)
  .where(eq(subject.id, sql.placeholder("id")))
  .prepare("get_subject_by_id");

export async function getSubjectById(id: string) {
  const [subjectById] = await subjectsByIdStatement.execute({ id });
  return subjectById;
}
