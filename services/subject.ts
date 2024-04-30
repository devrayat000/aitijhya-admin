import { subject } from "@/db/schema";
import db from "@/lib/db";
import { count, ilike, sql, eq } from "drizzle-orm";
import { GetParams } from "./types";

// make prepared statements

const allSubjectsStatement = db
  .select()
  .from(subject)
  .prepare("get_all_subjects");

const subjectsStatement = db
  .select()
  .from(subject)
  .offset(sql.placeholder("offset"))
  .limit(sql.placeholder("limit"))
  .where(ilike(subject.name, sql.placeholder("query")))
  .prepare("get_subjects");

const subjectCountStatement = db
  .select({ count: count() })
  .from(subject)
  .where(ilike(subject.name, sql.placeholder("query")))
  .prepare("get_subject_count");

const subjectsByIdStatement = db
  .select()
  .from(subject)
  .where(eq(subject.id, sql.placeholder("id")))
  .prepare("get_subject_by_id");

export function getAllSubjects() {
  return allSubjectsStatement.execute();
}

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
