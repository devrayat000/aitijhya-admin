import { subject } from "@/db/schema";
import db from "@/lib/db";
import { sql, eq } from "drizzle-orm";
import { getFilteredSubjects } from "./get-filtered-subjects";

const subjectsByIdStatement = db
  .select()
  .from(subject)
  .where(eq(subject.id, sql.placeholder("id")))
  .prepare("get_subject_by_id");

export async function getSubjectById(id: string) {
  const [subjectById] = await getFilteredSubjects({
    subjects: [id],
    fields: {
      id: subject.id,
      name: subject.name,
      createdAt: subject.createdAt,
    },
  });
  return subjectById;
}
