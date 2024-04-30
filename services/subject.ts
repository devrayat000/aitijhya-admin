import { subject } from "@/db/schema";
import db from "@/lib/db";
import { count, ilike, sql, eq } from "drizzle-orm";
import { GetParams } from "./types";

// make prepared statements
const subjectsQuery = db.select().from(subject);

const subjectsStatement = subjectsQuery
  .offset(sql.placeholder("offset"))
  .limit(sql.placeholder("limit"))
  .where(ilike(subject.name, sql.placeholder("query")))
  .prepare("get_subjects");

const subjectCountStatement = db
  .select({ count: count() })
  .from(subject)
  .where(ilike(subject.name, sql.placeholder("query")))
  .prepare("get_subject_count");

const subjectsByIdStatement = subjectsQuery
  .where(eq(subject.id, sql.placeholder("id")))
  .prepare("get_subject_by_id");

export async function getSubjects(params?: GetParams) {
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const query = `%${params?.query || ""}%`;

  const [subjects, [{ count }]] = await Promise.all([
    subjectsStatement.execute({
      limit,
      offset: (page - 1) * limit,
      query,
    }),
    subjectCountStatement.execute({ query }),
  ]);

  return { subjects, count };
}

export async function getSubjectById(id: string) {
  const [newSubject] = await subjectsByIdStatement.execute({ id });
  return newSubject;
}
