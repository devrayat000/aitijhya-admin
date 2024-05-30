import { subject } from "@/db/schema";
import db from "@/lib/db";
import { ilike, sql } from "drizzle-orm";
import { GetParams, GetResults, TableData } from "../../types";
import { countSubjects } from "./count-subjects";
import { getFilteredSubjects } from "./get-filtered-subjects";

const subjectsStatement = db
  .select()
  .from(subject)
  .offset(sql.placeholder("offset"))
  .limit(sql.placeholder("limit"))
  .where(ilike(subject.name, sql.placeholder("query")))
  .prepare("get_subjects");

export type SubjectTable = TableData<typeof subjectsStatement>;

export async function getSubjects(
  params?: GetParams
): GetResults<SubjectTable> {
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const query = params?.query;

  const [data, count] = await Promise.all([
    getFilteredSubjects({
      limit,
      page,
      query,
      fields: {
        id: subject.id,
        name: subject.name,
        createdAt: subject.createdAt,
      },
    }),
    countSubjects(query),
  ]);

  return { data, count };
}
